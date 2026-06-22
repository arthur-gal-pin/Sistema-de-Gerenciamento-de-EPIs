import { Attributes } from "sequelize";
import TelefoneMap from "../../mappings/funcionarios/telefone.map";
import { ITelefone } from "../../models/funcionarios/Telefone";

export class TelefoneRepository {
    static async listarPorFuncionario(idFuncionario: string) {
        return await TelefoneMap.findAll({
            where: { FK_idFuncionario: idFuncionario }
        });
    }

    static async adicionarTelefone(dados: Attributes<TelefoneMap>) {
        return await TelefoneMap.create(dados);
    }

    static async removerTelefone(idTelefone: string) {
        return await TelefoneMap.destroy({
            where: { idTelefone: idTelefone }
        });
    }

    static async atualizar(id: string, dados: ITelefone) {
        return await TelefoneMap.update(dados, {
            where: { idTelefone: id }
        });
    }

    static async buscarPorId(id: string) {
        return await TelefoneMap.findByPk(id);
    }
}