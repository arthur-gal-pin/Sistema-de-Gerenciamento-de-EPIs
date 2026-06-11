import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../configs/Database';
import { IEmpresa } from '../../models/amostras/Empresa';

interface EmpresaCreationAttributes extends Optional<IEmpresa, 'idEmpresa' | 'dataCad' | 'dataMod'> {}

class EmpresaMap extends Model<IEmpresa, EmpresaCreationAttributes> implements IEmpresa {
    public idEmpresa!: string | null;
    public nomeEmpresa!: string;

    // Timestamps
    public readonly dataCad!: string;
    public readonly dataMod!: string;
}

EmpresaMap.init(
    {
        idEmpresa: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            field: 'IdEmpresa'
        },

        nomeEmpresa: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'NomeEmpresa'
        }
    },
    {
        sequelize,
        tableName: 'TB_EMPRESAS',
        schema: 'dbo',
        timestamps: true,
        createdAt: 'DataCad',
        updatedAt: 'DataMod'
    }
);

export { EmpresaMap };