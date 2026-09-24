import { Request, Response } from "express";
import { IProtocolo, Protocolo } from "../../models/ensaios/Protocolo";
import ProtocoloRepository from "../../repositories/ensaios/protocolo.repository";
import { enumTipoProtocolo } from "../../enum/ensaios/tipoProtocolo.enum";

export const ProtocoloController = {
    getAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await ProtocoloRepository.findAll();

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhum protocolo no banco de dados.' });
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

            const result = await ProtocoloRepository.findById(id);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum protocolo com esse ID.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getSEI: async (req: Request, res: Response): Promise<void> => {
        try {
            const { sei } = req.params;

            if (!sei || typeof sei !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Número SEI inválido.' });
                return;
            }

            const result = await ProtocoloRepository.findBySEI(sei);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum protocolo para o número SEI informado.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getCode: async (req: Request, res: Response): Promise<void> => {
        try {
            const { code } = req.params;

            if (!code || typeof code !== 'string') {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Código de protocolo inválido.' });
                return;
            }

            const result = await ProtocoloRepository.findByCode(code);

            if (!result) {
                res.status(404).json({ message: 'Não foi encontrado nenhum protocolo com o código informado.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    getType: async (req: Request, res: Response): Promise<void> => {
        try {
            const { type } = req.params;

            if (!type || !Object.values(enumTipoProtocolo).includes(type as enumTipoProtocolo)) {
                res.status(400).json({ message: 'Não foi possível processar a requisição - Tipo de protocolo inválido.' });
                return;
            }

            const result = await ProtocoloRepository.findByType(type as enumTipoProtocolo);

            if (!result || result.length === 0) {
                res.status(404).json({ message: 'Não foi encontrado nenhum protocolo para o tipo informado.' });
                return;
            }

            res.status(200).json({ message: 'Requisição bem-sucedida:', data: result });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const domainProtocolo = Protocolo.create(req.body);

            const result = await ProtocoloRepository.create(domainProtocolo);

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


            const protocoloAtual = await ProtocoloRepository.findById(id);

            if (!protocoloAtual) {
                res.status(404).json({ message: 'Não foi encontrado nenhum protocolo com esse ID.' });
                return;
            }

            const dadosAtualizados: IProtocolo = {
                idProtocolo: id,
                FK_idOCP: req.body.FK_idOCP ?? protocoloAtual.fkIdOcp ,
                FK_idEmpresa: req.body.FK_idEmpresa ?? protocoloAtual.fkIdEmpresa,
                nomeProtocolo: req.body.nomeProtocolo ?? protocoloAtual.nomeProtocolo,
                numeroProtocolo: req.body.numeroProtocolo ?? protocoloAtual.numeroProtocolo,
                numeroSEI: req.body.numeroSEI ?? protocoloAtual.numeroSEI,
                tipoProtocolo: req.body.tipoProtocolo as enumTipoProtocolo ?? protocoloAtual.tipoProtocolo as enumTipoProtocolo,
                diaAbertura: req.body.diaAbertura ?? protocoloAtual.diaAbertura,
                diaEntrega: req.body.diaAbertura ?? protocoloAtual.diaEntrega,
                descricao: req.body.descricao ?? protocoloAtual.descricao,
                dataCad: req.body.dataCad ?? protocoloAtual.dataCad,
                dataMod: req.body.dataMod ?? protocoloAtual.dataMod
            }

            // Passa o estado atual junto com as alterações do body
            const domainProtocolo = Protocolo.edit(id, dadosAtualizados);

            const result = await ProtocoloRepository.update(id, domainProtocolo.toJSON());

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

            const protocoloAtual = await ProtocoloRepository.findById(id);
            if (!protocoloAtual) {
                res.status(404).json({ message: 'Não foi possível apagar. Nenhum protocolo encontrado com esse ID.' });
                return;
            }

            await ProtocoloRepository.delete(id);

            res.status(200).json({ message: 'Requisição bem-sucedida. Protocolo removido.' });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
};