import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../configs/Database';
import { enumSituacaoEmpregaticia } from '../../enum/funcionarios/situacaoEmpregaticia'; 
import { IFuncionario } from '../../models/funcionarios/Funcionario';

interface FuncionarioCreationAttributes extends Optional<IFuncionario, 'idFuncionario' | 'dataCad' | 'dataMod'> {}

class FuncionarioMap extends Model<IFuncionario, FuncionarioCreationAttributes> implements IFuncionario {
    declare idFuncionario: string | null;
    declare FK_idCargo: string;
    declare nomeFuncionario: string;
    declare sobrenomeFuncionario: string;
    declare senhaHash: string;
    declare cpf: string;
    declare email: string;
    declare caminhoImagemPerfil: string; 
    declare situacaoEmpregaticia: enumSituacaoEmpregaticia;
    
    // Timestamps
    public readonly dataCad!: string;
    public readonly dataMod!: string;
}

FuncionarioMap.init(
    {
        idFuncionario: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            field: 'IdFuncionario'
        },
        FK_idCargo: { 
            type: DataTypes.UUID,
            allowNull: false,
            field: 'FK_IdCargo',
            references: { model: 'CARGOS', key: 'IdCargo' }
        },
        nomeFuncionario: {
            type: DataTypes.STRING(30),
            allowNull: false, 
            field: 'NomeFuncionario'
        },
        sobrenomeFuncionario: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'SobrenomeFuncionario'
        },
        senhaHash: {
            type: DataTypes.STRING(255),
            allowNull: false,
            field: 'SenhaHash'
        },
        cpf: {
            type: DataTypes.CHAR(11),
            allowNull: false,
            unique: true,
            field: 'CPF'
        },
        email: { 
            type: DataTypes.STRING(255), 
            allowNull: false, 
            unique: true, 
            field: 'Email' 
        },
        caminhoImagemPerfil: { 
            type: DataTypes.STRING(255), 
            allowNull: true, 
            field: 'CaminhoImagemPerfil' 
        },
        situacaoEmpregaticia: { 
            type: DataTypes.ENUM(...Object.values(enumSituacaoEmpregaticia)), 
            allowNull: false,
            field: 'SituacaoEmpregaticia'
        }
    },
    {
        sequelize,
        tableName: 'TB_FUNCIONARIOS',
        schema: 'dbo',
        timestamps: true,
        createdAt: 'DataCad',
        updatedAt: 'DataMod'
    }
);

export { FuncionarioMap };