import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import FuncionarioMap from './funcionario.map';
import { enumTipoTelefone } from '../../enum/funcionarios/tipoTelefone';

@Table({
    tableName: 'TB_TELEFONES', // Geralmente usa-se no plural para tabelas
    schema: 'dbo',
    timestamps: true,
    createdAt: 'DataCad',
    updatedAt: 'DataMod'
})
export default class TelefoneMap extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        field: 'IdTelefone'
    })
    idTelefone!: string;

    @ForeignKey(() => FuncionarioMap)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'FK_IdFuncionario'
    })
    fkIdFuncionario!: string;

    @BelongsTo(() => FuncionarioMap)
    funcionario!: FuncionarioMap;

    @Column({
        type: DataType.STRING(20),
        allowNull: false,
        field: 'NumeroTelefone'
    })
    numeroTelefone!: string;

    @Column({
        type: DataType.ENUM(...Object.keys(enumTipoTelefone)),
        allowNull: false,
        field: 'TipoTelefone'
    })
    tipoTelefone!: string;

}