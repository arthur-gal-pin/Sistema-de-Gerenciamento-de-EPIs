import { prisma, Prisma } from "../../configs/Database";
import { ICargo } from "../../models/funcionarios/Cargo";

export class CargoRepository {
  static async listarTodos() {
    return await prisma.cargo.findMany();
  }

  static async listarPorId(id: string) {
    return await prisma.cargo.findUnique({ where: { idCargo: id } });
  }

  static async criar(dados: {
    idCargo: string | null;
    nomeCargo: string;
    nivelPermissao: string;
    dataCad?: string;
    dataMod?: string;
  }) {
    return await prisma.cargo.create({
      data: {
        idCargo: dados.idCargo ?? undefined,
        nomeCargo: dados.nomeCargo,
        nivelPermissao: dados.nivelPermissao,
        dataCad: dados.dataCad,
        dataMod: dados.dataMod,
      },
    });
  }

  static async buscarPorNome(nome: string) {
    return await prisma.cargo.findMany({
      where: {
        nomeCargo: { contains: nome },
      },
    });
  }

  static async atualizar(id: string, dados: ICargo) {
    const result = await prisma.cargo.updateMany({
      where: { idCargo: id },
      data: {
        nomeCargo: dados.nomeCargo,
        nivelPermissao: dados.nivelPermissao,
      },
    });
    return [result.count];
  }

  static async removerCargo(id: string) {
    const result = await prisma.cargo.deleteMany({
      where: {
        idCargo: id,
      },
    });
    return result.count;
  }
}
