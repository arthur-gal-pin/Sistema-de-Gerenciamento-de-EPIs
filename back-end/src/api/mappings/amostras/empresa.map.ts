import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import AmostraMap  from './amostra.map'; // Ajuste o caminho do import se necessário

@Table({
    tableName: 'TB_EMPRESAS',
    schema: 'dbo',
    timestamps: true,
    createdAt: 'DataCad',
    updatedAt: 'DataMod'
})
export default class EmpresaMap extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        field: 'IdEmpresa'
    })
    idEmpresa!: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        field: 'NomeEmpresa'
    })
    nomeEmpresa!: string;

    // Relação: 1 Empresa tem N Amostras
    @HasMany(() => AmostraMap, 'FK_idEmpresa')
    amostras!: AmostraMap[];
}