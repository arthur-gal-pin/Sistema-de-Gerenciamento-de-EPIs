import { FuncionarioMap } from '../../mappings';
import { CargoMap } from '../../mappings';
import { TelefoneMap } from '../../mappings';
import { IFuncionario } from '../../models/funcionarios/Funcionario';
import { Op } from 'sequelize'; 


export class FuncionarioRepository {
    
    // Busca funcionário trazendo os dados do Cargo e a lista de Telefones (Eager Loading)
    static async buscarCompletoPorId(id: string) {
        return await FuncionarioMap.findByPk(id, {
            include: [
                { model: CargoMap, as: 'cargo' },
                { model: TelefoneMap, as: 'telefones' }
            ]
        });
    }

    static async buscarPorCPF(cpf: string){
        return await FuncionarioMap.findOne({
            where: {cpf: cpf},
        include: [{ model: CargoMap, as: 'cargo' }]
        })
    }

    static async buscarPorEmail(email: string){
        return await FuncionarioMap.findAll({
            where: {
                email: email
            }
        })
    }

    static async listarTodos() {
        return await FuncionarioMap.findAll({
            include: [{ model: CargoMap, as: 'cargo' }]
        });
    }

    static async listarPorNome(nome: string) {
        return await FuncionarioMap.findAll({
            where: {
                nomeFuncionario: {
                    [Op.like]: `%${nome}%`
                }
            }
        });
    }

    static async listarPorId(id: string) {
        return await FuncionarioMap.findByPk(id);
    }

    static async criarFuncionario(dados: IFuncionario) {
        return await FuncionarioMap.create(dados);
    }

    static async atualizarFuncionario(id: string, dados: any) {
        return await FuncionarioMap.update(dados, {
            where: { idFuncionario: id }
        });
    }

    static async apagarFuncionario(id: string) {
        return await FuncionarioMap.destroy({
            where: { idFuncionario: id }
        });
    }
}