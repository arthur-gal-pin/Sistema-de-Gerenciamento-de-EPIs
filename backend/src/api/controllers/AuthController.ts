import bcrypt from 'bcryptjs';
import { Request, Response } from "express";

import Funcionario from "../models/funcionarios/Funcionario";
import { FuncionarioRepository } from "../repositories/funcionarios/funcionario.repository";

import { JwtService } from "../utils/JwtService";
import { limparCpf, validarCpf } from "../utils/validarCpf";

import { enumEquipes } from '../enum/funcionarios/equipes.enum';
import { enumNivelPermissao } from "../enum/funcionarios/nivelPermissao.enum";
import { enumSituacaoEmpregaticia } from "../enum/funcionarios/situacaoEmpregaticia";
import Mail from "../services/Mail";

export class AuthController {
    private jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    // Autentica o usuário e retorna o token
    login = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { cpf, senha } = req.body;

            if (!cpf || !senha) {
                return res.status(400).json({ message: 'CPF e senha são obrigatórios' });
            }

            // 1. Busca os dados brutos no banco usando o repositório (com await)
            if (!validarCpf(limparCpf(String(cpf)))) {
                return res.status(400).json({ message: `Esse CPF não existe.` });
            }
            const dadosBanco = await FuncionarioRepository.buscarPorCPF(limparCpf(cpf));

            if (!dadosBanco) {
                return res.status(400).json({ message: 'Usuário não encontrado' });
            }

            // 2. Instancia a classe de domínio para carregar as regras (e validações se houver)
            // Obs: o Prisma é estrito quanto a tipos/nomes de campos (diferente do Sequelize,
            // que deixava passar isso silenciosamente). Por isso mapeamos explicitamente:
            // - `fkIdCargo` (nome do model Prisma) -> `FK_idCargo` (chave esperada por IFuncionario)
            // - `situacaoEmpregaticia` (string no Prisma) -> enum
            // - `caminhoImagemPerfil` (string | null no Prisma) -> string | undefined
            const user = Funcionario.create({
                idFuncionario: dadosBanco.idFuncionario,
                FK_idCargo: dadosBanco.fkIdCargo,
                nomeFuncionario: dadosBanco.nomeFuncionario,
                sobrenomeFuncionario: dadosBanco.sobrenomeFuncionario,
                cpf: dadosBanco.cpf,
                email: dadosBanco.email,
                senhaHash: dadosBanco.senhaHash,
                situacaoEmpregaticia: dadosBanco.situacaoEmpregaticia as enumSituacaoEmpregaticia,
                caminhoImagemPerfil: dadosBanco.caminhoImagemPerfil ?? undefined,
            });

            // 3. Compara a senha usando a propriedade correta: senhaHash
            const passwordMatch = await bcrypt.compare(String(senha), user.senhaHash);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Credenciais inválidas' });
            }

            //Caso o usuário esteja afastado ou inativo ele não poderá acessar o sistema, mesmo com as credenciais corretas
            if (dadosBanco.situacaoEmpregaticia === enumSituacaoEmpregaticia.inativo || dadosBanco.situacaoEmpregaticia === enumSituacaoEmpregaticia.afastado) {
                return res.status(403).json({ message: 'Você não tem mais acesso ao sistema.' })
            }

            const cargo = (dadosBanco as any).cargo;

            const payload = {
                idFuncionario: String(user.idFuncionario),
                email: user.email,
                nome: user.nomeFuncionario,
                nivelPermissao: cargo?.nivelPermissao as enumNivelPermissao
            };
            const accessToken = this.jwtService.gerarTokenAcesso(payload);


            res.cookie('token', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 3600000
            });

            return res.status(200).json({ message: "Login bem-sucedido!" });


        } catch (error: unknown) {
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' });
        }
    }

    logout = async (req: Request, res: Response): Promise<Response> => {
        try {
            // Limpa o cookie 'token' configurando as mesmas opções de segurança usadas na criação
            res.clearCookie('token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

            return res.status(200).json({ message: "Logout realizado com sucesso!" });
        } catch (error: unknown) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao realizar logout' });
        }
    }

    esqueciASenha = async (req: Request, res: Response) => {
        try {
            const { cpf, nome, email, equipe, texto } = req.body;

            if (!cpf || !nome || !email || !equipe) {
                return res.status(400).json({ message: 'Todas as informações de contato são necessárias.' });
            }

            const cpfLimpo = limparCpf(String(cpf));

            if (!validarCpf(cpfLimpo)) {
                return res.status(400).json({ message: `Esse CPF não existe.` });
            }

            if (!Object.values(enumEquipes).includes(equipe)) {
                return res.status(400).json({ message: "Essa equipe não existe." });
            }

            // Verifica se o funcionário existe no banco
            const dadosBanco = await FuncionarioRepository.buscarPorCPF(cpfLimpo);
            let nomeFuncionarioFinal = nome;
            let cpfFinal = cpfLimpo;

            if (dadosBanco) {
                nomeFuncionarioFinal = dadosBanco.nomeFuncionario;
                cpfFinal = dadosBanco.cpf;
            }

            // Envia as informações para o administrador, independentemente de o CPF existir ou não no banco
            const idAdministrador = await FuncionarioRepository.buscarAdministrador(equipe as enumEquipes);

            if (idAdministrador) {
                const administrador = await FuncionarioRepository.listarPorId(idAdministrador);

                if (administrador?.email) {
                    try {
                        const assunto = dadosBanco
                            ? 'Solicitação de redefinição de senha'
                            : 'Solicitação de suporte / Novo contato (CPF não cadastrado)';

                        const mensagemHtml = `
                        <p><strong>Nome informado:</strong> ${nomeFuncionarioFinal}</p>
                        <p><strong>CPF informado:</strong> ${cpfFinal}</p>
                        <p><strong>E-mail informado:</strong> ${email}</p>
                        <p><strong>Status no sistema:</strong> ${dadosBanco ? 'Cadastrado' : 'Não cadastrado na base'}</p>
                        ${texto ? `<p><strong>Mensagem enviada:</strong> ${texto}</p>` : ''}
                    `;

                        const mail = new Mail(administrador.email, assunto, mensagemHtml);
                        await mail.sendMail();
                    } catch (mailError) {
                        console.error('Erro ao enviar e-mail:', mailError);
                    }
                }
            }

            // Resposta genérica para manter a segurança contra enumeração de usuários
            return res.status(200).json({
                message: 'Se os dados informados estiverem corretos, o responsável pela sua equipe foi notificado.'
            });

        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            } else {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' });
            }
        }
    }
}