import { Request, Response } from "express";
import { FuncionarioRepository } from "../../repositories/funcionarios/funcionario.repository";
import Funcionario, { IFuncionario } from "../../models/funcionarios/Funcionario";
import fs from 'node:fs/promises';
<<<<<<< HEAD
import path from "path";
import bcrypt from "bcryptjs";
import { enumSituacaoEmpregaticia } from "../../enum/funcionarios/situacaoEmpregaticia";
import validarSenha from "../../utils/validarSenha";
=======
import { existsSync } from 'node:fs';
import path, { join } from "path";
import bcrypt from "bcryptjs";
import { enumSituacaoEmpregaticia } from "../../enum/funcionarios/situacaoEmpregaticia";
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285

export const FuncionarioController = {
  getAll: async (req: Request, res: Response): Promise<void> => {
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
  getId: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);

      if (!id) {
        res.status(400).json({ message: 'Não foi enviado nenhum id para a requisição.' });
        return;
      }
      const result = await FuncionarioRepository.listarPorId(id);

      if (result === null) {
        res.status(404).json({
          message: "Não foi encontrado nenhum funcionário com esse id.",
        });
        return;
      }

      res.status(200).json({ data: result });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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

      const caminhoImagem: string = reqFile ? `uploads/images/imagens_perfil/${reqFile.filename}` : "";

<<<<<<< HEAD
      validarSenha(senha); // lança erro se a senha não atender aos critérios mínimos

=======
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285
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
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const id = String(req.params.id);
<<<<<<< HEAD

      // Lista branca: apenas estes campos podem ser alterados por este endpoint.
      // Nunca aceitar idFuncionario/cpf/senhaHash cru vindos do req.body diretamente,
      // pra evitar que o cliente sobrescreva campos sensíveis (mass assignment).
      const {
        idCargo,
        nomeFuncionario,
        sobrenomeFuncionario,
        email,
        situacaoEmpregaticia,
        novaSenha,
      } = req.body;
=======
      const dadosNovos = req.body;
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285

      // 1. Busca os dados atuais do banco
      const funcionarioAtual = await FuncionarioRepository.listarPorId(id);

      if (!funcionarioAtual) {
        res.status(404).json({ message: "Funcionário não encontrado" });
        return;
      }

      // 2. Trata a Senha: gera o hash apenas se uma NOVA senha foi enviada
      let senhaHash = funcionarioAtual.senhaHash;
<<<<<<< HEAD
      if (novaSenha && String(novaSenha).trim() !== "") {
        senhaHash = await bcrypt.hash(novaSenha, 12);
=======
      if (dadosNovos.senhaHash && dadosNovos.senhaHash.trim() !== "") {
        senhaHash = await bcrypt.hash(dadosNovos.senhaHash, 12);
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285
      }

      // 3. Trata a Imagem de Perfil
      let caminhoImagemPerfil = funcionarioAtual.caminhoImagemPerfil;
      const reqFile = req.file as any;

      if (reqFile) {
        // Nova imagem enviada: define o novo caminho
<<<<<<< HEAD
        caminhoImagemPerfil = `uploads/images/imagens_perfil/${reqFile.filename}`;

        // Remove a imagem antiga do disco, se existir
        if (funcionarioAtual.caminhoImagemPerfil) {
          const oldPath = path.resolve(process.cwd(), funcionarioAtual.caminhoImagemPerfil);
=======
        caminhoImagemPerfil = `images/imagens_perfil/${reqFile.filename}`;

        // Remove a imagem antiga do disco, se existir
        if (funcionarioAtual.caminhoImagemPerfil) {
          const oldPath = path.resolve(funcionarioAtual.caminhoImagemPerfil);
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285
          await fs.unlink(oldPath).catch(() => { });
        }
      }

<<<<<<< HEAD
      // 4. Mescla apenas os campos permitidos; qualquer outro campo enviado no
      // body é ignorado (ex.: idFuncionario, cpf, situacaoEmpregaticia sem checagem, etc.)
      const dadosAtualizados: IFuncionario = {
        idFuncionario: funcionarioAtual.idFuncionario,
        FK_idCargo: idCargo ?? funcionarioAtual.fkIdCargo,
        nomeFuncionario: nomeFuncionario ?? funcionarioAtual.nomeFuncionario,
        sobrenomeFuncionario: sobrenomeFuncionario ?? funcionarioAtual.sobrenomeFuncionario,
        cpf: funcionarioAtual.cpf,
        email: email ?? funcionarioAtual.email,
        senhaHash,
        situacaoEmpregaticia: situacaoEmpregaticia ?? funcionarioAtual.situacaoEmpregaticia,
        caminhoImagemPerfil: caminhoImagemPerfil ?? undefined,
        dataCad: (funcionarioAtual as any).dataCad,
=======
      // 4. Mescla os dados: Mantém o que já existe e sobrescreve apenas o que foi enviado
      const dadosAtualizados: IFuncionario = {
        ...funcionarioAtual, // Mantém os valores antigos por padrão
        ...dadosNovos, // Sobrescreve com os campos enviados no req.body
        senhaHash, // Garante a senha tratada (nova ou mantida)
        caminhoImagemPerfil, // Garante a imagem tratada (nova ou mantida)
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285
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
      res.status(500).json({ message: error.message });
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
        const absolutePath = path.resolve(process.cwd(), funcionario.caminhoImagemPerfil);
        await fs.unlink(absolutePath).catch(() => { });
      }

      res.status(200).json({ message: "Removido com sucesso" });
    } catch (error: any) {
      res.status(500).json({ message: "Erro interno", error: error.message });
    }
  },
};
