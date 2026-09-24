<<<<<<< HEAD
import { uuid as uuidv4 } from "uuidv4";
=======
import { v4 as uuidv4 } from "uuid";
>>>>>>> 1e714b84ab3f61af17c4defb65ae2afb93999285
import { enumSituacaoAmostra } from "../../enum/amostras/situacaoAmostra.enum";
import { enumClassificacaoAmostra, enumSubclassificacaoAmostra } from "../../enum/amostras/classificacaoAmostra.enum";

export interface IAmostra {
  idAmostra?: string | null;
  FK_idProtocolo: string;
  codigoAmostra: string;
  nomeAmostra: string;
  situacaoAmostra: enumSituacaoAmostra;
  classificacaoAmostra: enumClassificacaoAmostra;
  subclassificacaoAmostra: enumSubclassificacaoAmostra;
  descricao: string;
  dataCad?: string;
  dataMod?: string;
}

export default class Amostra {
  private _idAmostra: string | null = null;
  private _idProtocolo!: string;
  private _codigoAmostra!: string;
  private _nomeAmostra!: string;
  private _situacaoAmostra!: enumSituacaoAmostra;
  private _classificacaoAmostra!: enumClassificacaoAmostra;
  private _subclassificacaoAmostra!: enumSubclassificacaoAmostra;
  private _descricao!: string;
  private _dataCad: string;
  private _dataMod: string;

  constructor(
    idAmostra: string | null,
    idProtocolo: string,
    codigoAmostra: string,
    nomeAmostra: string,
    situacaoAmostra: enumSituacaoAmostra,
    classificacaoAmostra: enumClassificacaoAmostra,
    subclassificacaoAmostra: enumSubclassificacaoAmostra,
    descricao: string,
    dataCad?: string,
    dataMod?: string
  ) {
    // Atribuições usando SETTERS para acionar as validações
    this.idAmostra = idAmostra;
    this.idProtocolo = idProtocolo;
    this.codigoAmostra = codigoAmostra;
    this.nomeAmostra = nomeAmostra;
    this.situacaoAmostra = situacaoAmostra;
    this.classificacaoAmostra = classificacaoAmostra;
    this.subclassificacaoAmostra = subclassificacaoAmostra;
    this.descricao = descricao;

    // Inicialização das datas
    this._dataCad = dataCad || new Date().toISOString();
    this._dataMod = dataMod || new Date().toISOString();
  }

  // --- GETTERS ---
  get idAmostra(): string | null { return this._idAmostra; }
  get idProtocolo(): string { return this._idProtocolo; }
  get codigoAmostra(): string { return this._codigoAmostra; }
  get nomeAmostra(): string { return this._nomeAmostra; }
  get situacaoAmostra(): enumSituacaoAmostra { return this._situacaoAmostra; }
  get classificacaoAmostra(): enumClassificacaoAmostra { return this._classificacaoAmostra; }
  get subclassificacaoAmostra(): enumSubclassificacaoAmostra { return this._subclassificacaoAmostra; }
  get descricao(): string { return this._descricao; }
  get dataCad(): string { return this._dataCad; }
  get dataMod(): string { return this._dataMod; }

  // --- SETTERS ---
  set idAmostra(value: string | null) {
    this._idAmostra = value || null;
  }

  set idProtocolo(value: string) {
    this.validarUUID(value, "idProtocolo");
    this._idProtocolo = value;
    this.atualizarDataModificacao();
  }

  set codigoAmostra(value: string) {
    this.validarCodigoAmostra(value);
    this._codigoAmostra = value;
    this.atualizarDataModificacao();
  }

  set nomeAmostra(value: string) {
    this.validarTextoObrigatorio(value, "Nome da amostra", 3, 100);
    this._nomeAmostra = value;
    this.atualizarDataModificacao();
  }

  set situacaoAmostra(value: enumSituacaoAmostra) {
    this.validarEnum(value, enumSituacaoAmostra, "Situação da amostra");
    this._situacaoAmostra = value;
    this.atualizarDataModificacao();
  }

  set classificacaoAmostra(value: enumClassificacaoAmostra) {
    this.validarEnum(value, enumClassificacaoAmostra, "Classificação da amostra");
    this._classificacaoAmostra = value;
    this.atualizarDataModificacao();
  }

  set subclassificacaoAmostra(value: enumSubclassificacaoAmostra) {
    this.validarEnum(value, enumSubclassificacaoAmostra, "Subclassificação da amostra");
    this._subclassificacaoAmostra = value;
    this.atualizarDataModificacao();
  }

  set descricao(value: string) {
    this.validarDescricao(value);
    this._descricao = value;
    this.atualizarDataModificacao();
  }

  // --- MÉTODOS DE VALIDAÇÃO ---
  private validarCodigoAmostra(codigo: string): void {
    if (!codigo || typeof codigo !== "string" || codigo.trim().length < 2 || codigo.trim().length > 40) {
      throw new Error("O código da amostra é inválido. Deve conter entre 2 e 40 caracteres.");
    }
  }

  private validarTextoObrigatorio(texto: string, campo: string, min: number, max: number): void {
    if (!texto || typeof texto !== "string" || texto.trim().length < min || texto.trim().length > max) {
      throw new Error(`O campo ${campo} é inválido. Deve conter entre ${min} e ${max} caracteres.`);
    }
  }

  private validarDescricao(descricao: string): void {
    if (descricao && (typeof descricao !== "string" || descricao.trim().length > 1000)) {
      throw new Error("A descrição da amostra é muito longa. O limite máximo é de 1000 caracteres.");
    }
  }

  private validarEnum(valor: any, enumObjeto: any, nomeCampo: string): void {
    const valoresPermitidos = Object.values(enumObjeto);
    if (!valoresPermitidos.includes(valor)) {
      throw new Error(
        `${nomeCampo} inválida: "${valor}". Valores permitidos: ${valoresPermitidos.join(", ")}`
      );
    }
  }

  private validarUUID(id: string, campo: string): void {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || typeof id !== "string" || !uuidRegex.test(id)) {
      throw new Error(`O campo ${campo} deve conter um UUID válido.`);
    }
  }

  // --- MÉTODOS AUXILIARES ---
  private atualizarDataModificacao(): void {
    if (this._dataCad) {
      this._dataMod = new Date().toISOString();
    }
  }

  // --- FACTORY METHODS ---
  public static create(dados: Partial<IAmostra>): Amostra {
    return new Amostra(
      dados.idAmostra ? dados.idAmostra : uuidv4(),
      dados.FK_idProtocolo!,
      dados.codigoAmostra!,
      dados.nomeAmostra!,
      dados.situacaoAmostra!,
      dados.classificacaoAmostra!,
      dados.subclassificacaoAmostra!,
      dados.descricao!,
      dados.dataCad,
      dados.dataMod
    );
  }

  public static edit(id: string, dados: Partial<IAmostra>): Amostra {
    return new Amostra(
      id,
      dados.FK_idProtocolo!,
      dados.codigoAmostra!,
      dados.nomeAmostra!,
      dados.situacaoAmostra!,
      dados.classificacaoAmostra!,
      dados.subclassificacaoAmostra!,
      dados.descricao!,
      dados.dataCad,
      new Date().toISOString()
    );
  }

  public toJSON() {
    return {
      idAmostra: this._idAmostra,
      FK_idProtocolo: this._idProtocolo,
      codigoAmostra: this._codigoAmostra,
      nomeAmostra: this._nomeAmostra,
      situacaoAmostra: this._situacaoAmostra,
      classificacaoAmostra: this._classificacaoAmostra,
      subclassificacaoAmostra: this._subclassificacaoAmostra,
      descricao: this._descricao,
      dataCad: this._dataCad,
      dataMod: this._dataMod,
    };
  }
}