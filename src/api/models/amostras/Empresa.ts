import { uuid } from "uuidv4";

export interface IEmpresa {
    idEmpresa: string | null;
    nomeEmpresa: string;
    dataCad?: string;
    dataMod?: string;
}


export class Empresa {
    private _idEmpresa: string | null;
    private _nomeEmpresa: string;
    private _dataCad: string;
    private _dataMod: string;

    constructor(idEmpresa: string | null, nomeEmpresa: string, dataCad?: string, dataMod?: string) {
        this._idEmpresa = idEmpresa;
        this._nomeEmpresa = nomeEmpresa;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idEmpresa() { return this._idEmpresa };
    get nomeEmpresa() { return this._nomeEmpresa };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idEmpresa(value: string | null) {
        this._idEmpresa = value;
        this.atualizarDataModificacao();
    }

    set nomeEmpresa(value: string) {
        const valido = this.validarNomeEmpresa(value); //True ou false se a validação fucnionar
        if (!valido) {
            throw new Error("O nome da empresa não é válido.")
        } else {
            this._nomeEmpresa = value;
            this.atualizarDataModificacao();
        }
    }


    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new Empresa(
            dados.idEmpresa ? dados.idEmpresa : String(uuid()),
            dados.nomeEmpresa,
            dados.dataCad,
            dados.dataMod
        )
    }

    public static edit(id: string, dados: any) {
        return new Empresa(
            id,
            dados.nomeEmpresa,
            dados.dataCad,
            dados.dataMod
        )
    }

    // --- MÉTODOS AUXILIARES ---

    private atualizarDataModificacao(): void {
        this._dataMod = new Date().toISOString();
    }

    private validarNomeEmpresa(nome: string): boolean {
        if (!nome || nome.length < 3 || nome.length > 50) {
            return false;
        }
        return true;
    }
    /**
     * Converte a classe para um objeto plano, removendo os underlines 
     * das propriedades privadas ao serializar.
     */
    public toJSON() {
        return {
            idEmpresa: this._idEmpresa,
            nomeEmpresa: this._nomeEmpresa,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}