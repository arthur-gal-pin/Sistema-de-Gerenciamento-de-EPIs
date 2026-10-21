import { uuid } from "uuidv4";

export interface IAmostraEnsaio {
    idAmostraEnsaio: string | null;
    FK_idAmostra: string;
    FK_idEnsaio: string;
    FK_idInstrumento: string;
    temperatura: number;
    umidade: number;
    pressao?: number;
    dataCad?: string;
    dataMod?: string;
}

export class AmostraEnsaio {
    private _idAmostraEnsaio: string | null = null;
    private _FK_idAmostra!: string;
    private _FK_idEnsaio!: string;
    private _FK_idInstrumento!: string;
    private _temperatura!: number;
    private _umidade!: number;
    private _pressao?: number;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idAmostraEnsaio: string | null,
        FK_idAmostra: string,
        FK_idEnsaio: string,
        FK_idInstrumento: string,
        temperatura: number,
        umidade: number,
        pressao?: number,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idAmostraEnsaio = idAmostraEnsaio;
        this.FK_idAmostra = FK_idAmostra;
        this.FK_idEnsaio = FK_idEnsaio;
        this.FK_idInstrumento = FK_idInstrumento;
        this.temperatura = temperatura;
        this.umidade = umidade;
        this.pressao = pressao;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idAmostraEnsaio() { return this._idAmostraEnsaio };
    get FK_idAmostra() { return this._FK_idAmostra };
    get FK_idEnsaio() { return this._FK_idEnsaio };
    get FK_idInstrumento() { return this._FK_idInstrumento };
    get temperatura() { return this._temperatura };
    get umidade() { return this._umidade };
    get pressao() { return this._pressao };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idAmostraEnsaio(value: string | null) {
        if (!value || value !== null && value?.length !== 36) {
            throw new Error('O idAmostraEnsaio está errado.');
        }
        this._idAmostraEnsaio = value;
        this.atualizarDataModificacao();
    }

    // Cada linha desta tabela é UMA execução específica (esta amostra,
    // neste ensaio) — é o que permite a mesma amostra aparecer mais de
    // uma vez no mesmo ensaio (repetição), cada ocorrência com seus
    // próprios dados e resultados.
    set FK_idAmostra(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idAmostra informado é inválido.');
        }
        this._FK_idAmostra = value;
        this.atualizarDataModificacao();
    }

    set FK_idEnsaio(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idEnsaio informado é inválido.');
        }
        this._FK_idEnsaio = value;
        this.atualizarDataModificacao();
    }

    set FK_idInstrumento(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idInstrumento informado é inválido.');
        }
        this._FK_idInstrumento = value;
        this.atualizarDataModificacao();
    }

    set temperatura(value: number) {
        if (value === undefined || value === null || isNaN(value)) {
            throw new Error('A temperatura informada é inválida.');
        }
        this._temperatura = value;
        this.atualizarDataModificacao();
    }

    set umidade(value: number) {
        if (value === undefined || value === null || isNaN(value)) {
            throw new Error('A umidade informada é inválida.');
        }
        this._umidade = value;
        this.atualizarDataModificacao();
    }

    // Pressão é opcional: nem todo ensaio exige essa condição ambiental
    // (ex.: os ensaios de pulmão mecânico e exalação não pedem pressão).
    set pressao(value: number | undefined) {
        if (value !== undefined && value !== null && isNaN(value)) {
            throw new Error('A pressão informada é inválida.');
        }
        this._pressao = value;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new AmostraEnsaio(
            dados.idAmostraEnsaio ? dados.idAmostraEnsaio : String(uuid()),
            dados.FK_idAmostra,
            dados.FK_idEnsaio,
            dados.FK_idInstrumento,
            dados.temperatura,
            dados.umidade,
            dados.pressao,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: any) {
        return new AmostraEnsaio(
            id,
            dados.FK_idAmostra,
            dados.FK_idEnsaio,
            dados.FK_idInstrumento,
            dados.temperatura,
            dados.umidade,
            dados.pressao,
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
            idAmostraEnsaio: this._idAmostraEnsaio,
            FK_idAmostra: this._FK_idAmostra,
            FK_idEnsaio: this._FK_idEnsaio,
            FK_idInstrumento: this._FK_idInstrumento,
            temperatura: this._temperatura,
            umidade: this._umidade,
            pressao: this._pressao,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}
