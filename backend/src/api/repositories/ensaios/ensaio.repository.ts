import { prisma } from '../../configs/Database';
import { IEnsaio } from '../../models/ensaios/Ensaio'
import { enumPapelEnsaio } from '../../enum/amostras/situacaoAmostra.enum';

export default class EnsaioRepository {
    /**
     * Cria um novo protocolo
     */
    static async create(data: IEnsaio) {
        return await prisma.ensaio.create({
            data: {
                idEnsaio: data.idEnsaio ?? undefined,
                fkIdProtocolo: data.FK_idProtocolo,
                fkIdTipoEnsaio: data.FK_idTipoEnsaio,
                nomeEnsaio: data.nomeEnsaio,
                papelEnsaio: data.papel ?? enumPapelEnsaio.prova,
                descricao: data.descricao,
                dataCad: data.dataCad,
                dataMod: data.dataMod
            }
        });
    };

    static async update(id: string, data: Partial<IEnsaio>) {
        const result = await prisma.ensaio.updateMany({
            where: { idEnsaio: id },
            data: {
                fkIdTipoEnsaio: data.FK_idTipoEnsaio,
                fkIdProtocolo: data.FK_idProtocolo,
                nomeEnsaio: data.nomeEnsaio,
                papelEnsaio: data.papel ?? enumPapelEnsaio.prova,
                descricao: data.descricao,
                dataCad: data.dataCad,
                dataMod: new Date()
            }
        });
        return result.count > 0;
    }

    static async findAll() {
        return await prisma.ensaio.findMany();
    };


    static async findByName(name: string) {
        return await prisma.ensaio.findMany({
            where: { nomeEnsaio: { contains: name } }
        });
    };

    static async findById(id: string) {
        return await prisma.ensaio.findUnique({
            where: { idEnsaio: id }
        });
    };

    static async findByDescription(context: string) {
        return await prisma.ensaio.findMany({
            where: {
                descricao: {
                    contains: `${context}`
                }
            }
        });
    }

    static async findByPapelEnsaio(unity: string) {
        return await prisma.ensaio.findMany({
            where: {
                papelEnsaio: { contains: `${unity}` }
            }
        });
    }

    static async findByProtocolo(id: string) {
        return await prisma.ensaio.findMany({
            where: { fkIdProtocolo: id }
        });
    }

    static async findByTipoEnsaio(id: string) {
        return await prisma.ensaio.findMany({
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