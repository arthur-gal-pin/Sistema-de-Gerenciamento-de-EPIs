import { uuid as uuidv4 } from "uuidv4";
import { enumPapelEnsaio } from "../../enum/amostras/situacaoAmostra.enum";



export interface IEnsaio {
  idEnsaio: string | null;
  FK_idProtocolo: string;
  FK_idTipoEnsaio: string;
  papel: enumPapelEnsaio;
  descricao?: string;
  dataCad?: string;
  dataMod?: string;
}

export class Ensaio implements IEnsaio {
  private _idEnsaio: string | null = null;
  private _FK_idProtocolo!: string;
  private _FK_idTipoEnsaio!: string;
  private _papel!: enumPapelEnsaio;
  private _descricao?: string;
  private _dataCad: string;
  private _dataMod: string;

  constructor(
    idEnsaio: string | null,
    FK_idProtocolo: string,
    FK_idTipoEnsaio: string,
    papel: enumPapelEnsaio,
    descricao?: string,
    dataCad?: string,
    dataMod?: string
  ) {
    const agora = new Date().toISOString();
    this._dataCad = dataCad || agora;
    this._dataMod = dataMod || agora;

    // Atribuições diretas para respeitar os parâmetros dataCad/dataMod recebidos
    this.idEnsaio = idEnsaio;
    this.FK_idProtocolo = FK_idProtocolo;
    this.FK_idTipoEnsaio = FK_idTipoEnsaio;
    this.papel = papel;
    this.descricao = descricao;

    // Garante que a dataMod inicial reflita o valor fornecido via construtor
    this._dataMod = dataMod || agora;
  }

  // --- GETTERS ---
  get idEnsaio(): string | null { return this._idEnsaio; }
  get FK_idProtocolo(): string { return this._FK_idProtocolo; }
  get FK_idTipoEnsaio(): string { return this._FK_idTipoEnsaio; }
  get papel(): enumPapelEnsaio { return this._papel; }
  get descricao(): string | undefined { return this._descricao; }
  get dataCad(): string { return this._dataCad; }
  get dataMod(): string { return this._dataMod; }

  // --- SETTERS ---
  set idEnsaio(value: string | null) {
    if (value !== null && value.length !== 36) {
      throw new Error('O idEnsaio informado é inválido.');
    }
    this._idEnsaio = value;
    this.atualizarDataModificacao();
  }

  set FK_idProtocolo(value: string) {
    if (!value || value.length !== 36) {
      throw new Error('O FK_idProtocolo informado é inválido.');
    }
    this._FK_idProtocolo = value;
    this.atualizarDataModificacao();
  }

  set FK_idTipoEnsaio(value: string) {
    if (!value || value.length !== 36) {
      throw new Error('O FK_idTipoEnsaio informado é inválido.');
    }
    this._FK_idTipoEnsaio = value;
    this.atualizarDataModificacao();
  }

  set papel(value: enumPapelEnsaio) {
    if (!value || !Object.values(enumPapelEnsaio).includes(value)) {
      throw new Error('O papel do ensaio informado é inválido.');
    }
    this._papel = value;
    this.atualizarDataModificacao();
  }

  set descricao(value: string | undefined) {
    if (value && value.length > 3000) {
      throw new Error('A descrição do ensaio excede o tamanho máximo permitido.');
    }
    this._descricao = value;
    this.atualizarDataModificacao();
  }

  // --- MÉTODOS DE FÁBRICA ---
  public static create(dados: Partial<IEnsaio>): Ensaio {
    return new Ensaio(
      dados.idEnsaio ?? uuidv4(),
      dados.FK_idProtocolo!,
      dados.FK_idTipoEnsaio!,
      dados.papel!,
      dados.descricao,
      dados.dataCad,
      dados.dataMod
    );
  }

  public static edit(id: string, dados: Partial<IEnsaio>): Ensaio {
    return new Ensaio(
      id,
      dados.FK_idProtocolo!,
      dados.FK_idTipoEnsaio!,
      dados.papel!,
      dados.descricao,
      dados.dataCad,
      new Date().toISOString()
    );
  }

  // --- MÉTODOS AUXILIARES ---
  private atualizarDataModificacao(): void {
    if (this._dataCad) {
      this._dataMod = new Date().toISOString();
    }
  }

  public toJSON(): IEnsaio {
    return {
      idEnsaio: this._idEnsaio,
      FK_idProtocolo: this._FK_idProtocolo,
      FK_idTipoEnsaio: this._FK_idTipoEnsaio,
      papel: this._papel,
      descricao: this._descricao,
      dataCad: this._dataCad,
      dataMod: this._dataMod,
    };
  }
}