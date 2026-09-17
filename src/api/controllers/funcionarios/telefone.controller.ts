import { Request, Response } from "express";
import { TelefoneRepository } from "../../repositories/funcionarios/telefone.repository";

export const TelefoneController = {
  readFuncionario: async (req: Request, res: Response): Promise<void> => {
    try {
      const fk_id = String(req.params.fkId);
      const telefones = await TelefoneRepository.listarPorFuncionario(fk_id);
      if (!telefones || telefones.length == 0)
        res
          .status(404)
          .json({ message: "Usuário não possue nenhum telefone cadastrado" });
      res.status(200).json(telefones);
    } catch (error: any) {
      res.status(500).json({ message: "Erro ao buscar telefones" });
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(req.body);
      const novoTelefone = await TelefoneRepository.adicionarTelefone(req.body);

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
      const id = String(req.params.id);
      const [rowsAffected] = await TelefoneRepository.atualizar(id, req.body);

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
