import { Request, Response } from "express";
import FuncionarioEnsaioRepository from "../../../repositories/ensaios/relacionamentos/funcionarioEnsaio.repository";
import { IFuncionarioEnsaio, FuncionarioEnsaio } from "../../../models/ensaios/relacionamentos/FuncionarioEnsaio";

export const funcionarioEnsaioController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await FuncionarioEnsaioRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhum funcionário ensaio no banco de dados.' });
                return;
            }

            res.status(200).json({ message: 'Funcionários do Ensaio encontrados:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getId: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;

            if (!id || id.length !== 36 || typeof id !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID inválido inserido.' });
                return;
            }

            const result = await FuncionarioEnsaioRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum Funcionário Ensaio com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getFuncionario: async (req: Request, res: Response): Promise<void> => {
        try {
            const { fk_funcionario } = req.params;

            if (!fk_funcionario || fk_funcionario.length !== 36 || typeof fk_funcionario !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Funcionário inválido.' });
                return;
            }

            const result = await FuncionarioEnsaioRepository.findByFuncionario(fk_funcionario);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum registro foi encontrado para este funcionário.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getFuncionario:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por funcionário.' });
        }
    },

    getEnsaio: async (req: Request, res: Response): Promise<void> => {
        try {
            const { fk_ensaio } = req.params;

            if (!fk_ensaio || fk_ensaio.length !== 36 || typeof fk_ensaio !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Ensaio inválido.' });
                return;
            }

            const result = await FuncionarioEnsaioRepository.findByEnsaio(fk_ensaio);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum registro foi encontrado para este ensaio.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getEnsaio:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por ensaio.' });
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const domainFuncionarioEnsaio = FuncionarioEnsaio.create(req.body);

            const result = await FuncionarioEnsaioRepository.create(domainFuncionarioEnsaio);

            res.status(201).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;

            if (!id || id.length !== 36 || typeof id !== 'string') {
                res.status(400).json({ message: 'Dados inválidos foram inseridos.' });
                return;
            }

            const funcionarioEnsaioAtual = await FuncionarioEnsaioRepository.findById(id);

            if (!funcionarioEnsaioAtual) {
                res.status(404).json({ message: 'Não foi encontrado nenhum funcionário ensaio com esse ID.' });
                return;
            }

            const dadosAtualizados: IFuncionarioEnsaio = {
                idFuncionarioEnsaio: id,
                FK_idFuncionario: req.body.FK_idFuncionario ?? req.body.fkIdFuncionario ?? funcionarioEnsaioAtual.fkIdFuncionario,
                FK_idEnsaio: req.body.FK_idEnsaio ?? req.body.fkIdEnsaio ?? funcionarioEnsaioAtual.fkIdEnsaio,
                dataCad: req.body.dataCad ?? funcionarioEnsaioAtual.dataCad,
                dataMod: req.body.dataMod ?? funcionarioEnsaioAtual.dataMod
            };

            const domainFuncionarioEnsaio = FuncionarioEnsaio.edit(id, dadosAtualizados);

            const result = await FuncionarioEnsaioRepository.update(id, domainFuncionarioEnsaio);

            res.status(200).json({ message: 'Funcionário Ensaio atualizado com sucesso.', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id;

            if (!id || id.length !== 36 || typeof id !== 'string') {
                res.status(400).json({ message: 'O id inserido é inválido.' });
                return;
            }

            const funcionarioEnsaioAtual = await FuncionarioEnsaioRepository.findById(id);
            if (!funcionarioEnsaioAtual) {
                res.status(404).json({ message: 'Não foi possível apagar. Nenhum Funcionário Ensaio encontrado com esse ID.' });
                return;
            }

            await FuncionarioEnsaioRepository.delete(id);

            res.status(200).json({ message: 'Requisição bem-sucedida. Funcionário Ensaio removido.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};