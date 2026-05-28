import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../configs/Database';
import { enumNivelPermissao } from '../../enum/funcionarios/nivelPermissao.enum';
import { ICargo } from '../../models/funcionarios/Cargo';
import { UUIDV4 } from 'sequelize'; 

interface CargoCreationAttributes extends Optional<ICargo, 'idCargo' | 'dataCad' | 'dataMod'> {}

class CargoMap extends Model<ICargo, CargoCreationAttributes> implements ICargo {
    declare idCargo: string | null; 
    declare nomeCargo: string;
    declare nivelPermissao: enumNivelPermissao;
    
    declare readonly dataCad?: string;
    declare readonly dataMod?: string;
}

CargoMap.init(
    {
        idCargo: {
            type: DataTypes.UUID,
            primaryKey: true,
            field: 'IdCargo',
            defaultValue: UUIDV4()
        },
        nomeCargo: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: 'NomeCargo'
        },
        nivelPermissao: {
            type: DataTypes.STRING(30),
            allowNull: false,
            field: 'NivelPermissao'
        }
    },
    {
        sequelize,
        tableName: 'TB_CARGOS',
        schema: 'dbo',
        timestamps: true,
        createdAt: 'DataCad', 
        updatedAt: 'DataMod'
    }
);

export { CargoMap };