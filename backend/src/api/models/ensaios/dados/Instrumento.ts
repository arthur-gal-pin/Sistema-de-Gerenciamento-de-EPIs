import { v4 as uuidv4 } from "uuid";

export interface IInstrumento {
    idInstrumento: string | null;
    nomeInstrumento: string;
    funcaoInstrumento?: string;
    ultimaCalibracao: Date | string;
    dataCad?: string;
    dataMod?: string;
}

export class Instrumento {
    private _idInstrumento: string | null = null;
    private _nomeInstrumento!: string;
    private _funcaoInstrumento?: string;
    private _ultimaCalibracao!: Date;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idInstrumento: string | null,
        nomeInstrumento: string,
        ultimaCalibracao: Date | string,
        funcaoInstrumento?: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();

        // Atribuições via setters para rodar as validações
        this.idInstrumento = idInstrumento;
        this.nomeInstrumento = nomeInstrumento;
        this.ultimaCalibracao = ultimaCalibracao;
        this._funcaoInstrumento = funcaoInstrumento;
    }

    // --- GETTERS ---
    get idInstrumento(): string | null { return this._idInstrumento; }
    get nomeInstrumento(): string { return this._nomeInstrumento; }
    get funcaoInstrumento(): string | undefined { return this._funcaoInstrumento; }
    get ultimaCalibracao(): Date { return this._ultimaCalibracao; }
    get dataCad(): string { return this._dataCad; }
    get dataMod(): string { return this._dataMod; }

    // --- SETTERS ---
    set idInstrumento(value: string | null) {
        if (value !== null && value.length !== 36) {
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

    set ultimaCalibracao(value: Date | string) {
        const dataParsed = value instanceof Date ? value : new Date(value);
        if (isNaN(dataParsed.getTime())) {
            throw new Error('A data da última calibração é inválida.');
        }
        this._ultimaCalibracao = dataParsed;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: Omit<IInstrumento, "idInstrumento"> & { idInstrumento?: string | null }): Instrumento {
        return new Instrumento(
            dados.idInstrumento ?? uuidv4(),
            dados.nomeInstrumento,
            dados.ultimaCalibracao,
            dados.funcaoInstrumento,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: Partial<IInstrumento>): Instrumento {
        return new Instrumento(
            id,
            dados.nomeInstrumento ?? "",
            dados.ultimaCalibracao ?? new Date(),
            dados.funcaoInstrumento,
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

    /**
     * Converte a classe para um objeto plano, removendo os underlines
     * das propriedades privadas ao serializar.
     */
    public toJSON(): IInstrumento {
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