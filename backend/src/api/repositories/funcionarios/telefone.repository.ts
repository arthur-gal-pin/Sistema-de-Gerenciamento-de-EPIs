import { prisma } from "../../configs/Database";
import { ITelefone } from "../../models/funcionarios/Telefone";

export class TelefoneRepository {
    static async listarPorFuncionario(idFuncionario: string) {
        return await prisma.telefone.findMany({
            where: { fkIdFuncionario: idFuncionario }
        });
    }

    static async adicionarTelefone(dados: any) {
        return await prisma.telefone.create({
            data: {
                idTelefone: dados.idTelefone ?? undefined,
                fkIdFuncionario: dados.FK_idFuncionario ?? dados.fkIdFuncionario ?? dados.idFuncionario,
                numeroTelefone: dados.numeroTelefone,
                tipoTelefone: dados.tipoTelefone,
                dataCad: dados.dataCad,
                dataMod: dados.dataMod,
            }
        });
    }

    static async removerTelefone(idTelefone: string) {
        const result = await prisma.telefone.deleteMany({
            where: { idTelefone: idTelefone }
        });
        return result.count;
    }

    static async atualizar(id: string, dados: ITelefone) {
        const result = await prisma.telefone.updateMany({
            where: { idTelefone: id },
            data: {
                fkIdFuncionario: dados.FK_idFuncionario,
                numeroTelefone: dados.numeroTelefone,
                tipoTelefone: dados.tipoTelefone,
                dataMod: new Date(),
            }
        });
        return [result.count];
    }

    static async buscarPorId(id: string) {
        return await prisma.telefone.findUnique({ where: { idTelefone: id } });
    }
}
