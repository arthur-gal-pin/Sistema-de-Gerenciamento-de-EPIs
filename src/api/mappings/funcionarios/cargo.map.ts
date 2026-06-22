import { enumNivelPermissao } from '../../enum/funcionarios/nivelPermissao.enum';
import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import FuncionarioMap from './funcionario.map';

@Table({
    tableName: 'TB_CARGOS',
    schema: 'dbo',
    timestamps: true,
    createdAt: 'DataCad',
    updatedAt: 'DataMod',
})

export default class CargoMap extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        field: 'IdCargo',
    })
    idCargo! : string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        field: 'NomeCargo'
    })
    nomeCargo! : string;

    @Column({
        type: DataType.ENUM(...Object.keys(enumNivelPermissao)),
        allowNull: false,
        field: 'NivelPermissao'
    })
    nivelPermissao! : enumNivelPermissao

    @HasMany(() => FuncionarioMap, 'FK_IdCargo')
    funcionarios!: FuncionarioMap[];
}


