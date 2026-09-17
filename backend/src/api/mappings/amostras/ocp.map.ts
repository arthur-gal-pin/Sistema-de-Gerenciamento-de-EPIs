import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import AmostraMap from './amostra.map'; // Ajuste o caminho do import se necessário

@Table({
    tableName: 'TB_OCP',
    schema: 'dbo',
    timestamps: true,
    createdAt: 'DataCad',
    updatedAt: 'DataMod'
})
export default class OcpMap extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        field: 'IdOCP'
    })
    idOCP!: string;

    @Column({
        type: DataType.STRING(50),
        allowNull: false,
        field: 'NomeOCP'
    })
    nomeOCP!: string;

    // Relação: 1 OCP tem N Amostras
    @HasMany(() => AmostraMap, 'FK_idOCP')
    amostras!: AmostraMap[];
}