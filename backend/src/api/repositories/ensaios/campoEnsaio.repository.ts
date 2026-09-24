import { prisma } from '../../configs/Database';
import { ICampoEnsaio } from '../../models/ensaios/dados/CampoEnsaio'
import { enumTipoDadoCampo } from '../../enum/ensaios/tipoDado.enum';

export default class CampoEnsaioRepository {
    /**
     * Cria um novo protocolo
     */
    static async create(data: ICampoEnsaio) {
        return await prisma.campoEnsaio.create({
            data: {
                idCampoEnsaio: data.idCampoEnsaio ?? undefined,
                fkIdTipoEnsaio: data.FK_idTipoEnsaio,
                nomeCampo: data.nomeCampo,
                obrigatoriedade: data.obrigatoriedade,
                tipoDado: data.tipoDado,
                unidadeMedida: data.unidadeMedida,
                descricao: data.descricao,
                dataCad: data.dataCad,
                dataMod: data.dataMod
            }
        });
    };

    static async update(id: string, data: Partial<ICampoEnsaio>) {
        const result = await prisma.campoEnsaio.updateMany({
            where: { idCampoEnsaio: id },
            data: {
                fkIdTipoEnsaio: data.FK_idTipoEnsaio,
                nomeCampo: data.nomeCampo,
                descricao: data.descricao,
                obrigatoriedade: data.obrigatoriedade,
                tipoDado: data.tipoDado,
                unidadeMedida: data.unidadeMedida,
                dataCad: data.dataCad,
                dataMod: new Date()
            }
        });
        return result.count > 0;
    }

    static async findAll() {
        return await prisma.campoEnsaio.findMany();
    };


    static async findByName(name: string) {
        return await prisma.campoEnsaio.findMany({
            where: { nomeCampo: { contains: name } }
        });
    };

    static async findById(id: string) {
        return await prisma.campoEnsaio.findUnique({
            where: { idCampoEnsaio: id }
        });
    };

    static async findByDescription(context: string) {
        return await prisma.campoEnsaio.findMany({
            where: {
                descricao: {
                    contains: `${context}`
                }
            }
        });
    }

    static async findByUnidadeMedida(unity: string) {
        return await prisma.campoEnsaio.findMany({
            where: { unidadeMedida: unity }
        });
    }

    static async findByFK(id: string) {
        return await prisma.campoEnsaio.findMany({
            where: { fkIdTipoEnsaio: id }
        });
    }

    static async delete(id: string) {
        const result = await prisma.campoEnsaio.delete({
            where: { idCampoEnsaio: id }
        });
        return result;
    }
}