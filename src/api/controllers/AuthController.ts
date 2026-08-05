import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { JwtService } from "../utils/JwtService";
import { FuncionarioRepository } from "../repositories/funcionarios/funcionario.repository";
import { limparCpf, validarCpf } from "../utils/validarCpf";
import Funcionario from "../models/funcionarios/Funcionario";
import { enumNivelPermissao } from "../enum/funcionarios/nivelPermissao.enum";
import { enumSituacaoEmpregaticia } from "../enum/funcionarios/situacaoEmpregaticia";

export class AuthController {
    private jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    // Autentica o usuário e retorna o token
    login = async (req: Request, res: Response): Promise<Response | void> => {
        try {
            const { cpf, password } = req.body;

            if (!cpf || !password) {
                return res.status(400).json({ message: 'CPF e senha são obrigatórios' });
            }
            console.log(cpf, password, typeof(String(cpf)));

            // 1. Busca os dados brutos no banco usando o repositório (com await)
            if(!validarCpf(limparCpf(String(cpf)))){
                return res.status(400).json({message: `Esse CPF não existe.`});
            }
            const dadosBanco = await FuncionarioRepository.buscarPorCPF(limparCpf(cpf));

            if (!dadosBanco) {
                return res.status(400).json({ message: 'Usuário não encontrado' });
            }

            console.log(dadosBanco)
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
            const passwordMatch = await bcrypt.compare(String(password), user.senhaHash);
            if (!passwordMatch) {
                return res.status(400).json({ message: 'Credenciais inválidas' });
            }

            const cargo = (dadosBanco as any).cargo;

            const payload = {
                idFuncionario: String(user.idFuncionario),
                email: user.email,
                nome: user.nomeFuncionario,
                nivelPermissao: cargo?.nivelPermissao as enumNivelPermissao
            };
            const accessToken = this.jwtService.gerarTokenAcesso(payload);

            return res.status(200).json({
                message: 'Login realizado com sucesso',
                data: {
                    token_acesso: accessToken,
                    expira_em: process.env.JWT_EXPIRES_IN || '1m'
                }
            });

        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            }
            return res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' });
        }
    }

    rotaProtegida = async (req: Request, res: Response) => {
        try {
            res.status(200).json({
                message: 'Você acessou um recurso protegido',
            });
        } catch (error: unknown) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
            } else {
                res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: 'Erro desconhecido' });
            }
        }
    }
}