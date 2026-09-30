import { prisma } from '../../../configs/Database';
import {IAmostraEnsaio} from '../../../models/ensaios/relacionamentos/AmostraEnsaio';

export default class AmostraEnsaioRepository {
    /**
     * Cria uma nova AmostraEnsaio
     */
    static async create(data: IAmostraEnsaio) {
        return await prisma.amostraEnsaio.create({
            data: {
                idAmostraEnsaio: data.idAmostraEnsaio ?? undefined,
                fkIdAmostra: data.FK_idAmostra,
                fkIdEnsaio: data.FK_idEnsaio,
                fkIdInstrumento: data.FK_idInstrumento,
                temperatura: data.temperatura,
                umidade: data.umidade,
                pressao: data.pressao,
                dataCad: data.dataCad,
                dataMod: data.dataMod
            }
        });
    }

    static async update(id: string, data: Partial<IAmostraEnsaio>) {
        const result = await prisma.amostraEnsaio.updateMany({
            where: { idAmostraEnsaio: id },
            data: {
                fkIdAmostra: data.FK_idAmostra,
                fkIdEnsaio: data.FK_idEnsaio,
                fkIdInstrumento: data.FK_idInstrumento,
                temperatura: data.temperatura,
                umidade: data.umidade,
                pressao: data.pressao,
                dataCad: data.dataCad,
                dataMod: new Date().toISOString()
            }
        });
        return result.count > 0;
    }

    static async findAll() {
        return await prisma.amostraEnsaio.findMany();
    }

    static async findById(id: string) {
        return await prisma.amostraEnsaio.findUnique({
            where: { idAmostraEnsaio: id }
        });
    }

    static async findByAmostra(idAmostra: string) {
        return await prisma.amostraEnsaio.findMany({
            where: { fkIdAmostra: idAmostra }
        });
    }

    static async findByEnsaio(idEnsaio: string) {
        return await prisma.amostraEnsaio.findMany({
            where: { fkIdEnsaio: idEnsaio }
        });
    }

    static async findByInstrumento(idInstrumento: string) {
        return await prisma.amostraEnsaio.findMany({
            where: { fkIdInstrumento: idInstrumento }
        });
    }

    static async delete(id: string) {
        const result = await prisma.amostraEnsaio.delete({
            where: { idAmostraEnsaio: id }
        });
        return result;
    }
}