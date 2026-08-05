import { uuid } from "uuidv4";

export interface IOcp{
    idOCP: string | null;
    nomeOCP: string;
    dataCad?: string;
    dataMod?: string;
}

export class OCP {
    private _idOCP: string | null;
    private _nomeOCP: string;
    private _dataCad: string;
    private _dataMod: string;

    constructor(idOCP: string | null, nomeOCP: string, dataCad?: string, dataMod?: string) {
        this._idOCP = idOCP;
        this._nomeOCP = nomeOCP;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idOCP() { return this._idOCP };
    get nomeOCP() { return this._nomeOCP };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idOCP(value: string | null) {
        this._idOCP = value;
    }

    set nomeOCP(value: string) {
        this._nomeOCP = value;
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new OCP(
            dados.idOCP ? dados.idOCP : String(uuid()),
            dados.nomeOCP,
            dados.dataCad,
            dados.dataMod
        )
    }

    public static edit(id: string, dados: any) {
        return new OCP(
            id,
            dados.nomeOCP,
            dados.dataCad,
            String(new Date().toISOString())
        )
    }

    // --- MÉTODOS AUXILIARES ---

    /**
     * Converte a classe para um objeto plano, removendo os underlines 
     * das propriedades privadas ao serializar.
     */
    public toJSON() {
        return {
            idOCP: this._idOCP,
            nomeOCP: this._nomeOCP,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}