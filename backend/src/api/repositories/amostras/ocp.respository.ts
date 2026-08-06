import { prisma } from '../../configs/Database';

export class OcpRepository {

    static async listarTodos() {
        return await prisma.ocp.findMany();
    }

    static async listarPorNome(nome: string) {
        return await prisma.ocp.findMany({
            where: {
                nomeOCP: { contains: nome }
            }
        });
    }

    static async listarPorId(id: string) {
        return await prisma.ocp.findUnique({ where: { idOCP: id } });
    }

    static async criarOcp(dados: any) {
        return await prisma.ocp.create({
            data: {
                idOCP: dados.idOCP ?? undefined,
                nomeOCP: dados.nomeOCP,
                dataCad: dados.dataCad,
                dataMod: dados.dataMod,
            }
        });
    }

    static async atualizarOcp(id: string, dados: any) {
        const result = await prisma.ocp.updateMany({
            where: { idOCP: id },
            data: {
                nomeOCP: dados.nomeOCP,
                dataMod: new Date(),
            }
        });
        return [result.count];
    }

    static async apagarOcp(id: string) {
        const result = await prisma.ocp.deleteMany({
            where: { idOCP: id }
        });
        return result.count;
    }
}
