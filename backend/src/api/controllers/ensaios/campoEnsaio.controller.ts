import { Request, Response } from "express";
import CampoEnsaioRepository from "../../repositories/ensaios/campoEnsaio.repository";
import { ICampoEnsaio, CampoEnsaio } from "../../models/ensaios/dados/CampoEnsaio";


export const campoEnsaioController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await CampoEnsaioRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhum instrumento no banco de dados.' });
                return;
            }

            res.status(200).json({ message: 'Tipo de Ensaios encontrados:', data: result });
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

            const result = await CampoEnsaioRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum Campo Ensaio com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    getFK: async (req: Request, res: Response): Promise<void> => {
        try {
            const fk_id = req.params.fk;

            if (!fk_id || fk_id.length !== 36 || typeof fk_id !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Descrição inválida.' });
                return;
            }

            const result = await CampoEnsaioRepository.findByFK(fk_id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum Campo de Ensaio para o tipo de ensaio informada.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    getUnidadeMedida: async (req: Request, res: Response): Promise<void> => {
        try {
            const { unidadeMedida } = req.params;

            if(!unidadeMedida || typeof unidadeMedida !== 'string' || unidadeMedida.length > 10){
                res.status(400).json({message: 'Não foi possível processar a requisição - Unidade inválida.'});
                return;
            }

            // 2. Busca no repositório com o tipo validado
            const result = await CampoEnsaioRepository.findByUnidadeMedida(unidadeMedida);
            

            // 3. Verifica se encontrou resultados (trata null, undefined ou array vazio)
            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum campo foi encontrado para esta unidade.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });

        } catch (error: any) {
            console.error('Erro em getCategory:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por categoria.' });
        }
    },
    getName: async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome } = req.params;

            if(!nome || typeof nome !== 'string'){
                res.status(400).json({message: 'Não foi possível processar a requisição - nome inválido.'});
                return;
            }

            // 2. Busca no repositório com o tipo validado
            const result = await CampoEnsaioRepository.findByName(nome);
            

            // 3. Verifica se encontrou resultados (trata null, undefined ou array vazio)
            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum campo foi encontrado para este nome.' });
                return;
            }

            res.status(200).json({
                message: 'Busca realizada com sucesso.',
                data: result
            });

        } catch (error: any) {
            console.error('Erro em getCategory:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao buscar por categoria.' });
        }
    },
    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const domainCampoEnsaio = CampoEnsaio.create(req.body);

            const result = await CampoEnsaioRepository.create(domainCampoEnsaio);

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

            const campoEnsaioAtual = await CampoEnsaioRepository.findById(id);

            if (!campoEnsaioAtual) {
                res.status(404).json({ message: 'Não foi encontrado nenhum campo com esse ID.' });
                return;
            }

            const dadosAtualizados: ICampoEnsaio = {
                idCampoEnsaio: id,
                FK_idTipoEnsaio: req.body.fkIdTipoEnsaio ?? campoEnsaioAtual.fkIdTipoEnsaio,
                nomeCampo: req.body.nomeCampo ?? campoEnsaioAtual.nomeCampo,
                descricao: req.body.descricao ?? campoEnsaioAtual.descricao,
                unidadeMedida: req.body.unidadeMedida ?? campoEnsaioAtual.unidadeMedida,
                tipoDado: req.body.tipoDado ?? campoEnsaioAtual.tipoDado,
                obrigatoriedade: req.body.obrigatoriedade ?? campoEnsaioAtual.obrigatoriedade,
                dataCad: req.body.dataCad ?? campoEnsaioAtual.dataCad,
                dataMod: req.body.dataMod ?? campoEnsaioAtual.dataMod
            }

            // Passa o estado atual junto com as alterações do body
            const domainCampoEnsaio = CampoEnsaio.edit(id, dadosAtualizados);

            const result = await CampoEnsaioRepository.update(id, domainCampoEnsaio);

            res.status(200).json({ message: 'Protocolo atualizado com sucesso.', data: result });
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

            const campoEnsaioAtual = await CampoEnsaioRepository.findById(id);
            if (!campoEnsaioAtual) {
                res.status(404).json({ message: 'Não foi possível apagar. Nenhum Tipo Ensaio encontrado com esse ID.' });
                return;
            }

            await CampoEnsaioRepository.delete(id);

            res.status(200).json({ message: 'Requisição bem-sucedida. Campo Ensaio removido.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};