import CargoMap from '../../mappings/funcionarios/cargo.map';
import { Attributes, Op } from 'sequelize'; 
import { ICargo } from "../../models/funcionarios/Cargo";

export class CargoRepository {
    static async listarTodos() {
        return await CargoMap.findAll();
    }

    static async listarPorId(id: string) {
        return await CargoMap.findByPk(id);
    };

    static async criar(dados: Attributes<CargoMap>) {
        return await CargoMap.create(dados);
    };

    static async buscarPorNome(nome: string){
        return await CargoMap.findAll({
            where: {
                nomeCargo: {
                    [Op.like]: `%${nome}%`
                }
            }
        })
    };

    static async atualizar(id: string, dados: ICargo) {
        return await CargoMap.update(dados, {
            where: { idCargo: id }
        });
    }

    static async removerCargo(id: string) {
        return await CargoMap.destroy({
            where: {
                idCargo: id 
            }
        })
    };
}
