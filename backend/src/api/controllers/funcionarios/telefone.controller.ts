import { Request, Response } from "express";
import { TelefoneRepository } from "../../repositories/funcionarios/telefone.repository";
import Telefone from "../../models/funcionarios/Telefone";

export const TelefoneController = {
  readFuncionario: async (req: Request, res: Response): Promise<void> => {
    try {
      const fk_id = req.params.fkId;

      if (!fk_id || typeof fk_id !== 'string') {
        res.status(400).json({ message: 'O valor inserido para o id de funcionário é inválido' });
        return;
      }
      const telefones = await TelefoneRepository.listarPorFuncionario(fk_id);
      if (!telefones || telefones.length == 0) {
        res.status(404).json({ message: "Usuário não possue nenhum telefone cadastrado" });
        return;
      }
      res.status(200).json(telefones);
    } catch (error: any) {
      res.status(500).json({ message: "Erro ao buscar telefones" });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = req.body;
      const domainTelefone = Telefone.create(payload);

      const novoTelefone = await TelefoneRepository.adicionarTelefone(domainTelefone);

      res.status(201).json(novoTelefone);
    } catch (error: any) {
      res.status(400).json({ message: "Dados inválidos", data: error });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      await TelefoneRepository.removerTelefone(String(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: "Erro ao excluir" });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const { payload } = req.body;
      if (!id || typeof id !== 'string') {
        res.status(400).json({ message: 'O id inserido para a atualização é inválido.' });
        return;
      }

      const domainTelefone = Telefone.edit(id, payload)

      const [rowsAffected] = await TelefoneRepository.atualizar(id, domainTelefone);

      if (rowsAffected === 0) {
        res.status(404).json({ message: "Telefone não encontrado" });
        return;
      }

      res.status(200).json({ message: "Telefone atualizado" });
    } catch (error: any) {
      res.status(400).json({ message: "Erro ao atualizar telefone" });
    }
  },
};
