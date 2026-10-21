import { uuid } from "uuidv4";

export interface IFuncionarioEnsaio {
    idFuncionarioEnsaio: string | null;
    FK_idFuncionario: string;
    FK_idEnsaio: string;
    dataCad?: string;
    dataMod?: string;
}

export class FuncionarioEnsaio {
    private _idFuncionarioEnsaio: string | null = null;
    private _FK_idFuncionario!: string;
    private _FK_idEnsaio!: string;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idFuncionarioEnsaio: string | null,
        FK_idFuncionario: string,
        FK_idEnsaio: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idFuncionarioEnsaio = idFuncionarioEnsaio;
        this.FK_idFuncionario = FK_idFuncionario;
        this.FK_idEnsaio = FK_idEnsaio;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idFuncionarioEnsaio() { return this._idFuncionarioEnsaio };
    get FK_idFuncionario() { return this._FK_idFuncionario };
    get FK_idEnsaio() { return this._FK_idEnsaio };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set idFuncionarioEnsaio(value: string | null) {
        if (!value || value !== null && value?.length !== 36) {
            throw new Error('O idFuncionarioEnsaio está errado.');
        }
        this._idFuncionarioEnsaio = value;
        this.atualizarDataModificacao();
    }

    // Permite registrar mais de um executor por ensaio (a tabela é N:N),
    // uma linha por par funcionário/ensaio.
    set FK_idFuncionario(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idFuncionario informado é inválido.');
        }
        this._FK_idFuncionario = value;
        this.atualizarDataModificacao();
    }

    set FK_idEnsaio(value: string) {
        if (!value || value.length !== 36) {
            throw new Error('O FK_idEnsaio informado é inválido.');
        }
        this._FK_idEnsaio = value;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE FÁBRICA ---
    public static create(dados: any) {
        return new FuncionarioEnsaio(
            dados.idFuncionarioEnsaio ? dados.idFuncionarioEnsaio : String(uuid()),
            dados.FK_idFuncionario,
            dados.FK_idEnsaio,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: any) {
        return new FuncionarioEnsaio(
            id,
            dados.FK_idFuncionario,
            dados.FK_idEnsaio,
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
            idFuncionarioEnsaio: this._idFuncionarioEnsaio,
            FK_idFuncionario: this._FK_idFuncionario,
            FK_idEnsaio: this._FK_idEnsaio,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}
