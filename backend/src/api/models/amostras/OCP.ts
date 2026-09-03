import { uuid } from "uuidv4";

export interface IOcp{
    idOCP: string | null;
    nomeOCP: string;
    dataCad?: string;
    dataMod?: string;
}

export class OCP {
    private _idOCP: string | null = null;
    private _nomeOCP!: string;
    private _dataCad: string;
    private _dataMod: string;

    constructor(idOCP: string | null, nomeOCP: string, dataCad?: string, dataMod?: string) {
        this.idOCP = idOCP;
        this.nomeOCP = nomeOCP;
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
        if(!value || value !== null && value?.length !== 36){
            throw new Error ('O idOCP está errado.');
        }
        this._idOCP = value;
        this.atualizarDataModificacao();
    }

    set nomeOCP(value: string) {
        if(!value || value.length < 3 || value.length > 50){
            throw new Error ('Esse nome de OCP é inválido.')
        }
        this._nomeOCP = value;
        this.atualizarDataModificacao();
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

    private atualizarDataModificacao(): void {
        if (this._dataCad) { // Só atualiza se a instância já concluiu o construtor
            this._dataMod = new Date().toISOString();
        }
    }
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