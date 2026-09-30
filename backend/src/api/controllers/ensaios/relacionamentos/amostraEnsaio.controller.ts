import { Request, Response } from "express";
import AmostraEnsaioRepository from "../../../repositories/ensaios/relacionamentos/amostraEnsaio.repository";
import { IAmostraEnsaio, AmostraEnsaio } from "../../../models/ensaios/relacionamentos/AmostraEnsaio";

export const amostraEnsaioController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await AmostraEnsaioRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma amostra ensaio no banco de dados.' });
                return;
            }

            res.status(200).json({ message: 'Amostras de Ensaio encontradas:', data: result });
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

            const result = await AmostraEnsaioRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma Amostra Ensaio com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getAmostra: async (req: Request, res: Response): Promise<void> => {
        try {
            const { fk_amostra } = req.params;

            if (!fk_amostra || fk_amostra.length !== 36 || typeof fk_amostra !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Amostra inválido.' });
                return;
            }

            const result = await AmostraEnsaioRepository.findByAmostra(fk_amostra);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhuma amostra ensaio foi encontrada para esta amostra.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getAmostra:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por amostra.' });
        }
    },

    getEnsaio: async (req: Request, res: Response): Promise<void> => {
        try {
            const { fk_ensaio } = req.params;

            if (!fk_ensaio || fk_ensaio.length !== 36 || typeof fk_ensaio !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Ensaio inválido.' });
                return;
            }

            const result = await AmostraEnsaioRepository.findByEnsaio(fk_ensaio);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhuma amostra ensaio foi encontrada para este ensaio.' });
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

    getInstrumento: async (req: Request, res: Response): Promise<void> => {
        try {
            const { fk_instrumento } = req.params;

            if (!fk_instrumento || fk_instrumento.length !== 36 || typeof fk_instrumento !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Instrumento inválido.' });
                return;
            }

            const result = await AmostraEnsaioRepository.findByInstrumento(fk_instrumento);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhuma amostra ensaio foi encontrada para este instrumento.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getInstrumento:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por instrumento.' });
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const domainAmostraEnsaio = AmostraEnsaio.create(req.body);

            const result = await AmostraEnsaioRepository.create(domainAmostraEnsaio);

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

            const amostraEnsaioAtual = await AmostraEnsaioRepository.findById(id);

            if (!amostraEnsaioAtual) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma amostra ensaio com esse ID.' });
                return;
            }

            const dadosAtualizados: IAmostraEnsaio = {
                idAmostraEnsaio: id,
                FK_idAmostra: req.body.FK_idAmostra ?? req.body.fkIdAmostra ?? amostraEnsaioAtual.fkIdAmostra,
                FK_idEnsaio: req.body.FK_idEnsaio ?? req.body.fkIdEnsaio ?? amostraEnsaioAtual.fkIdEnsaio,
                FK_idInstrumento: req.body.FK_idInstrumento ?? req.body.fkIdInstrumento ?? amostraEnsaioAtual.fkIdInstrumento,
                temperatura: req.body.temperatura ?? amostraEnsaioAtual.temperatura,
                umidade: req.body.umidade ?? amostraEnsaioAtual.umidade,
                pressao: req.body.pressao ?? amostraEnsaioAtual.pressao,
                dataCad: req.body.dataCad ?? amostraEnsaioAtual.dataCad,
                dataMod: req.body.dataMod ?? amostraEnsaioAtual.dataMod
            };

            const domainAmostraEnsaio = AmostraEnsaio.edit(id, dadosAtualizados);

            const result = await AmostraEnsaioRepository.update(id, domainAmostraEnsaio);

            res.status(200).json({ message: 'Amostra Ensaio atualizada com sucesso.', data: result });
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

            const amostraEnsaioAtual = await AmostraEnsaioRepository.findById(id);
            if (!amostraEnsaioAtual) {
                res.status(404).json({ message: 'Não foi possível apagar. Nenhuma Amostra Ensaio encontrada com esse ID.' });
                return;
            }

            await AmostraEnsaioRepository.delete(id);

            res.status(200).json({ message: 'Requisição bem-sucedida. Amostra Ensaio removida.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};