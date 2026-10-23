import { prisma } from '../../../configs/Database';
import {IFuncionarioEnsaio} from '../../../models/ensaios/relacionamentos/FuncionarioEnsaio';

export default class FuncionarioEnsaioRepository {
    /**
     * Cria um novo registro de FuncionarioEnsaio
     */
    static async create(data: IFuncionarioEnsaio) {
        return await prisma.funcionarioEnsaio.create({
            data: {
                idFuncionarioEnsaio: data.idFuncionarioEnsaio ?? undefined,
                fkIdFuncionario: data.FK_idFuncionario,
                fkIdEnsaio: data.FK_idEnsaio,
                dataCad: data.dataCad,
                dataMod: data.dataMod
            }
        });
    }

    static async update(id: string, data: Partial<IFuncionarioEnsaio>) {
        const result = await prisma.funcionarioEnsaio.updateMany({
            where: { idFuncionarioEnsaio: id },
            data: {
                fkIdFuncionario: data.FK_idFuncionario,
                fkIdEnsaio: data.FK_idEnsaio,
                dataCad: data.dataCad,
                dataMod: new Date().toISOString()
            }
        });
        return result.count > 0;
    }

    static async findAll() {
        return await prisma.funcionarioEnsaio.findMany();
    }

    static async findById(id: string) {
        return await prisma.funcionarioEnsaio.findUnique({
            where: { idFuncionarioEnsaio: id }
        });
    }

    static async findByFuncionario(idFuncionario: string) {
        return await prisma.funcionarioEnsaio.findMany({
            where: { fkIdFuncionario: idFuncionario }
        });
    }

    static async findByEnsaio(idEnsaio: string) {
        return await prisma.funcionarioEnsaio.findMany({
            where: { fkIdEnsaio: idEnsaio }
        });
    }

    static async delete(id: string) {
        const result = await prisma.funcionarioEnsaio.delete({
            where: { idFuncionarioEnsaio: id }
        });
        return result;
    }
}