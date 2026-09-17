import { Request, Response, NextFunction } from "express";
import { JwtService } from "../utils/JwtService";
import { enumNivelPermissao } from "../enum/funcionarios/nivelPermissao.enum";

declare global {
    namespace Express {
        interface Request {
            user?: {
                idFuncionario: string;
                nome: string
                email: string;
                nivelPermissao: enumNivelPermissao;
            }
        }
    }
}

export class AuthMiddleware {
    private jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    authenticate = (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Token não fornecido' });
            return;
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = this.jwtService.verificarTokenAcesso(token);
            console.log("TOKEN DECODED: ", decoded);

            req.user = {
                idFuncionario: String(decoded.idFuncionario),
                nome: String(decoded.nome),
                email: decoded.email,
                nivelPermissao: decoded.nivelPermissao
            };

            next();
        } catch (error) {
            res.status(401).json({ message: 'Token inválido ou expirado' });
        }
    }

    autorizar = (...niveisPermitidos: enumNivelPermissao[]) => {
        return (req: Request, res: Response, next: NextFunction): void => {
            const nivelUsuario = req.user?.nivelPermissao;

            if (!nivelUsuario || !niveisPermitidos.includes(nivelUsuario)) {
                res.status(403).json({ message: 'Acesso negado: permissão insuficiente' });
                return;
            }

            next();
        };
    }
}