import { Request, Response } from "express";
import { FuncionarioRepository } from "../../repositories/funcionarios/funcionario.repository";
import Funcionario from "../../models/funcionarios/Funcionario";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { enumSituacaoEmpregaticia } from "../../enum/funcionarios/situacaoEmpregaticia";

export const FuncionarioController = {
  readAll: async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await FuncionarioRepository.listarTodos();

      if (result === null) {
        res.status(404).json({
          message:
            "Não foi encontrado nenhum funcionário nesse banco de dados.",
        });
        return;
      }

      res.status(200).json({ data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  readId: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);

      const result = await FuncionarioRepository.listarPorId(id);

      if (result === null) {
        res.status(404).json({
          message: "Não foi encontrado nenhum funcionário com esse id.",
        });
        return;
      }

      res.status(200).json({ data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        idCargo,
        nomeFuncionario,
        sobrenomeFuncionario,
        cpf,
        email,
        senha,
        situacaoEmpregaticia,
      } = req.body;

      const reqFile = req.file as any;

      const caminhoImagem: string = reqFile ? `images/imagens_perfil/${reqFile.filename}` : "";

      const password_hash = await bcrypt.hash(senha, 12);

      const domainFunc = Funcionario.create({
        idFuncionario: null,
        FK_idCargo: idCargo,
        nomeFuncionario: nomeFuncionario,
        sobrenomeFuncionario: sobrenomeFuncionario,
        cpf: cpf,
        email: email,
        senhaHash: password_hash,
        caminhoImagemPerfil: caminhoImagem,
        situacaoEmpregaticia:
          situacaoEmpregaticia || enumSituacaoEmpregaticia.ativo,
      });

      const resultado = await FuncionarioRepository.criarFuncionario(
        domainFunc.toJSON(),
      );
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const dadosNovos = req.body;

      // 1. Busca os dados atuais do banco
      const funcionarioAtual = await FuncionarioRepository.listarPorId(id);

      if (!funcionarioAtual) {
        res.status(404).json({ message: "Funcionário não encontrado" });
        return;
      }

      // 2. Trata a Senha: gera o hash apenas se uma NOVA senha foi enviada
      let senhaHash = funcionarioAtual.senhaHash;
      if (dadosNovos.senhaHash && dadosNovos.senhaHash.trim() !== "") {
        senhaHash = await bcrypt.hash(dadosNovos.senhaHash, 12);
      }

      // 3. Trata a Imagem de Perfil
      let caminhoImagemPerfil = funcionarioAtual.caminhoImagemPerfil;
      const reqFile = req.file as any;

      if (reqFile) {
        // Nova imagem enviada: define o novo caminho
        caminhoImagemPerfil = `images/imagens_perfil/${reqFile.filename}`;

        // Remove a imagem antiga do disco, se existir
        if (funcionarioAtual.caminhoImagemPerfil) {
          const oldPath = path.resolve(funcionarioAtual.caminhoImagemPerfil);
          await fs.unlink(oldPath).catch(() => {});
        }
      }

      // 4. Mescla os dados: Mantém o que já existe e sobrescreve apenas o que foi enviado
      const dadosAtualizados = {
        ...funcionarioAtual, // Mantém os valores antigos por padrão
        ...dadosNovos, // Sobrescreve com os campos enviados no req.body
        senhaHash, // Garante a senha tratada (nova ou mantida)
        caminhoImagemPerfil, // Garante a imagem tratada (nova ou mantida)
      };

      // 5. Instancia/Edita a entidade da regra de negócio
      const funcionarioEditado = Funcionario.edit(id, dadosAtualizados);

      // 6. Persiste no banco de dados
      const result = await FuncionarioRepository.atualizarFuncionario(
        id,
        funcionarioEditado.toJSON(),
      );

      res.status(200).json({ message: "Funcionário atualizado", data: result });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
      const funcionario = await FuncionarioRepository.buscarCompletoPorId(id);

      if (!funcionario) {
        res.status(404).json({ message: "Funcionário não encontrado" });
        return;
      }

      await FuncionarioRepository.apagarFuncionario(id);

      if (funcionario.caminhoImagemPerfil) {
        const absolutePath = path.resolve(funcionario.caminhoImagemPerfil);
        await fs
          .unlink(absolutePath)
          .catch(() => console.log("Aviso: Arquivo não existia."));
      }

      res.status(200).json({ message: "Removido com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: "Erro interno", error: error.message });
    }
  },
};
