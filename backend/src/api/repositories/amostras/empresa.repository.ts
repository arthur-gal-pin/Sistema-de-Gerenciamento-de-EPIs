import { prisma } from '../../configs/Database';
import { IEmpresa } from '../../models/amostras/Empresa';

export class EmpresaRepository {

    static async findAll() {
        return await prisma.empresa.findMany();
    }

    static async findByName(nome: string) {
        return await prisma.empresa.findMany({
            where: {
                nomeEmpresa: { contains: nome }
            }
        });
    }

    static async findById(id: string) {
        return await prisma.empresa.findUnique({ where: { idEmpresa: id } });
    }

    static async create(dados: any) {
        return await prisma.empresa.create({
            data: {
                idEmpresa: dados.idEmpresa ?? undefined,
                nomeEmpresa: dados.nomeEmpresa,
                dataCad: dados.dataCad,
                dataMod: dados.dataMod,
            }
        });
    }

    static async update(id: string, dados: Partial<IEmpresa>) {
        const result = await prisma.empresa.updateMany({
            where: {
                idEmpresa: id
            },
            data: {
                nomeEmpresa: dados.nomeEmpresa,
                dataMod: new Date(),
            }
        });
        return [result.count];
    }

    static async delete(id: string) {
        const result = await prisma.empresa.deleteMany({
            where: {
                idEmpresa: id
            }
        });
        return result.count;
    }
};
