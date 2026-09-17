import { uuid } from "uuidv4";
import { enumTipoProtocolo } from "../../enum/ensaios/tipoProtocolo.enum";

export interface IProtocolo {
    idProtocolo?: string | null;
    FK_idOCP: string;
    FK_idEmpresa: string;
    nomeProtocolo: string;
    numeroProtocolo: string;
    numeroSEI: string;
    tipoProtocolo: enumTipoProtocolo;
    diaAbertura: string;
    diaEntrega?: string;
    testemunha?: string;
    descricao?: string;
    dataCad?: string;
    dataMod?: string;
}

export class Protocolo {
    private _idProtocolo: string | null = null;
    private _FK_idOCP!: string;
    private _FK_idEmpresa!: string;
    private _nomeProtocolo!: string;
    private _numeroProtocolo!: string;
    private _numeroSEI!: string;
    private _tipoProtocolo!: enumTipoProtocolo;
    private _diaAbertura!: string;
    private _diaEntrega?: string;
    private _testemunha?: string;
    private _descricao?: string;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idProtocolo: string | null,
        FK_idOCP: string,
        FK_idEmpresa: string,
        nomeProtocolo: string,
        numeroProtocolo: string,
        numeroSEI: string,
        tipoProtocolo: enumTipoProtocolo,
        diaAbertura: string,
        diaEntrega?: string,
        testemunha?: string,
        descricao?: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idProtocolo = idProtocolo;
        this.FK_idOCP = FK_idOCP;
        this.FK_idEmpresa = FK_idEmpresa;
        this.nomeProtocolo = nomeProtocolo;
        this.numeroProtocolo = numeroProtocolo;
        this.numeroSEI = numeroSEI;
        this.tipoProtocolo = tipoProtocolo;
        this.diaAbertura = diaAbertura;
        this.diaEntrega = diaEntrega;
        this._testemunha = testemunha;
        this._descricao = descricao;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idProtocolo() { return this._idProtocolo; }
    get FK_idOCP() { return this._FK_idOCP; }
    get FK_idEmpresa() { return this._FK_idEmpresa; }
    get nomeProtocolo() { return this._nomeProtocolo; }
    get numeroProtocolo() { return this._numeroProtocolo; }
    get numeroSEI() { return this._numeroSEI; }
    get tipoProtocolo() { return this._tipoProtocolo; }
    get diaAbertura() { return this._diaAbertura; }
    get diaEntrega() { return this._diaEntrega; }
    get testemunha() { return this._testemunha; }
    get descricao() { return this._descricao; }
    get dataCad() { return this._dataCad; }
    get dataMod() { return this._dataMod; }

    // --- SETTERS ---
    set idProtocolo(value: string | null) {
        if (!value || (value !== null && value.length !== 36)) {
            throw new Error('O idProtocolo está errado.');
        }
        this._idProtocolo = value;
        this.atualizarDataModificacao();
    }

    set FK_idOCP(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idOCP informado é inválido.');
        }
        this._FK_idOCP = value;
        this.atualizarDataModificacao();
    }

    set FK_idEmpresa(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idEmpresa informado é inválido.');
        }
        this._FK_idEmpresa = value;
        this.atualizarDataModificacao();
    }

    set numeroProtocolo(value: string) {
        if (!value || value.length < 1 || value.length > 255) {
            throw new Error('O número do protocolo é inválido.');
        }
        this._numeroProtocolo = value;
        this.atualizarDataModificacao();
    }

    set numeroSEI(value: string) {
        if (!value || value.length < 1 || value.length > 255) {
            throw new Error('O número do processo SEI é inválido.');
        }
        this._numeroSEI = value;
        this.atualizarDataModificacao();
    }

    set tipoProtocolo(value: enumTipoProtocolo) {
        if (!value || !Object.values(enumTipoProtocolo).includes(value)) {
            throw new Error('O tipo de protocolo informado é inválido.');
        }
        this._tipoProtocolo = value;
        this.atualizarDataModificacao();
    }

    set diaAbertura(value: string) {
        if (!value || isNaN(new Date(value).getTime())) {
            throw new Error('O dia de abertura do protocolo é inválido.');
        }
        this._diaAbertura = value;
        this.atualizarDataModificacao();
    }

    set diaEntrega(value: string | undefined) {
        if (value && isNaN(new Date(value).getTime())) {
            throw new Error('O dia de entrega do protocolo é inválido.');
        }
        this._diaEntrega = value;
        this.atualizarDataModificacao();
    }

    set testemunha(value: string | undefined) {
        if (value && value.length > 255) {
            throw new Error('O campo testemunha excede o tamanho máximo permitido.');
        }
        this._testemunha = value;
        this.atualizarDataModificacao();
    }

    set descricao(value: string | undefined) {
        if (value && value.length > 2500) {
            throw new Error('A descrição do protocolo excede o tamanho máximo permitido.');
        }
        this._descricao = value;
        this.atualizarDataModificacao();
    }

    set nomeProtocolo(value: string) {
        if (!value || value.length < 3 || value.length > 40) {
            throw new Error('O nome do protocolo deve ter no mínimo 3 caracteres, e no máximo 40');
        }
        this._nomeProtocolo = value;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new Protocolo(
            dados.idProtocolo ? dados.idProtocolo : String(uuid()),
            dados.FK_idOCP,
            dados.FK_idEmpresa,
            dados.nomeProtocolo,
            dados.numeroProtocolo,
            dados.numeroSEI,
            dados.tipoProtocolo as enumTipoProtocolo,
            dados.diaAbertura,
            dados.diaEntrega,
            dados.testemunha,
            dados.descricao,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(atual: Partial<IProtocolo>, dados: Partial<IProtocolo>) {
        return new Protocolo(
            atual.idProtocolo ?? null,
            (dados.FK_idOCP ?? atual.FK_idOCP)!,
            (dados.FK_idEmpresa ?? atual.FK_idEmpresa)!,
            (dados.nomeProtocolo ?? atual.nomeProtocolo)!,
            (dados.numeroProtocolo ?? atual.numeroProtocolo)!,
            (dados.numeroSEI ?? atual.numeroSEI)!,
            (dados.tipoProtocolo ?? atual.tipoProtocolo)! as enumTipoProtocolo,
            (dados.diaAbertura ?? atual.diaAbertura)!,
            dados.diaEntrega ?? atual.diaEntrega,
            dados.testemunha ?? atual.testemunha,
            dados.descricao ?? atual.descricao,
            atual.dataCad,
            new Date().toISOString()
        );
    }

    // --- MÉTODOS AUXILIARES ---
    private atualizarDataModificacao(): void {
        if (this._dataCad) {
            this._dataMod = new Date().toISOString();
        }
    }

    public toJSON() {
        return {
            idProtocolo: this._idProtocolo,
            FK_idOCP: this._FK_idOCP,
            FK_idEmpresa: this._FK_idEmpresa,
            nomeProtocolo: this._nomeProtocolo,
            numeroProtocolo: this._numeroProtocolo,
            numeroSEI: this._numeroSEI,
            tipoProtocolo: this._tipoProtocolo,
            diaAbertura: this._diaAbertura,
            diaEntrega: this._diaEntrega,
            testemunha: this._testemunha,
            descricao: this._descricao,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}