import { uuid } from "uuidv4";

export interface IInstrumento {
    idInstrumento: string | null;
    nomeInstrumento: string;
    funcaoInstrumento?: string;
    ultimaCalibracao: string;
    dataCad?: string;
    dataMod?: string;
}

export class Instrumento {
    private _idInstrumento: string | null = null;
    private _nomeInstrumento!: string;
    private _funcaoInstrumento?: string;
    private _ultimaCalibracao!: string;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idInstrumento: string | null,
        nomeInstrumento: string,
        ultimaCalibracao: string,
        funcaoInstrumento?: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idInstrumento = idInstrumento;
        this.nomeInstrumento = nomeInstrumento;
        this.ultimaCalibracao = ultimaCalibracao;
        this._funcaoInstrumento = funcaoInstrumento;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idInstrumento() { return this._idInstrumento };
    get nomeInstrumento() { return this._nomeInstrumento };
    get funcaoInstrumento() { return this._funcaoInstrumento };
    get ultimaCalibracao() { return this._ultimaCalibracao };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idInstrumento(value: string | null) {
        if (!value || value !== null && value?.length !== 36) {
            throw new Error('O idInstrumento está errado.');
        }
        this._idInstrumento = value;
        this.atualizarDataModificacao();
    }

    set nomeInstrumento(value: string) {
        if (!value || value.length < 2 || value.length > 50) {
            throw new Error('Esse nome de instrumento é inválido.');
        }
        this._nomeInstrumento = value;
        this.atualizarDataModificacao();
    }

    set funcaoInstrumento(value: string | undefined) {
        if (value && value.length > 255) {
            throw new Error('A função do instrumento excede o tamanho máximo permitido.');
        }
        this._funcaoInstrumento = value;
        this.atualizarDataModificacao();
    }

    set ultimaCalibracao(value: string) {
        if (!value || isNaN(new Date(value).getTime())) {
            throw new Error('A data da última calibração é inválida.');
        }
        this._ultimaCalibracao = value;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new Instrumento(
            dados.idInstrumento ? dados.idInstrumento : String(uuid()),
            dados.nomeInstrumento,
            dados.ultimaCalibracao,
            dados.funcaoInstrumento,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: any) {
        return new Instrumento(
            id,
            dados.nomeInstrumento,
            dados.ultimaCalibracao,
            dados.funcaoInstrumento,
            dados.dataCad,
            String(new Date().toISOString())
        );
    }

    // --- MÉTODOS AUXILIARES ---
    private atualizarDataModificacao(): void {
        if (this._dataCad) {
            this._dataMod = new Date().toISOString();
        }
    }

    /**
     * Converte a classe para um objeto plano, removendo os underlines
     * das propriedades privadas ao serializar.
     */
    public toJSON() {
        return {
            idInstrumento: this._idInstrumento,
            nomeInstrumento: this._nomeInstrumento,
            funcaoInstrumento: this._funcaoInstrumento,
            ultimaCalibracao: this._ultimaCalibracao,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}
