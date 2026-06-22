import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import CargoMap from './cargo.map';
import TelefoneMap from './telefone.map';


import { enumSituacaoEmpregaticia } from '../../enum/funcionarios/situacaoEmpregaticia';


@Table({
    tableName: 'TB_FUNCIONARIOS',
    schema: 'dbo',
    timestamps: true,
    createdAt: 'DataCad',
    updatedAt: 'DataMod',
})
export default class FuncionarioMap extends Model {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
        field: 'IdFuncionario',
    })
    idFuncionario!: string;

    // RELAÇÃO COM CARGO (FK)

    @ForeignKey(() => CargoMap)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        field: 'FK_IdCargo',
    })
    fkIdCargo!: string;

    @BelongsTo(() => CargoMap)
    cargo!: CargoMap;

    @Column({
        type: DataType.STRING(30), // Mapeia o VARCHAR(30) 
        allowNull: false,
        field: 'NomeFuncionario',
    })
    nomeFuncionario!: string;

    @Column({
        type: DataType.STRING(200), // Mapeia o VARCHAR(200) 
        allowNull: false,
        field: 'SobrenomeFuncionario',
    })
    sobrenomeFuncionario!: string;

    @Column({
        type: DataType.CHAR(11), // Mapeia o CHAR(11)
        allowNull: false,
        field: 'Cpf',
    })
    cpf!: string;

    @Column({
        type: DataType.STRING(255), // Mapeia o VARCHAR(255) da imagem
        allowNull: false,
        field: 'SenhaHash',
    })
    senhaHash!: string;

    @Column({
        type: DataType.STRING(255), // Mapeia o VARCHAR(255)
        allowNull: false,
        field: 'Email',
    })
    email!: string;

    @Column({
        type: DataType.STRING(255), // Mapeia o VARCHAR(255) da imagem
        allowNull: true,
        field: 'CaminholmagemPerfil',
    })
    caminhoImagemPerfil!: string;

    @Column({
        // Substitui pelas chaves do teu enum real caso o tenhas criado
        type: DataType.ENUM(...Object.keys(enumSituacaoEmpregaticia)), 
        allowNull: false,
        field: 'SituacaoEmpregaticia',
    })
    situacaoEmpregaticia!: string; 

    // RELAÇÃO COM OUTRAS TABELAS (1 Funcionário tem N Telefones)
    @HasMany(() => TelefoneMap, 'FK_IdFuncionario')
    telefones!: TelefoneMap[];
}