import { uuid } from "uuidv4";
import { enumTipoDadoCampo } from "../../../enum/ensaios/tipoDado.enum";


export interface ICampoEnsaio {
    idCampoEnsaio: string | null;
    FK_idTipoEnsaio: string;
    nomeCampo: string;
    descricao?: string;
    obrigatoriedade: boolean;
    unidadeMedida: string;
    tipoDado: enumTipoDadoCampo;
    dataCad?: string;
    dataMod?: string;
}

export class CampoEnsaio {
    private _idCampoEnsaio: string | null = null;
    private _FK_idTipoEnsaio!: string;
    private _nomeCampo!: string;
    private _descricao?: string;
    private _obrigatoriedade!: boolean;
    private _unidadeMedida!: string;
    private _tipoDado!: enumTipoDadoCampo;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idCampoEnsaio: string | null,
        FK_idTipoEnsaio: string,
        nomeCampo: string,
        obrigatoriedade: boolean,
        tipoDado: enumTipoDadoCampo,
        unidadeMedida: string,
        descricaoCampo?: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idCampoEnsaio = idCampoEnsaio;
        this.FK_idTipoEnsaio = FK_idTipoEnsaio;
        this.nomeCampo = nomeCampo;
        this.obrigatoriedade = obrigatoriedade ?? true;
        this.tipoDado = tipoDado;
        this._descricao = descricaoCampo;
        this.unidadeMedida = unidadeMedida;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idCampoEnsaio() { return this._idCampoEnsaio };
    get FK_idTipoEnsaio() { return this._FK_idTipoEnsaio };
    get nomeCampo() { return this._nomeCampo };
    get descricaoCampo() { return this._descricao };
    get obrigatoriedade() { return this._obrigatoriedade };
    get unidadeMedida() { return this._unidadeMedida };
    get tipoDado() { return this._tipoDado };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idCampoEnsaio(value: string | null) {
        if (!value || value !== null && value?.length !== 36) {
            throw new Error('O idCampoEnsaio está errado.');
        }
        this._idCampoEnsaio = value;
        this.atualizarDataModificacao();
    }

    set FK_idTipoEnsaio(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idTipoEnsaio informado é inválido.');
        }
        this._FK_idTipoEnsaio = value;
        this.atualizarDataModificacao();
    }

    set nomeCampo(value: string) {
        if (!value || value.length < 2 || value.length > 255) {
            throw new Error('Esse nome de campo é inválido.');
        }
        this._nomeCampo = value;
        this.atualizarDataModificacao();
    }

    set descricao(value: string | undefined) {
        if (value && value.length > 1000) {
            throw new Error('A descrição do campo excede o tamanho máximo permitido.');
        }
        this._descricao = value;
        this.atualizarDataModificacao();
    }

    set obrigatoriedade(value: boolean) {
        if (typeof value !== 'boolean') {
            throw new Error('A obrigatoriedade do campo deve ser verdadeira ou falsa.');
        }
        this._obrigatoriedade = value ? value : true;
        this.atualizarDataModificacao();
    }

    set unidadeMedida(value: string) {
        if (value && value.length > 10) {
            throw new Error('A unidade de medida excede o tamanho máximo permitido (10 caracteres).');
        }
        this._unidadeMedida = value;
        this.atualizarDataModificacao();
    }

    set tipoDado(value: enumTipoDadoCampo) {
        if (!value || !Object.values(enumTipoDadoCampo).includes(value)) {
            throw new Error('O tipo de dado informado para o campo é inválido.');
        }
        this._tipoDado = value;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new CampoEnsaio(
            dados.idCampoEnsaio ? dados.idCampoEnsaio : String(uuid()),
            dados.FK_idTipoEnsaio,
            dados.nomeCampo,
            dados.obrigatoriedade,
            dados.tipoDado,
            dados.descricaoCampo,
            dados.unidadeMedida,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: any) {
        return new CampoEnsaio(
            id,
            dados.FK_idTipoEnsaio,
            dados.nomeCampo,
            dados.obrigatoriedade,
            dados.tipoDado,
            dados.descricaoCampo,
            dados.unidadeMedida,
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
            idCampoEnsaio: this._idCampoEnsaio,
            FK_idTipoEnsaio: this._FK_idTipoEnsaio,
            nomeCampo: this._nomeCampo,
            descricaoCampo: this._descricao,
            obrigatoriedade: this._obrigatoriedade,
            unidadeMedida: this._unidadeMedida,
            tipoDado: this._tipoDado,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}
