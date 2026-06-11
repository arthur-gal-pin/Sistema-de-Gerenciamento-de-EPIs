import { IOcp } from '../../models/amostras/OCP';
import { Op } from 'sequelize';
import { OcpMap } from '../../mappings/amostras/ocp.map';

export class OcpRepository {

    static async listarTodos() {
        return await OcpMap.findAll();
    }

    static async listarPorNome(nome: string) {
        return await OcpMap.findAll({
            where: {
                nomeOCP: {
                    [Op.like]: `%${nome}%`
                }
            }
        });
    }

    static async listarPorId(id: string) {
        return await OcpMap.findByPk(id);
    }

    static async criarOcp(dados: IOcp) {
        return await OcpMap.create(dados);
    }

    static async atualizarOcp(id: string, dados: any) {
        return await OcpMap.update(dados, {
            where: { idOCP: id }
        });
    }

    static async apagarOcp(id: string) {
        return await OcpMap.destroy({
            where: { idOCP: id }
        });
    }
}