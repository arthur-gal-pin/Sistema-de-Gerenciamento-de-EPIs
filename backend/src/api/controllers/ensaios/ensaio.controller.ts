import { Request, Response } from "express";
import { IEnsaio, Ensaio } from "../../models/ensaios/Ensaio";
import EnsaioRepository from "../../repositories/ensaios/ensaio.repository";

export const ensaioController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await EnsaioRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhum ensaio no banco de dados.' });
                return;
            }

            res.status(200).json({ message: 'Ensaios encontrados:', data: result });
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

            const result = await EnsaioRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum Ensaio com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getName: async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome } = req.params;

            if (!nome || typeof nome !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - nome inválido.' });
                return;
            }

            const result = await EnsaioRepository.findByName(nome);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum ensaio foi encontrado para este nome.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getName:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por nome.' });
        }
    },

    getDescription: async (req: Request, res: Response): Promise<void> => {
        try {
            const { descricao } = req.params;

            if (!descricao || typeof descricao !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Descrição inválida.' });
                return;
            }

            const result = await EnsaioRepository.findByDescription(descricao);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum ensaio foi encontrado para esta descrição.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getDescription:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por descrição.' });
        }
    },

    getPapelEnsaio: async (req: Request, res: Response): Promise<void> => {
        try {
            const { papel } = req.params;

            if (!papel || typeof papel !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Papel do ensaio inválido.' });
                return;
            }

            const result = await EnsaioRepository.findByPapelEnsaio(papel);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum ensaio foi encontrado para este papel.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getPapelEnsaio:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por papel do ensaio.' });
        }
    },

    getProtocolo: async (req: Request, res: Response): Promise<void> => {
        try {
            const { idProtocolo } = req.params;

            if (!idProtocolo || idProtocolo.length !== 36 || typeof idProtocolo !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Protocolo inválido.' });
                return;
            }

            const result = await EnsaioRepository.findByProtocolo(idProtocolo);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum ensaio foi encontrado para este protocolo.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getProtocolo:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por protocolo.' });
        }
    },

    getTipoEnsaio: async (req: Request, res: Response): Promise<void> => {
        try {
            const { idTipoEnsaio } = req.params;

            if (!idTipoEnsaio || idTipoEnsaio.length !== 36 || typeof idTipoEnsaio !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Tipo de Ensaio inválido.' });
                return;
            }

            const result = await EnsaioRepository.findByTipoEnsaio(idTipoEnsaio);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum ensaio foi encontrado para este tipo de ensaio.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getTipoEnsaio:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por tipo de ensaio.' });
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const domainEnsaio = Ensaio.create(req.body);

            const result = await EnsaioRepository.create(domainEnsaio);

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

            const ensaioAtual = await EnsaioRepository.findById(id);

            if (!ensaioAtual) {
                res.status(404).json({ message: 'Não foi encontrado nenhum ensaio com esse ID.' });
                return;
            }

            const dadosAtualizados: IEnsaio = {
                idEnsaio: id,
                FK_idProtocolo: req.body.fkIdProtocolo ?? ensaioAtual.fkIdProtocolo,
                FK_idTipoEnsaio: req.body.fkIdTipoEnsaio ?? ensaioAtual.fkIdTipoEnsaio,
                nomeEnsaio: req.body.nomeEnsaio ?? ensaioAtual.nomeEnsaio,
                papel: req.body.papelEnsaio ?? ensaioAtual.papelEnsaio,
                descricao: req.body.descricao ?? ensaioAtual.descricao,
                dataCad: req.body.dataCad ?? ensaioAtual.dataCad,
                dataMod: req.body.dataMod ?? ensaioAtual.dataMod
            };

            const domainEnsaio = Ensaio.edit(id, dadosAtualizados);

            const result = await EnsaioRepository.update(id, domainEnsaio);

            res.status(200).json({ message: 'Ensaio atualizado com sucesso.', data: result });
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

            const ensaioAtual = await EnsaioRepository.findById(id);
            if (!ensaioAtual) {
                res.status(404).json({ message: 'Não foi possível apagar. Nenhum Ensaio encontrado com esse ID.' });
                return;
            }

            await EnsaioRepository.delete(id);

            res.status(200).json({ message: 'Requisição bem-sucedida. Ensaio removido.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};