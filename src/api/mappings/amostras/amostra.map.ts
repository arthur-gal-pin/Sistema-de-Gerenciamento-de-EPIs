import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { enumSituacaoAmostra } from '../../enum/amostras/tsituacaoAmostra.enum';
import EmpresaMap from './empresa.map';
import OcpMap from './ocp.map';

@Table({
  tableName: 'TB_AMOSTRAS',
  schema: 'dbo',
  timestamps: true,
  createdAt: 'DataCad',
  updatedAt: 'DataMod',
})
export default class AmostraMap extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    field: 'IdAmostra',
  })
  idAmostra!: string;

  // RELAÇÃO COM EMPRESA
  @ForeignKey(() => EmpresaMap)
  @Column({ type: DataType.UUID, allowNull: false, field: 'FK_IdEmpresa' })
  fkIdEmpresa!: string;

  @BelongsTo(() => EmpresaMap)
  empresa!: EmpresaMap;

  // RELAÇÃO COM OCP
  @ForeignKey(() => OcpMap)
  @Column({ type: DataType.UUID, allowNull: false, field: 'FK_IdOCP' })
  fkIdOcp!: string;

  @BelongsTo(() => OcpMap)
  ocp!: OcpMap;

  @Column({ type: DataType.STRING(255), allowNull: false, field: 'NomeAmostra' })
  nomeAmostra!: string;

  @Column({ type: DataType.STRING(255), allowNull: false, field: 'TipoAmostra' })
  tipoAmostra!: string;

  @Column({
    type: DataType.ENUM('prova', 'contraprova', 'testemunha'),
    allowNull: false,
    field: 'SituacaoAmostra',
  })
  situacaoAmostra!: enumSituacaoAmostra;
}