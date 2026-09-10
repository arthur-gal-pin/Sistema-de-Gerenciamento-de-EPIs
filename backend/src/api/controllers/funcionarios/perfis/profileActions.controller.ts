import { Request, Response } from "express";
import { uuid } from "uuidv4";
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

import validarSenha from "../../../utils/validarSenha";
import Funcionario, { IFuncionario } from "../../../models/funcionarios/Funcionario";

import { FuncionarioRepository } from "../../../repositories/funcionarios/funcionario.repository";
import { enumSituacaoEmpregaticia } from "../../../enum/funcionarios/situacaoEmpregaticia";

//Adicionar a opção para administradores ou coordenadores de apenas vizualizarem os usuários ativos do sistema 

export const profileActions = {
    atualizarSenha: async (req: Request, res: Response): Promise<void> => {
        try {
            const usuarioLido = req.user;
            const { senhaInformada, senhaNova } = req.body;

            if (!usuarioLido) {
                res.status(400).json({ message: 'Não foi enviado nenhum usuário dentro da requisição' });
                return;
            };

            if (!senhaInformada || !senhaNova || typeof senhaInformada !== 'string' || typeof senhaNova !== 'string') {
                res.status(400).json({ message: 'As senhas informadas são inválidas ou estão nulas.' });
            };

            const dadosBanco = await FuncionarioRepository.listarPorId(usuarioLido.idFuncionario);

            if (!dadosBanco) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            };

            const passwordMatch = await bcrypt.compare(senhaInformada, dadosBanco.senhaHash);
            if (!passwordMatch) {
                res.status(401).json({ message: 'A senha informada não bate com a senha do usuário.' });
                return;
            };

            validarSenha(senhaNova); //Validar senha retorna um throw new Error
            const senhaNovaHash = await bcrypt.hash(senhaNova, 12);

            const resultado = await FuncionarioRepository.atualizarSenha(usuarioLido.idFuncionario, senhaNovaHash);

            if (!resultado || resultado.length === 0) {
                res.status(500).json({ message: 'Ocorreu um erro na mudança de senha. Por favor, tente novamente mais tarde' });
                return;
            }

            res.status(200).json({ message: 'Senha alterada com sucesso.' });

            //É necessário adicionar a verificação HttpOnly de Cookies, se não essa rota é extremamente vulnerável a um ataque de atualização de vários usuário, por extrair o id de edição do token.jwt 

        } catch (error: any) {
            res.status(500).json({ message: 'Ocorreu um erro no servidor.' });
            console.log(error.message);
            return;
        }
    },
    atualizarInfos: async (req: Request, res: Response): Promise<void> => {
        try {
            const usuarioLido = req.user;
            const { novoEmail, novoNome, novoSobrenome } = req.body;

            if (!usuarioLido) {
                res.status(401).json({ message: 'Usuário não autenticado' });
                return;
            }

            if (!novoEmail && !novoNome && !novoSobrenome) {
                res.status(400).json({ message: 'Não foi enviado nenhum campo para edição' });
                return;
            }

            // 1. Busca os dados atuais no banco
            const dadosBanco = await FuncionarioRepository.listarPorId(usuarioLido.idFuncionario);

            if (!dadosBanco) {
                res.status(404).json({ message: 'Usuário não encontrado' });
                return;
            }

            // 2. Chama o edit mesclando os dados antigos com os novos fornecidos (Fallback)
            const funcionarioEditado: Funcionario = Funcionario.edit(usuarioLido.idFuncionario, {
                idFuncionario: usuarioLido.idFuncionario,
                FK_idCargo: dadosBanco.fkIdCargo,
                nomeFuncionario: novoNome ?? dadosBanco.nomeFuncionario,
                sobrenomeFuncionario: novoSobrenome ?? dadosBanco.sobrenomeFuncionario,
                cpf: dadosBanco.cpf,
                email: novoEmail ?? dadosBanco.email,
                senhaHash: dadosBanco.senhaHash,
                situacaoEmpregaticia: dadosBanco.situacaoEmpregaticia as enumSituacaoEmpregaticia,
                caminhoImagemPerfil: dadosBanco.caminhoImagemPerfil ?? undefined
            });

            // 3. Persiste a nova instância atualizada
            const resultado = await FuncionarioRepository.atualizarFuncionario(usuarioLido.idFuncionario, funcionarioEditado);

            if (!resultado) {
                res.status(500).json({ message: 'Ocorreu um erro na alteração das informações. Tente novamente mais tarde.' });
                return;
            }

            // 4. Resposta de sucesso
            res.status(200).json({
                message: 'Informações alteradas com sucesso!',
                usuario: {
                    nome: funcionarioEditado.nomeFuncionario,
                    sobrenome: funcionarioEditado.sobrenomeFuncionario,
                    email: funcionarioEditado.email,
                }
            });

        } catch (error: any) {
            console.error('Erro em atualizarInfos:', error);
            res.status(400).json({ message: error.message || 'Erro ao processar atualização das informações' });
        }
    },
    atualizarPfp: async (req: Request, res: Response): Promise<void> => {
        try {
            const usuarioLido = req.user;
            const arquivo = req.file;

            if (!usuarioLido) {
                res.status(401).json({ message: 'Usuário não autenticado.' });
                return;
            }

            if (!arquivo) {
                res.status(400).json({ message: 'Nenhuma imagem foi enviada.' });
                return;
            }

            const usuario = await FuncionarioRepository.listarPorId(usuarioLido.idFuncionario);

            if (!usuario) {
                res.status(404).json({ message: 'Usuário não encontrado.' });
                return;
            }

            const novoCaminhoImagem = arquivo.filename; // ou arquivo.path dependendo de como salva no Multer

            const [registrosAfetados] = await FuncionarioRepository.atualizarPfp(
                usuarioLido.idFuncionario,
                novoCaminhoImagem
            );

            if (registrosAfetados === 0) {
                res.status(404).json({ message: 'Usuário não encontrado para atualizar a foto de perfil.' });
                return;
            }

            if (usuario.caminhoImagemPerfil) {
                const caminhoAntigo = path.resolve(__dirname, '..', '..', 'images', 'imagens_perfil', usuario.caminhoImagemPerfil);

                try {
                    await fs.unlink(caminhoAntigo);
                } catch (err: any) {
                    // Se o arquivo não existir fisicamente, apenas loga e não paralisa a resposta de sucesso
                    console.log(`Aviso: Não foi possível apagar a imagem antiga (${caminhoAntigo}):`, err.message);
                }
            }

            res.status(200).json({
                message: 'Foto de perfil atualizada com sucesso!',
                caminhoImagemPerfil: novoCaminhoImagem,
            });

        } catch (error: any) {
            console.error('Erro em atualizarPfp:', error);
            res.status(500).json({ message: 'Erro interno no servidor ao tentar atualizar foto de perfil.' });
        }
    }
}
