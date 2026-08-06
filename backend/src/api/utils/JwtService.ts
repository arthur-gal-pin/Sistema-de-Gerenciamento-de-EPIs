import jwt from "jsonwebtoken";
import 'dotenv/config';
import { enumNivelPermissao } from "../enum/funcionarios/nivelPermissao.enum";

export interface JwtDados {
    idFuncionario: string | null;
    email: string;
    nome: string;
    nivelPermissao: enumNivelPermissao
}

export class JwtService {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        this.secret = process.env.JWT_SECRET || 'default_secret';
        this.expiresIn = process.env.JWT_EXPIRES_IN || '1m';
    }

    gerarTokenAcesso(dados: JwtDados): string {
        return jwt.sign(dados, this.secret, {
            expiresIn: this.expiresIn as jwt.SignOptions['expiresIn'],
        })
    }
    verificarTokenAcesso(token: string): JwtDados {
        return jwt.verify(token, this.secret) as JwtDados;
    }
    decodificarToken(token: string): JwtDados  | null{
        return jwt.decode(token) as JwtDados | null;
    }
}