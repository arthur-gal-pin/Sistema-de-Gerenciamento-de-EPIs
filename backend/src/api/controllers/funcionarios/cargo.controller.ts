import Cargo from "../../models/funcionarios/Cargo";
import { CargoRepository } from "../../repositories/funcionarios/cargo.repository";
import { Request, Response } from 'express'

export const CargoController = {
    readAll: async (req: Request, res: Response): Promise<void> => {
        try {
            const cargos = await CargoRepository.listarTodos();
            if (cargos === null) {
                res.status(404).json({ message: 'Não foi encontrado nenhum funcionário nesse banco de dados.' });
                return;
            }
            res.status(200).json(cargos);
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao listar cargos", error: error.message });
        }
    },

    readId: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const result = await CargoRepository.listarPorId(id);
            if (result === null) {
                res.status(404).json({message: 'Não foi encontrado nenhum funcionário com esse id no banco de dados.'});
                return;
            }
            res.status(200).json(result);

        } catch (error: any) {
            res.status(500).json({ message: "Erro ao listar cargos", error: error.message });
        }
    },

    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const domainCargo = Cargo.create(req.body);

            const resultado = await CargoRepository.criar(domainCargo.toJSON());
            res.status(201).json(resultado);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req: Request, res: Response): Promise<void> => {
        try {
            await CargoRepository.removerCargo(String(req.params.id));
            res.status(204).json({message: "Registro excluído com sucesso."});
        } catch (error: any) {
            res.status(500).json({ message: "Erro ao excluir cargo" });
        }
    },

    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const cargoEditado = Cargo.edit(id, req.body);

            const [rowsAffected] = await CargoRepository.atualizar(id, cargoEditado.toJSON());

            if (rowsAffected === 0) {
                res.status(404).json({ message: "Cargo não encontrado" });
                return;
            }

            res.status(200).json({ message: "Cargo atualizado com sucesso" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
    
};