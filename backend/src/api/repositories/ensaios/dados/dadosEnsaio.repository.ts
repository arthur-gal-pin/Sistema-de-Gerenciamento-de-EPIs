import { prisma } from '../../../configs/Database';
import { IDadosEnsaio } from '../../../models/ensaios/dados/DadosEnsaio';

export default class DadosEnsaioRepository {
    /**
     * Cria um novo registro de DadosEnsaio
     */
    static async create(data: IDadosEnsaio) {
        return await prisma.dadosEnsaio.create({
            data: {
                idDadosEnsaio: data.idDadosEnsaio ?? undefined,
                fkIdAmostraEnsaio: data.FK_idAmostraEnsaio,
                fkIdCampoEnsaio: data.FK_idCampoEnsaio,
                nomeDado: data.nomeDado,
                dado: data.dado,
                dataCad: data.dataCad,
                dataMod: data.dataMod
            }
        });
    }

    static async update(id: string, data: Partial<IDadosEnsaio>) {
        const result = await prisma.dadosEnsaio.updateMany({
            where: { idDadosEnsaio: id },
            data: {
                fkIdAmostraEnsaio: data.FK_idAmostraEnsaio,
                fkIdCampoEnsaio: data.FK_idCampoEnsaio,
                nomeDado: data.nomeDado,
                dado: data.dado,
                dataCad: data.dataCad,
                dataMod: new Date().toISOString()
            }
        });
        return result.count > 0;
    }

    static async findAll() {
        return await prisma.dadosEnsaio.findMany();
    }

    static async findById(id: string) {
        return await prisma.dadosEnsaio.findUnique({
            where: { idDadosEnsaio: id }
        });
    }

    static async findByAmostraEnsaio(idAmostraEnsaio: string) {
        return await prisma.dadosEnsaio.findMany({
            where: { fkIdAmostraEnsaio: idAmostraEnsaio }
        });
    }

    static async findByCampoEnsaio(idCampoEnsaio: string) {
        return await prisma.dadosEnsaio.findMany({
            where: { fkIdCampoEnsaio: idCampoEnsaio }
        });
    }

    static async findByName(name: string) {
        return await prisma.dadosEnsaio.findMany({
            where: {
                nomeDado: { contains: name }
            }
        });
    }

    static async delete(id: string) {
        const result = await prisma.dadosEnsaio.delete({
            where: { idDadosEnsaio: id }
        });
        return result;
    }
}