import  EmpresaMap  from '../../mappings/amostras/empresa.map';
import { IEmpresa } from '../../models/amostras/Empresa';
import { Attributes } from 'sequelize';

import { Op } from 'sequelize';

export class EmpresaRepository {

    static async listarTodos() {
        return await EmpresaMap.findAll();
    }

    static async listarPorNome(nome: string) {
        return await EmpresaMap.findAll({
            where: {
                nomeEmpresa: {
                    [Op.like]: `%${nome}%`
                }
            }
        });
    }

    static async listarPorId(id: string) {
        return await EmpresaMap.findByPk(id);
    }

    static async criarEmpresa(dados: Attributes<EmpresaMap>) {
        return await EmpresaMap.create(dados as any);
    }

    static async atualizarEmpresa(id: string, dados: Partial<IEmpresa>) {
        return await EmpresaMap.update(dados, {
            where: {
                idEmpresa: id
            }
        });
    }

    static async apagarEmpresa(id: string) {
        return await EmpresaMap.destroy({
            where: {
                idEmpresa: id
            }
        });
    }
};