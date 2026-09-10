import Funcionario from "../../../models/funcionarios/Funcionario";
import { FuncionarioRepository } from "../../../repositories/funcionarios/funcionario.repository";
import { Request, Response } from "express";
import { uuid } from "uuidv4";
//Adcionar a opção para administradores ou coordenadores de apenas vizualizarem os usuários ativos do sistema 

export const profileActions = {
    atualizarSenha: async (req: Request, res: Response): Promise<void> =>{
        const usuárioLido = req.user;
        const {senhaInformada, senhaNova} = req.body;

        if(!usuárioLido){
            res.status(400).json({message: 'Não foi enviado nenhum usuário dentro da requisição'});
            return;
        };

        if(!senhaInformada || !senhaNova || typeof senhaInformada !== 'string' || typeof senhaNova !== 'string') {
            res.status(400).json({message: 'As senhas informadas são inválidas ou estão nulas.'});
        }

        validarSenha


    },
    atualizarInfos: async (req: Request, res:Response): Promise<void> =>{

    },
    atualizarPfp: async (req: Request, res: Response): Promise<void>=> {

    }
}