import { Request, Response, NextFunction } from "express";
import { JwtService } from "../utils/JwtService";

// 1. CORRIGIDO: Atualizamos a tipagem do Express para aceitar o novo padrão de Funcionário
declare global {
    namespace Express {
        interface Request {
            user?: { 
                idFuncionario: string; 
                email: string; 
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
            
            // 2. CORRIGIDO: Chaves batendo perfeitamente com a interface declarada lá em cima
            req.user = { 
                idFuncionario: String(decoded.idFuncionario), 
                email: decoded.email 
            };

            next();
        } catch (error) {
            res.status(401).json({ message: 'Token inválido ou expirado' });
        }
    }
}