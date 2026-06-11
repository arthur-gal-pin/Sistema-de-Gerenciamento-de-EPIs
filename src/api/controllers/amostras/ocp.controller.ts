import { Response, Request } from "express";
import { OCP } from "../../models/amostras/OCP";
import { OcpRepository } from "../../repositories/amostras/ocp.respository";

export const OcpController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await OcpRepository.listarTodos();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhuma OCP no banco de dados.' });
                return;
            }
            
            res.status(200).json({ message: 'OCPs encontradas:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getId: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            
            if (!id || id.length !== 36) { 
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID inválido inserido.' });
                return;
            }

            const result = await OcpRepository.listarPorId(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma OCP com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getNome: async (req: Request, res: Response): Promise<void> => {
        try {
            const nome = String(req.params.nome);
            
            if (!nome || nome.length < 3) {
                res.status(400).json({ message: 'Não foi possível processar a requisição - O nome deve ter ao menos 3 caracteres.' });
                return;
            }

            const result = await OcpRepository.listarPorNome(nome);

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma OCP com esse nome.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    post: async (req: Request, res: Response): Promise<void> => {
        try {
            const nomeOCP = String(req.body.nome);
            
            const domainOcp = OCP.create(nomeOCP);
            
            const result = await OcpRepository.criarOcp(domainOcp.toJSON());
            
            res.status(201).json({ message: 'Requisição bem sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    put: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const nomeNovo = String(req.body.nome);

            const ocpAtual = await OcpRepository.listarPorId(id);
            if (!ocpAtual) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma OCP com esse ID.' });
                return;
            }

            const domainOcp = OCP.edit(id, nomeNovo);

            const result = await OcpRepository.atualizarOcp(id, domainOcp.toJSON());

            res.status(200).json({ message: 'OCP atualizada com sucesso.', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);

            if (!id || id.length !== 36) {
                res.status(400).json({ message: 'O id inserido é inválido.' });
                return;
            }

            const result = await OcpRepository.apagarOcp(id);

            if (!result) {
                res.status(400).json({ message: 'Não foi possível apagar. Nenhuma OCP encontrada com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida. OCP removida.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};