import { Request, Response } from "express";
import TipoEnsaioRepository from "../../repositories/ensaios/tipoEnsaio.repository";
import { enumClassificacaoAmostra } from "../../enum/amostras/classificacaoAmostra.enum";
import { ITipoEnsaio, TipoEnsaio } from "../../models/ensaios/dados/TipoEnsaio";

//TAREFA A SER REALIZADA: Depois de criar a entidade campos ensaios, criar uma rota para select dos campos de ensaio junto a essa entidade, e um create com campos de ensaio.
//TAREFA A SER REALIZADA: ADICIONAR A ROTA DE getByName

export const tipoEnsaioController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await TipoEnsaioRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhum tipo ensaio no banco de dados.' });
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

            const result = await TipoEnsaioRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum Tipo de Ensaio com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getDescription: async (req: Request, res: Response): Promise<void> => {
        try {
            const { descricao } = req.body;

            if (typeof descricao !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Descrição inválida.' });
                return;
            }

            const result = await TipoEnsaioRepository.findByDescription(descricao);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum Tipo de Ensaio para a função  informada.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getCategory: async (req: Request, res: Response): Promise<void> => {
        try {
            const { categoria } = req.params;

            // 1. Valida se a categoria foi informada e se faz parte do Enum
            const categoriasValidas = Object.values(enumClassificacaoAmostra);

            if (!categoria || !categoriasValidas.includes(categoria as enumClassificacaoAmostra)) {
                res.status(400).json({
                    message: 'Categoria inválida ou não fornecida.',
                    categoriasPermitidas: categoriasValidas
                });
                return;
            }

            // 2. Busca no repositório com o tipo validado
            const result = await TipoEnsaioRepository.findByCategory(categoria as enumClassificacaoAmostra);

            // 3. Verifica se encontrou resultados (trata null, undefined ou array vazio)
            if (!result || (Array.isArray(result) && result.length === 0)) {
                res.status(404).json({ message: 'Nenhum tipo de ensaio foi encontrado para esta categoria.' });
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
            const domainTipoEnsaio = TipoEnsaio.create(req.body);

            const result = await TipoEnsaioRepository.create(domainTipoEnsaio);

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

            const tipoEnsaioAtual = await TipoEnsaioRepository.findById(id);

            if (!tipoEnsaioAtual) {
                res.status(404).json({ message: 'Não foi encontrado nenhum tipo ensaio com esse ID.' });
                return;
            }

            const dadosAtualizados: ITipoEnsaio = {
                idTipoEnsaio: id,
                nomeEnsaio: req.body.nomeEnsaio ?? tipoEnsaioAtual.nomeEnsaio,
                descricaoEnsaio: req.body.descricaoEnsaio ?? tipoEnsaioAtual.descricao,
                categoriaAplicavel: req.body.categoriaAplicavel ?? tipoEnsaioAtual.categoriaAplicavel,
                dataCad: req.body.dataCad ?? tipoEnsaioAtual.dataCad,
                dataMod: req.body.dataMod ?? tipoEnsaioAtual.dataMod
            }

            // Passa o estado atual junto com as alterações do body
            const domainTipoEnsaio = TipoEnsaio.edit(id, dadosAtualizados);

            const result = await TipoEnsaioRepository.update(id, domainTipoEnsaio);

            res.status(200).json({ message: 'Tipo Ensaio atualizado com sucesso.', data: result });
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

            const tipoEnsaioAtual = await TipoEnsaioRepository.findById(id);
            if (!tipoEnsaioAtual) {
                res.status(404).json({ message: 'Não foi possível apagar. Nenhum Tipo Ensaio encontrado com esse ID.' });
                return;
            }

            await TipoEnsaioRepository.delete(id);

            res.status(200).json({ message: 'Requisição bem-sucedida. Campo Ensaio removido.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};