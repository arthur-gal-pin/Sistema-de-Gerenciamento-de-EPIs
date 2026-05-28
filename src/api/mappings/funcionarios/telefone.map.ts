import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../configs/Database';
import { enumTipoTelefone } from '../../enum/funcionarios/tipoTelefone';
import { ITelefone } from '../../models/funcionarios/Telefone';

interface TelefoneCreationAttributes extends Optional<ITelefone, 'idTelefone' | 'dataCad' | 'dataMod'> {}

class TelefoneMap extends Model<ITelefone, TelefoneCreationAttributes> implements ITelefone {
    declare idTelefone: string | null;
    declare FK_idFuncionario: string;
    declare numeroTelefone: string;
    declare tipoTelefone: enumTipoTelefone;

    // Timestamps
    public readonly dataCad!: string;
    public readonly dataMod!: string;
}

TelefoneMap.init(
    {
        idTelefone: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            field: 'IdTelefone' 
        },
        FK_idFuncionario: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'FK_IdFuncionario',
            references: { model: 'TB_FUNCIONARIOS', key: 'IdFuncionario' }
        },
        numeroTelefone: {
            type: DataTypes.STRING(15), 
            allowNull: false, 
            field: 'NumeroTelefone'
        },
        tipoTelefone: {
            type: DataTypes.ENUM(...Object.values(enumTipoTelefone)),
            allowNull: false,
            field: 'TipoTelefone'
        }
    },
    {
        sequelize,
        tableName: 'TB_TELEFONES',
        schema: 'dbo',
        timestamps: true,
        createdAt: 'DataCad',
        updatedAt: 'DataMod'
    }
);

export { TelefoneMap };