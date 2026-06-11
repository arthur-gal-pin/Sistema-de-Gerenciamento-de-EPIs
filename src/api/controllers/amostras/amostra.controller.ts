import { Request, Response } from 'express';
import Amostra from '../../models/amostras/Amostra';
import { AmostraRepository } from '../../repositories/amostras/amostra.repository';

export const AmostraController = {
    
    // Lista todas as amostras
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await AmostraRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrada nenhuma amostra nesse banco de dados.' });
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

            if (result === null) {
                res.status(404).json({ message: 'Não foi encontrada nenhuão foi ema amostra com esse id.' });
                return;
            }

            res.status(200).json({ data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    getNome: async (req: Request, res: Response): Promise<void> =>{
        try {
            const nome = String(req.query.nome);
            const result = await AmostraRepository.findByNome(nome);

            if(result === null){
                res.status(404).json({message: 'Não foi possível encontrar uma empresa com esse nome.'});
                return;
            }

            res.status(200).json({message:'Requisição bem-sucedida:', data: result});
            
        } catch (error: any) {
            res.status(400).json({message: error.message})
        }
    },

    // Cria uma nova amostra instanciando o modelo de domínio primeiro

    post: async (req: Request, res: Response): Promise<void> => {
        try {
            const { FK_idOCP, FK_idEmpresa, nomeAmostra, tipoAmostra, situacaoAmostra } = req.body;

            // Instancia o domínio usando a factory (onde rodam as validações de negócio)
            const domainAmostra = Amostra.create({
                idAmostra: null,
                FK_idOCP,
                FK_idEmpresa,
                nomeAmostra,
                tipoAmostra,
                situacaoAmostra
            });

            // Passa os dados puros validados para a camada de infraestrutura
            const resultado = await AmostraRepository.create(domainAmostra.toJSON());
            
            res.status(201).json(resultado);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    // Atualiza os dados de uma amostra existente
    put: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const dadosNovos = req.body;

            // Verifica se a amostra de fato existe antes de prosseguir
            const amostraAtual = await AmostraRepository.findById(id);
            if (!amostraAtual) {
                res.status(404).json({ message: "Amostra não encontrada" });
                return;
            }

            // Cria a instância de edição passando os novos dados recebidos do body
            const amostraEditada = Amostra.edit(id, dadosNovos);

            // Envia o JSON atualizado para o repositório persistir no banco
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