import { Request, Response } from 'express';
import { FuncionarioRepository } from '../../repositories/funcionarios/funcionario.repository';
import Funcionario from '../../models/funcionarios/Funcionario';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';

export const FuncionarioController = {
    readAll: async(req: Request, res: Response): Promise<void> => {
        try {
            const result = await FuncionarioRepository.listarTodos();

            if (result === null) {
                res.status(404).json({message: 'Não foi encontrado nenhum funcionário nesse banco de dados.'});
                return;
            }

            res.status(200).json({data: result});

        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    readId: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);

            const result = await FuncionarioRepository.listarPorId(id);

            if (result === null) {
                res.status(404).json({ message: 'Não foi encontrado nenhum funcionário com esse id.'});
                return;
            }

            res.status(200).json({data: result});

        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },
    create: async (req: Request, res: Response): Promise<void> => {
        try {
            const { idCargo, nomeFuncionario, sobrenomeFuncionario, cpf, email, senha, situacaoEmpregaticia } = req.body;

            const reqFile = req.file as any;
            if (!reqFile) {
                res.status(400).json({
                    message: 'Arquivo de imagem não enviado.'
                });
                return
            };

            const caminhoImagem: string = `images/imagens_perfil/${reqFile.filename}`;

            const password_hash = await bcrypt.hash(senha, 10);

            const domainFunc = Funcionario.create({
                idFuncionario: null,
                FK_idCargo: idCargo,
                nomeFuncionario: nomeFuncionario,
                sobrenomeFuncionario: sobrenomeFuncionario,
                cpf: cpf,
                email: email,
                senhaHash: password_hash,
                caminhoImagemPerfil: caminhoImagem,
                situacaoEmpregaticia: situacaoEmpregaticia
            });

            const resultado = await FuncionarioRepository.criarFuncionario(domainFunc.toJSON());
            res.status(201).json(resultado);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const dadosNovos = req.body;

            const reqFile = req.file as any;
            if (reqFile) {
                dadosNovos.caminhoImagemPerfil = `images/imagens_perfil/${reqFile.filename}`
            } else {
                dadosNovos.caminhoImagemPerfil = '';
            };

            const funcionarioEditado = Funcionario.edit(id, dadosNovos);

            const funcionarioAtual = await FuncionarioRepository.listarPorId(id);

            if (!funcionarioAtual) {
                res.status(404).json({ message: "Funcionário não encontrado" });
                return;
            }

            if (dadosNovos.caminhoImagemPerfil && funcionarioAtual.caminhoImagemPerfil !== dadosNovos.caminhoImagemPerfil) {
                const oldPath = path.resolve(funcionarioAtual.caminhoImagemPerfil);
                await fs.unlink(oldPath).catch(() => { });
            }

            const result = await FuncionarioRepository.atualizarFuncionario(id, funcionarioEditado.toJSON());

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
                await fs.unlink(absolutePath).catch(() => console.log("Aviso: Arquivo não existia."));
            }

            res.status(200).json({ message: "Removido com sucesso" });
        } catch (error: any) {
            res.status(500).json({ message: "Erro interno", error: error.message });
        }
    }
};