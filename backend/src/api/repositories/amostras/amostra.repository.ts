import { prisma } from '../../configs/Database';
import { IAmostra } from '../../models/amostras/Amostra';

export class AmostraRepository {
    /**
     * Cria uma nova amostra
     */
    static async create(data: IAmostra) {
        return await prisma.amostra.create({
            data: {
                idAmostra: data.idAmostra ?? undefined,
                fkIdProtocolo: data.FK_idProtocolo,
                codigoAmostra: data.codigoAmostra,
                nomeAmostra: data.nomeAmostra,
                situacaoAmostra: data.situacaoAmostra,
                classificacaoAmostra: data.classificacaoAmostra,
                subclassificacaoAmostra: data.subclassificacaoAmostra,
                descricao: data.descricao,
                dataCad: data.dataCad ? new Date(data.dataCad) : undefined,
                dataMod: data.dataMod ? new Date(data.dataMod) : undefined,
            }
        });
    }

    /**
     * Busca todas as amostras
     */
    static async findAll() {
        return await prisma.amostra.findMany();
    }

    /**
     * Busca uma amostra pelo ID (Chave Primária)
     */
    static async findById(idAmostra: string) {
        return await prisma.amostra.findUnique({ where: { idAmostra } });
    }

    /**
     * Busca amostras por ID de Protocolo
     */
    static async findByProtocolo(fkIdProtocolo: string) {
        return await prisma.amostra.findMany({
            where: { fkIdProtocolo }
        });
    }

    /**
     * Busca amostras por Classificação
     */
    static async findByClassificacao(classificacaoAmostra: string) {
        return await prisma.amostra.findMany({
            where: {
                classificacaoAmostra: { contains: classificacaoAmostra }
            }
        });
    }

    /**
     * Busca amostras por Subclassificação
     */
    static async findBySubclassificacao(subclassificacaoAmostra: string) {
        return await prisma.amostra.findMany({
            where: {
                subclassificacaoAmostra: { contains: subclassificacaoAmostra }
            }
        });
    }

    /**
     * Busca amostras por Nome (parcial)
     */
    static async findByNome(nomeAmostra: string) {
        return await prisma.amostra.findMany({
            where: {
                nomeAmostra: { contains: nomeAmostra }
            }
        });
    }

    /**
     * Busca amostras por Código da Amostra (parcial)
     */
    static async findByCodigo(codigoAmostra: string) {
        return await prisma.amostra.findMany({
            where: {
                codigoAmostra: { contains: codigoAmostra }
            }
        });
    }

    /**
     * Atualiza os dados de uma amostra
     */
    static async update(idAmostra: string, data: Partial<IAmostra>) {
        const result = await prisma.amostra.updateMany({
            where: { idAmostra: idAmostra },
            data: {
                fkIdProtocolo: data.FK_idProtocolo,
                codigoAmostra: data.codigoAmostra,
                nomeAmostra: data.nomeAmostra,
                situacaoAmostra: data.situacaoAmostra,
                classificacaoAmostra: data.classificacaoAmostra,
                subclassificacaoAmostra: data.subclassificacaoAmostra,
                descricao: data.descricao,
                dataMod: new Date(),
            }
        });
        return result.count > 0;
    }

    /**
     * Exclui uma amostra pelo ID
     */
    static async delete(idAmostra: string) {
        const result = await prisma.amostra.deleteMany({
            where: { idAmostra }
        });
        return result.count > 0;
    }
}