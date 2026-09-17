import { uuid } from "uuidv4";

// Obs: mesmo domínio de valores usado como "papel" da amostra
// (prova/contraprova/testemunha). Se já existir um enum equivalente no
// domínio de Amostra, o ideal é importar/reaproveitar aquele em vez de
// duplicar aqui.
export enum enumPapelEnsaio {
    prova = 'prova',
    contraprova = 'contraprova',
    testemunha = 'testemunha'
}

export interface IEnsaio {
    idEnsaio: string | null;
    FK_idProtocolo: string;
    FK_idTipoEnsaio: string;
    papel: enumPapelEnsaio;
    descricao?: string;
    dataCad?: string;
    dataMod?: string;
}

export class Ensaio {
    private _idEnsaio: string | null = null;
    private _FK_idProtocolo!: string;
    private _FK_idTipoEnsaio!: string;
    private _papel!: enumPapelEnsaio;
    private _descricao?: string;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idEnsaio: string | null,
        FK_idProtocolo: string,
        FK_idTipoEnsaio: string,
        papel: enumPapelEnsaio,
        descricao?: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idEnsaio = idEnsaio;
        this.FK_idProtocolo = FK_idProtocolo;
        this.FK_idTipoEnsaio = FK_idTipoEnsaio;
        this.papel = papel;
        this._descricao = descricao;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idEnsaio() { return this._idEnsaio };
    get FK_idProtocolo() { return this._FK_idProtocolo };
    get FK_idTipoEnsaio() { return this._FK_idTipoEnsaio };
    get papel() { return this._papel };
    get descricao() { return this._descricao };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idEnsaio(value: string | null) {
        if (!value || value !== null && value?.length !== 36) {
            throw new Error('O idEnsaio está errado.');
        }
        this._idEnsaio = value;
        this.atualizarDataModificacao();
    }

    set FK_idProtocolo(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idProtocolo informado é inválido.');
        }
        this._FK_idProtocolo = value;
        this.atualizarDataModificacao();
    }

    set FK_idTipoEnsaio(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idTipoEnsaio informado é inválido.');
        }
        this._FK_idTipoEnsaio = value;
        this.atualizarDataModificacao();
    }

    set papel(value: enumPapelEnsaio) {
        if (!value || !Object.values(enumPapelEnsaio).includes(value)) {
            throw new Error('O papel do ensaio informado é inválido.');
        }
        this._papel = value;
        this.atualizarDataModificacao();
    }

    set descricao(value: string | undefined) {
        if (value && value.length > 3000) {
            throw new Error('A descrição do ensaio excede o tamanho máximo permitido.');
        }
        this._descricao = value;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    // Obs: não recebe FK_idAmostra — a ligação com as amostras é feita
    // via AMOSTRA_ENSAIO (N:N), o que permite um ensaio agrupar várias
    // amostras, inclusive repetidas.
    public static create(dados: any) {
        return new Ensaio(
            dados.idEnsaio ? dados.idEnsaio : String(uuid()),
            dados.FK_idProtocolo,
            dados.FK_idTipoEnsaio,
            dados.papel,
            dados.descricao,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: any) {
        return new Ensaio(
            id,
            dados.FK_idProtocolo,
            dados.FK_idTipoEnsaio,
            dados.papel,
            dados.descricao,
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
            idEnsaio: this._idEnsaio,
            FK_idProtocolo: this._FK_idProtocolo,
            FK_idTipoEnsaio: this._FK_idTipoEnsaio,
            papel: this._papel,
            descricao: this._descricao,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}
