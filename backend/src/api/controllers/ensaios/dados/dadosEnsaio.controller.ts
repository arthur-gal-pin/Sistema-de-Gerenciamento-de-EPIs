import { Request, Response } from "express";
import DadosEnsaioRepository from "../../../repositories/ensaios/dados/dadosEnsaio.repository";
import { IDadosEnsaio, DadosEnsaio } from "../../../models/ensaios/dados/DadosEnsaio";

export const dadosEnsaioController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await DadosEnsaioRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhum dado de ensaio no banco de dados.' });
                return;
            }

            res.status(200).json({ message: 'Dados de Ensaio encontrados:', data: result });
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

            const result = await DadosEnsaioRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum Dado de Ensaio com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getAmostraEnsaio: async (req: Request, res: Response): Promise<void> => {
        try {
            const { fk_amostra_ensaio } = req.params;

            if (!fk_amostra_ensaio || fk_amostra_ensaio.length !== 36 || typeof fk_amostra_ensaio !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Amostra Ensaio inválido.' });
                return;
            }

            const result = await DadosEnsaioRepository.findByAmostraEnsaio(fk_amostra_ensaio);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum dado foi encontrado para esta amostra ensaio.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getAmostraEnsaio:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por amostra ensaio.' });
        }
    },

    getCampoEnsaio: async (req: Request, res: Response): Promise<void> => {
        try {
            const { fk_campo_ensaio } = req.params;

            if (!fk_campo_ensaio || fk_campo_ensaio.length !== 36 || typeof fk_campo_ensaio !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - ID de Campo Ensaio inválido.' });
                return;
            }

            const result = await DadosEnsaioRepository.findByCampoEnsaio(fk_campo_ensaio);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum dado foi encontrado para este campo de ensaio.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });
        } catch (error: any) {
            console.error('Erro em getCampoEnsaio:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por campo de ensaio.' });
        }
    },

    getName: async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome } = req.params;

            if (!nome || typeof nome !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - nome inválido.' });
                return;
            }

            const result = await DadosEnsaioRepository.findByName(nome);

            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum dado foi encontrado para este nome.' });
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

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const domainDadosEnsaio = DadosEnsaio.create(req.body);

            const result = await DadosEnsaioRepository.create(domainDadosEnsaio);

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

            const dadosEnsaioAtual = await DadosEnsaioRepository.findById(id);

            if (!dadosEnsaioAtual) {
                res.status(404).json({ message: 'Não foi encontrado nenhum dado de ensaio com esse ID.' });
                return;
            }

            const dadosAtualizados: IDadosEnsaio = {
                idDadosEnsaio: id,
                FK_idAmostraEnsaio: req.body.FK_idAmostraEnsaio ?? req.body.fkIdAmostraEnsaio ?? dadosEnsaioAtual.fkIdAmostraEnsaio,
                FK_idCampoEnsaio: req.body.FK_idCampoEnsaio ?? req.body.fkIdCampoEnsaio ?? dadosEnsaioAtual.fkIdCampoEnsaio,
                nomeDado: req.body.nomeDado ?? dadosEnsaioAtual.nomeDado,
                dado: req.body.dado ?? dadosEnsaioAtual.dado,
                dataCad: req.body.dataCad ?? dadosEnsaioAtual.dataCad,
                dataMod: req.body.dataMod ?? dadosEnsaioAtual.dataMod
            };

            const domainDadosEnsaio = DadosEnsaio.edit(id, dadosAtualizados);

            const result = await DadosEnsaioRepository.update(id, domainDadosEnsaio);

            res.status(200).json({ message: 'Dado de Ensaio atualizado com sucesso.', data: result });
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

            const dadosEnsaioAtual = await DadosEnsaioRepository.findById(id);
            if (!dadosEnsaioAtual) {
                res.status(404).json({ message: 'Não foi possível apagar. Nenhum Dado de Ensaio encontrado com esse ID.' });
                return;
            }

            await DadosEnsaioRepository.delete(id);

            res.status(200).json({ message: 'Requisição bem-sucedida. Dado de Ensaio removido.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};