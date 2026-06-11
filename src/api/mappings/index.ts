import { EmpresaMap } from "./amostras/empresa.map";
import { AmostraMap } from "./amostras/amostra.map";
import { CargoMap } from "./funcionarios/cargo.map";
import { FuncionarioMap } from "./funcionarios/funcionario.map";
import { TelefoneMap } from "./funcionarios/telefone.map";
import { OcpMap } from "./amostras/ocp.map";

// 1 Cargo tem N Funcionários
CargoMap.hasMany(FuncionarioMap, { foreignKey: 'FK_IdCargo', as: 'funcionarios' });
FuncionarioMap.belongsTo(CargoMap, { foreignKey: 'FK_IdCargo', as: 'cargo' });

// 1 Funcionário tem N Telefones
FuncionarioMap.hasMany(TelefoneMap, { foreignKey: 'FK_IdFuncionario', as: 'telefones' });
TelefoneMap.belongsTo(FuncionarioMap, { foreignKey: 'FK_IdFuncionario', as: 'funcionario' });

export { CargoMap, FuncionarioMap, TelefoneMap };

// 1 Empresa tem N amostras
EmpresaMap.hasMany(AmostraMap, {foreignKey: 'FK_IdEmpresa', as: 'amostras'});
AmostraMap.belongsTo(EmpresaMap, {foreignKey: 'Fk_IdEmpresa', as: 'empresa'})

// 1 OCP tem N amostras
OcpMap.hasMany(AmostraMap, {foreignKey: 'FK_idOcp', as: 'amostras'});
AmostraMap.belongsTo(OcpMap, {foreignKey: 'Fk_IdEmpresa', as: 'ocp'})
