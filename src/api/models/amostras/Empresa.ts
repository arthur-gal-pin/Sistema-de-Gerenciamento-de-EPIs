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
        this._nomeEmpresa = value;
        this.atualizarDataModificacao();
    }


    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new Empresa(
            dados.id,
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
    /**
     * Converte a classe para um objeto plano, removendo os underlines 
     * das propriedades privadas ao serializar.
     */
    public toJSON() {
        return {
            idOCP: this._idEmpresa,
            nomeOCP: this._nomeEmpresa,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}