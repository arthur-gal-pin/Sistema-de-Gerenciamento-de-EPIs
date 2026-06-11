import { enumSituacaoAmostra } from "../../enum/amostras/tsituacaoAmostra.enum";
import { uuid } from "uuidv4";

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
    private _idAmostra: string | null;
    private _idOCP: string;
    private _idEmpresa: string;
    private _nomeAmostra: string;
    private _tipoAmostra: string;
    private _situacaoAmostra: enumSituacaoAmostra;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idAmostra: string | null,
        idOCP: string,
        idEmpresa: string,
        nomeEmpresa: string,
        tipoAmostra: string,
        situacaoAmostra: enumSituacaoAmostra,
        dataCad?: string, // Tornados opcionais para usar o valor default
        dataMod?: string
    ) {
        this._idAmostra = idAmostra || null;
        this._idOCP = idOCP;
        this._idEmpresa = idEmpresa;
        this._nomeAmostra = nomeEmpresa;
        this._tipoAmostra = tipoAmostra;
        this._situacaoAmostra = situacaoAmostra;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idAmostra() { return this._idAmostra };
    get idOCP() { return this._idOCP };
    get idEmpresa() { return this._idEmpresa };
    get nomeAmostra() { return this._nomeAmostra };
    get tipoAmostra() { return this._tipoAmostra };
    get situacaoAmostra() { return this._situacaoAmostra };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idAmostra(value: string | null) { this._idAmostra = value; }
    set idOCP(value: string) { this._idOCP = value; }
    set idEmpresa(value: string) { this._idEmpresa = value; }

    set nomeAmostra(value: string) {
        this._nomeAmostra = value;
    }

    set tipoAmostra(value: string) {
        this._tipoAmostra = value;
    }

    set situacaoAmostra(value: enumSituacaoAmostra) {
        this._situacaoAmostra = value;
    }

    // --- MÉTODOS AUXILIARES ---



    // --- FACTORY METHODS ---

    /**
     * Cria uma instância a partir de um objeto de dados.
     * Útil para instanciar rapidamente a partir de retornos de formulários ou APIs.
     */
    public static create(dados: any): Amostra {
        return new Amostra(
            dados.idAmostra ? dados.idAmostra : String(uuid()),
            dados.idOCP,
            dados.idEmpresa,
            dados.nomeEmpresa,
            dados.tipoAmostra,
            dados.situacaoAmostra,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: any): Amostra {
        return new Amostra(
            id,
            dados.idOCP,
            dados.idEmpresa,
            dados.nomeEmpresa,
            dados.tipoAmostra,
            dados.situacaoAmostra,
            dados.dataCad,
            String(new Date().toISOString)
        )
    }


    /**
     * Converte a instância da classe em um objeto literal (JSON), 
     * útil para enviar em requisições HTTP.
     */

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
