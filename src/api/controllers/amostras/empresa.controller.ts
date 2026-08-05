import { Response, Request } from "express";
import { Empresa } from "../../models/amostras/Empresa";
import { EmpresaRepository } from "../../repositories/amostras/empresa.repository";

export const EmpresaController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await EmpresaRepository.listarTodos();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma empresa no banco de dados.' });
                return; 
            }
            
            res.status(200).json({ message: 'Empresas encontradas:', data: result });
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

            const result = await EmpresaRepository.listarPorId(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma empresa com esse ID.' });
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

            const result = await EmpresaRepository.listarPorNome(nome);

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma empresa com esse nome.' });
                return; 
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    post: async (req: Request, res: Response): Promise<void> => {
        try {
            const nomeEmpresa = String(req.body.nome);
            
            const domainEmpresa = Empresa.create({ nomeEmpresa });
            
            const result = await EmpresaRepository.criarEmpresa(domainEmpresa.toJSON());
            
            res.status(201).json({ message: 'Requisição bem sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    put: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const nomeNovo = String(req.body.nome);

            const empresaAtual = await EmpresaRepository.listarPorId(id);
            if (!empresaAtual) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma empresa com esse ID.' });
                return; 
            }

            const domainEmpresa = Empresa.edit(id, { nomeEmpresa: nomeNovo });

            const result = await EmpresaRepository.atualizarEmpresa(id, domainEmpresa.toJSON());

            res.status(200).json({ message: 'Empresa atualizada com sucesso.', data: result });
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

            const result = await EmpresaRepository.apagarEmpresa(id);

            if (!result) {
                res.status(400).json({ message: 'Não foi possível apagar. Nenhuma Empresa encontrada com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida. Empresa removida.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};