import { Request, Response } from "express";
import InstrumentoRepository from "../../repositories/ensaios/instrumento.repository";
import { IInstrumento, Instrumento } from "../../models/ensaios/dados/Instrumento";

export const InstrumentoController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await InstrumentoRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhum instrumento no banco de dados.' });
                return;
            }

            res.status(200).json({ message: 'Protocolos encontrados:', data: result });
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

            const result = await InstrumentoRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum instrumento com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getFunction: async (req: Request, res: Response): Promise<void> => {
        try {
            const { funcaoInstrumento } = req.body;

            if (!funcaoInstrumento || typeof funcaoInstrumento !== 'string' || funcaoInstrumento.trim() === '') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Descrição inválida.' });
                return;
            }

            const result = await InstrumentoRepository.findByFunction(funcaoInstrumento);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum instrumento para a função  informada.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getCalibration: async (req: Request, res: Response): Promise<void> => {
        try {
            const calibration: Date = new Date(req.body.calibration);

            if (!calibration) {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Data inválida.' });
                return;
            }

            const result = await InstrumentoRepository.findByCalibration(calibration);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum intrumento com essa data de calibração.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const domainInstrumento = Instrumento.create(req.body);

            const result = await InstrumentoRepository.create(domainInstrumento);

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


            const instrumentoAtual = await InstrumentoRepository.findById(id);

            if (!instrumentoAtual) {
                res.status(404).json({ message: 'Não foi encontrado nenhum protocolo com esse ID.' });
                return;
            }

            const dadosAtualizados: IInstrumento = {
                idInstrumento: id,
                nomeInstrumento: req.body.nomeInstrumento ?? instrumentoAtual.nomeInstrumento,
                funcaoInstrumento: req.body.funcaoInstrumento ?? instrumentoAtual.funcaoInstrumento,
                ultimaCalibracao: req.body.ultimaCalibracao ?? instrumentoAtual.ultimaCalibracao,
                dataCad: req.body.dataCad ?? instrumentoAtual.dataCad, 
                dataMod: req.body.dataMod ?? instrumentoAtual.dataMod
            }

            // Passa o estado atual junto com as alterações do body
            const domainInstrumento = Instrumento.edit(id, dadosAtualizados);

            const result = await InstrumentoRepository.update(id, domainInstrumento);

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

            const instrumentoAtual = await InstrumentoRepository.findById(id);
            if (!instrumentoAtual) {
                res.status(404).json({ message: 'Não foi possível apagar. Nenhum protocolo encontrado com esse ID.' });
                return;
            }

            await InstrumentoRepository.delete(id);

            res.status(200).json({ message: 'Requisição bem-sucedida. Protocolo removido.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};