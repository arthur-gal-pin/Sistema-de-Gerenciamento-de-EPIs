import { uuid } from "uuidv4";

export interface IDadosEnsaio {
    idDadosEnsaio: string | null;
    FK_idAmostraEnsaio: string;
    FK_idCampoEnsaio: string;
    nomeDado: string;
    dado: string;
    dataCad?: string;
    dataMod?: string;
}

export class DadosEnsaio {
    private _idDadosEnsaio: string | null = null;
    private _FK_idAmostraEnsaio!: string;
    private _FK_idCampoEnsaio!: string;
    private _nomeDado!: string;
    private _dado!: string;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idDadosEnsaio: string | null,
        FK_idAmostraEnsaio: string,
        FK_idCampoEnsaio: string,
        nomeDado: string,
        dado: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idDadosEnsaio = idDadosEnsaio;
        this.FK_idAmostraEnsaio = FK_idAmostraEnsaio;
        this.FK_idCampoEnsaio = FK_idCampoEnsaio;
        this.nomeDado = nomeDado;
        this.dado = dado;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idDadosEnsaio() { return this._idDadosEnsaio };
    get FK_idAmostraEnsaio() { return this._FK_idAmostraEnsaio };
    get FK_idCampoEnsaio() { return this._FK_idCampoEnsaio };
    get nomeDado() { return this._nomeDado };
    get dado() { return this._dado };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idDadosEnsaio(value: string | null) {
        if (!value || value !== null && value?.length !== 36) {
            throw new Error('O idDadosEnsaio está errado.');
        }
        this._idDadosEnsaio = value;
        this.atualizarDataModificacao();
    }

    // Note: aponta para AMOSTRA_ENSAIO (a execução específica), não para
    // ENSAIOS diretamente — é o que garante que cada resultado fique
    // isolado por amostra/ocorrência, mesmo quando a mesma amostra é
    // ensaiada mais de uma vez dentro do mesmo ensaio.
    set FK_idAmostraEnsaio(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idAmostraEnsaio informado é inválido.');
        }
        this._FK_idAmostraEnsaio = value;
        this.atualizarDataModificacao();
    }

    set FK_idCampoEnsaio(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idCampoEnsaio informado é inválido.');
        }
        this._FK_idCampoEnsaio = value;
        this.atualizarDataModificacao();
    }

    set nomeDado(value: string) {
        if (!value || value.length < 1 || value.length > 80) {
            throw new Error('O nome do dado é inválido.');
        }
        this._nomeDado = value;
        this.atualizarDataModificacao();
    }

    set dado(value: string) {
        if (value === undefined || value === null || value.length > 255) {
            throw new Error('O valor do dado é inválido ou excede o tamanho máximo permitido.');
        }
        this._dado = value;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new DadosEnsaio(
            dados.idDadosEnsaio ? dados.idDadosEnsaio : String(uuid()),
            dados.FK_idAmostraEnsaio,
            dados.FK_idCampoEnsaio,
            dados.nomeDado,
            dados.dado,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: any) {
        return new DadosEnsaio(
            id,
            dados.FK_idAmostraEnsaio,
            dados.FK_idCampoEnsaio,
            dados.nomeDado,
            dados.dado,
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
            idDadosEnsaio: this._idDadosEnsaio,
            FK_idAmostraEnsaio: this._FK_idAmostraEnsaio,
            FK_idCampoEnsaio: this._FK_idCampoEnsaio,
            nomeDado: this._nomeDado,
            dado: this._dado,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}
