import { v4 as uuidv4 } from "uuid";
import { enumSituacaoAmostra } from "../../enum/amostras/tsituacaoAmostra.enum";

export interface IAmostra {
  idAmostra?: string | null;
  FK_idOCP: string;
  FK_idEmpresa: string;
  nomeAmostra: string;
  tipoAmostra: string;
  situacaoAmostra: enumSituacaoAmostra;
  dataCad?: string;
  dataMod?: string;
}

export default class Amostra {
  private _idAmostra: string | null = null;
  private _idOCP!: string;
  private _idEmpresa!: string;
  private _nomeAmostra!: string;
  private _tipoAmostra!: string;
  private _situacaoAmostra!: enumSituacaoAmostra;
  private _dataCad: string;
  private _dataMod: string;

  constructor(
    idAmostra: string | null,
    idOCP: string,
    idEmpresa: string,
    nomeAmostra: string,
    tipoAmostra: string,
    situacaoAmostra: enumSituacaoAmostra,
    dataCad?: string,
    dataMod?: string
  ) {
    // Atribuições usando SETTERS para acionar as validações
    this.idAmostra = idAmostra;
    this.idOCP = idOCP;
    this.idEmpresa = idEmpresa;
    this.nomeAmostra = nomeAmostra;
    this.tipoAmostra = tipoAmostra;
    this.situacaoAmostra = situacaoAmostra;

    // Inicialização das datas
    this._dataCad = dataCad || new Date().toISOString();
    this._dataMod = dataMod || new Date().toISOString();
  }

  // --- GETTERS ---
  get idAmostra(): string | null { return this._idAmostra; }
  get idOCP(): string { return this._idOCP; }
  get idEmpresa(): string { return this._idEmpresa; }
  get nomeAmostra(): string { return this._nomeAmostra; }
  get tipoAmostra(): string { return this._tipoAmostra; }
  get situacaoAmostra(): enumSituacaoAmostra { return this._situacaoAmostra; }
  get dataCad(): string { return this._dataCad; }
  get dataMod(): string { return this._dataMod; }

  // --- SETTERS ---
  set idAmostra(value: string | null) {
    this._idAmostra = value || null;
  }

  set idOCP(value: string) {
    this.validarUUID(value, "idOCP");
    this._idOCP = value;
    this.atualizarDataModificacao();
  }

  set idEmpresa(value: string) {
    this.validarUUID(value, "idEmpresa");
    this._idEmpresa = value;
    this.atualizarDataModificacao();
  }

  set nomeAmostra(value: string) {
    this.validarNomeAmostra(value);
    this._nomeAmostra = value;
    this.atualizarDataModificacao();
  }

  set tipoAmostra(value: string) {
    this.validarTipoAmostra(value);
    this._tipoAmostra = value;
    this.atualizarDataModificacao();
  }

  set situacaoAmostra(value: enumSituacaoAmostra) {
    this.validarSituacao(value);
    this._situacaoAmostra = value;
    this.atualizarDataModificacao();
  }

  // --- MÉTODOS DE VALIDAÇÃO ---
  private validarNomeAmostra(nome: string): void {
    if (!nome || typeof nome !== "string" || nome.trim().length < 3 || nome.trim().length > 100) {
      throw new Error("O nome da amostra é inválido. Deve conter entre 3 e 100 caracteres.");
    }
  }

  private validarTipoAmostra(tipo: string): void {
    if (!tipo || typeof tipo !== "string" || tipo.trim().length < 2 || tipo.trim().length > 50) {
      throw new Error("O tipo da amostra é inválido. Deve conter entre 2 e 50 caracteres.");
    }
  }

  private validarSituacao(valor: any): void {
    const valoresPermitidos = Object.values(enumSituacaoAmostra);
    if (!valoresPermitidos.includes(valor)) {
      throw new Error(
        `Situação da amostra inválida: "${valor}". Valores permitidos: ${valoresPermitidos.join(", ")}`
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
      dados.FK_idOCP!,
      dados.FK_idEmpresa!,
      dados.nomeAmostra!,
      dados.tipoAmostra!,
      dados.situacaoAmostra!,
      dados.dataCad,
      dados.dataMod
    );
  }

  public static edit(id: string, dados: Partial<IAmostra>): Amostra {
    return new Amostra(
      id,
      dados.FK_idOCP!,
      dados.FK_idEmpresa!,
      dados.nomeAmostra!,
      dados.tipoAmostra!,
      dados.situacaoAmostra!,
      dados.dataCad,
      new Date().toISOString()
    );
  }

  public toJSON() {
    return {
      idAmostra: this._idAmostra,
      FK_idOCP: this._idOCP,
      FK_idEmpresa: this._idEmpresa,
      nomeAmostra: this._nomeAmostra,
      tipoAmostra: this._tipoAmostra,
      situacaoAmostra: this._situacaoAmostra,
      dataCad: this._dataCad,
      dataMod: this._dataMod,
    };
  }
}