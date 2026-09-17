import { uuid } from "uuidv4";

// Obs: reaproveita a mesma classificação de AMOSTRA (Peças/Filtros).
// Se já existir um enum equivalente no domínio de Amostra, o ideal é
// importar/reaproveitar aquele em vez de duplicar aqui.
export enum enumCategoriaAplicavel {
    pecas = 'pecas',
    filtros = 'filtros'
}

export interface ITipoEnsaio {
    idTipoEnsaio: string | null;
    nomeEnsaio: string;
    descricaoEnsaio?: string;
    categoriaAplicavel: enumCategoriaAplicavel;
    dataCad?: string;
    dataMod?: string;
}

export class TipoEnsaio {
    private _idTipoEnsaio: string | null = null;
    private _nomeEnsaio!: string;
    private _descricaoEnsaio?: string;
    private _categoriaAplicavel!: enumCategoriaAplicavel;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idTipoEnsaio: string | null,
        nomeEnsaio: string,
        categoriaAplicavel: enumCategoriaAplicavel,
        descricaoEnsaio?: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idTipoEnsaio = idTipoEnsaio;
        this.nomeEnsaio = nomeEnsaio;
        this.categoriaAplicavel = categoriaAplicavel;
        this._descricaoEnsaio = descricaoEnsaio;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idTipoEnsaio() { return this._idTipoEnsaio };
    get nomeEnsaio() { return this._nomeEnsaio };
    get descricaoEnsaio() { return this._descricaoEnsaio };
    get categoriaAplicavel() { return this._categoriaAplicavel };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idTipoEnsaio(value: string | null) {
        if (!value || value !== null && value?.length !== 36) {
            throw new Error('O idTipoEnsaio está errado.');
        }
        this._idTipoEnsaio = value;
        this.atualizarDataModificacao();
    }

    set nomeEnsaio(value: string) {
        if (!value || value.length < 3 || value.length > 255) {
            throw new Error('Esse nome de ensaio é inválido.');
        }
        this._nomeEnsaio = value;
        this.atualizarDataModificacao();
    }

    set descricaoEnsaio(value: string | undefined) {
        if (value && value.length > 1000) {
            throw new Error('A descrição do ensaio excede o tamanho máximo permitido.');
        }
        this._descricaoEnsaio = value;
        this.atualizarDataModificacao();
    }

    set categoriaAplicavel(value: enumCategoriaAplicavel) {
        if (!value || !Object.values(enumCategoriaAplicavel).includes(value)) {
            throw new Error('A categoria aplicável informada é inválida.');
        }
        this._categoriaAplicavel = value;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new TipoEnsaio(
            dados.idTipoEnsaio ? dados.idTipoEnsaio : String(uuid()),
            dados.nomeEnsaio,
            dados.categoriaAplicavel,
            dados.descricaoEnsaio,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: any) {
        return new TipoEnsaio(
            id,
            dados.nomeEnsaio,
            dados.categoriaAplicavel,
            dados.descricaoEnsaio,
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
            idTipoEnsaio: this._idTipoEnsaio,
            nomeEnsaio: this._nomeEnsaio,
            descricaoEnsaio: this._descricaoEnsaio,
            categoriaAplicavel: this._categoriaAplicavel,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}
