import { Request, Response } from "express";
import bcrypt from 'bcryptjs';
import { JwtService } from "../utils/JwtService";
import { FuncionarioRepository } from "../repositories/funcionarios/funcionario.repository";
import { limparCpf } from "../utils/validarCpf";
import Funcionario from "../models/funcionarios/Funcionario";
import { enumNivelPermissao } from "../enum/funcionarios/nivelPermissao.enum";
import { Attributes } from "sequelize";
import FuncionarioMap from "../mappings/funcionarios/funcionario.map";

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

            // 1. Busca os dados brutos no banco usando o repositório (com await)
            const dadosBanco: Attributes<FuncionarioMap> = await FuncionarioRepository.buscarPorCPF(limparCpf(cpf));

            if (!dadosBanco) {
                return res.status(400).json({ message: 'Usuário não encontrado' });
            }

            // 2. Instancia a classe de domínio para carregar as regras (e validações se houver)
            const user = Funcionario.create(dadosBanco);

            // 3. Compara a senha usando a propriedade correta: senhaHash
            const passwordMatch = await bcrypt.compare(password, user.senhaHash);
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