import { prisma } from '../../configs/Database';
import { IAmostra } from '../../models/amostras/Amostra';

export class AmostraRepository {
    /**
     * Cria uma nova amostra
     */
    static async create(data: any) {
        return await prisma.amostra.create({
            data: {
                idAmostra: data.idAmostra ?? undefined,
                fkIdEmpresa: data.FK_idEmpresa,
                fkIdOcp: data.FK_idOCP,
                nomeAmostra: data.nomeAmostra,
                tipoAmostra: data.tipoAmostra,
                situacaoAmostra: data.situacaoAmostra,
                dataCad: data.dataCad,
                dataMod: data.dataMod,
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
     * Busca amostras por uma empresa específica
     */
    static async findByEmpresa(fkIdEmpresa: string) {
        return await prisma.amostra.findMany({
            where: { fkIdEmpresa }
        });
    }

    static async findByNome(nome: string) {
        return await prisma.amostra.findMany({
            where: {
                nomeAmostra: { contains: nome }
            }
        });
    }

    /**
     * Atualiza os dados de uma amostra
     */
    static async update(idAmostra: string, data: Partial<IAmostra>) {
        const result = await prisma.amostra.updateMany({
            where: { idAmostra },
            data: {
                fkIdEmpresa: data.FK_idEmpresa,
                fkIdOcp: data.FK_idOCP,
                nomeAmostra: data.nomeAmostra,
                tipoAmostra: data.tipoAmostra,
                situacaoAmostra: data.situacaoAmostra,
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
