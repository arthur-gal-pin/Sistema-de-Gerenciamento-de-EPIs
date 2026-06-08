import { CargoMap } from "./funcionarios/cargo.map";
import { FuncionarioMap } from "./funcionarios/funcionario.map";
import { TelefoneMap } from "./funcionarios/telefone.map";

// 1 Cargo tem N Funcionários
// Alterado para 'FK_IdCargo' (respeitando o que foi definido no model do funcionário)
CargoMap.hasMany(FuncionarioMap, { foreignKey: 'FK_IdCargo', as: 'funcionarios' });
FuncionarioMap.belongsTo(CargoMap, { foreignKey: 'FK_IdCargo', as: 'cargo' });

// 1 Funcionário tem N Telefones
FuncionarioMap.hasMany(TelefoneMap, { foreignKey: 'FK_IdFuncionario', as: 'telefones' });
TelefoneMap.belongsTo(FuncionarioMap, { foreignKey: 'FK_IdFuncionario', as: 'funcionario' });

export { CargoMap, FuncionarioMap, TelefoneMap };