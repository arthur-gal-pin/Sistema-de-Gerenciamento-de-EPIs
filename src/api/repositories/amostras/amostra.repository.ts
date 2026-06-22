import  AmostraMap from '../../mappings/amostras/amostra.map';
import { IAmostra } from '../../models/amostras/Amostra'; // Ou de onde a interface oficial vier
import { enumSituacaoAmostra } from '../../enum/amostras/tsituacaoAmostra.enum';
import { Op } from 'sequelize';
import { Attributes } from 'sequelize';

export class AmostraRepository {
    /**
     * Cria uma nova amostra
     */
    static async create(data: Attributes<AmostraMap>) {
        return await AmostraMap.create(data);
    }

    /**
     * Busca todas as amostras
     */
    static async findAll() {
        return await AmostraMap.findAll();
    }

    /**
     * Busca uma amostra pelo ID (Chave Primária)
     */
    static async findById(idAmostra: string) {
        return await AmostraMap.findByPk(idAmostra);
    }

    /**
     * Busca amostras por uma empresa específica
     */
    static async findByEmpresa(FK_idEmpresa: string) {
        return await AmostraMap.findAll({
            where: { FK_idEmpresa }
        });
    }

    static async findByNome(nome: string){
        return await AmostraMap.findAll({
            where: {
                nomeAmostra: {
                    [Op.like]: `${nome}`
                }
            }
        })
    }

    /**
     * Atualiza os dados de uma amostra
     */
    static async update(idAmostra: string, data: Partial<IAmostra>) {
        const [affectedRows] = await AmostraMap.update(data, {
            where: { idAmostra }
        });
        return affectedRows > 0;
    }

    /**
     * Exclui uma amostra pelo ID
     */
    static async delete(idAmostra: string) {
        const deletedRows = await AmostraMap.destroy({
            where: { idAmostra }
        });
        return deletedRows > 0;
    }
}