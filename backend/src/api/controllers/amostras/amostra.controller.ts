import { Request, Response } from 'express';
import Amostra from '../../models/amostras/Amostra';
import { AmostraRepository } from '../../repositories/amostras/amostra.repository';

export const AmostraController = {
    
    // Lista todas as amostras
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await AmostraRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma amostra no banco de dados.' });
                return;
            }

            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Busca uma amostra específica por ID
    getId: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const result = await AmostraRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma amostra com esse ID.' });
                return;
            }

            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Busca amostras por Nome
    getNome: async (req: Request, res: Response): Promise<void> => {
        try {
            const nome = String(req.params.nome);
            const result = await AmostraRepository.findByNome(nome);

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma amostra com esse nome.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Busca amostras por Código
    getCodigo: async (req: Request, res: Response): Promise<void> => {
        try {
            const codigo = String(req.params.codigo);
            const result = await AmostraRepository.findByCodigo(codigo);

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma amostra com esse código.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Busca amostras por ID de Protocolo
    getProtocolo: async (req: Request, res: Response): Promise<void> => {
        try {
            const idProtocolo = String(req.params.idProtocolo);
            const result = await AmostraRepository.findByProtocolo(idProtocolo);

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foram encontradas amostras para este protocolo.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Busca amostras por Classificação
    getClassificacao: async (req: Request, res: Response): Promise<void> => {
        try {
            const classificacao = String(req.params.classificacao);
            const result = await AmostraRepository.findByClassificacao(classificacao);

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foram encontradas amostras com esta classificação.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Busca amostras por Subclassificação
    getSubclassificacao: async (req: Request, res: Response): Promise<void> => {
        try {
            const subclassificacao = String(req.params.subclassificacao);
            const result = await AmostraRepository.findBySubclassificacao(subclassificacao);

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foram encontradas amostras com esta subclassificação.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Cria uma nova amostra instanciando o modelo de domínio primeiro
    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const { 
                FK_idProtocolo, 
                codigoAmostra, 
                nomeAmostra, 
                situacaoAmostra, 
                classificacaoAmostra, 
                subclassificacaoAmostra, 
                descricao 
            } = req.body;

            // Instancia o domínio usando a factory (com validações de negócio)
            const domainAmostra = Amostra.create({
                idAmostra: null,
                FK_idProtocolo,
                codigoAmostra,
                nomeAmostra,
                situacaoAmostra,
                classificacaoAmostra,
                subclassificacaoAmostra,
                descricao
            });

            // Passa os dados validados para o repositório
            const resultado = await AmostraRepository.create(domainAmostra.toJSON());
            
            res.status(201).json({ message: "Amostra criada com sucesso", data: resultado });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Atualiza os dados de uma amostra existente
    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const dadosNovos = req.body;

            // Verifica se a amostra existe
            const amostraAtual = await AmostraRepository.findById(id);
            if (!amostraAtual) {
                res.status(404).json({ message: "Amostra não encontrada" });
                return;
            }

            // Cria a instância de edição com validações
            const amostraEditada = Amostra.edit(id, dadosNovos);

            // Persiste no banco
            const result = await AmostraRepository.update(id, amostraEditada.toJSON());

            res.status(200).json({ message: "Amostra atualizada com sucesso", data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Remove uma amostra do banco pelo ID
    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const amostra = await AmostraRepository.findById(id);

            if (!amostra) {
                res.status(404).json({ message: "Amostra não encontrada" });
                return;
            }

            await AmostraRepository.delete(id);

            res.status(200).json({ message: "Amostra removida com sucesso" });
        } catch (error: any) {
            res.status(500).json({ message: "Erro interno", error: error.message });
        }
    }
};