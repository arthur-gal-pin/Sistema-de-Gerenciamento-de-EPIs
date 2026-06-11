import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../configs/Database';

import { IOcp } from '../../models/amostras/OCP';

interface OcpCreationAttributes extends Optional<IOcp, 'idOCP' | 'dataCad' | 'dataMod'> {}

class OcpMap extends Model<IOcp, OcpCreationAttributes> implements IOcp {

    public idOCP!: string | null;
    public nomeOCP!: string;

    // Timestamps
    public readonly dataCad!: string;
    public readonly dataMod!: string;
}

OcpMap.init(
    {
        idOCP: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            field: 'IdOCP'
        },

        nomeOCP: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'NomeOCP'
        }
    },
    {
        sequelize,
        tableName: 'TB_OCP',
        schema: 'dbo',
        timestamps: true,
        createdAt: 'DataCad',
        updatedAt: 'DataMod'
    }
);

export { OcpMap };