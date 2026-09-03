import { uuid } from "uuidv4";
import { enumTipoTelefone } from "../../enum/funcionarios/tipoTelefone";

export interface ITelefone {
    idTelefone: string | null;
    FK_idFuncionario: string;
    numeroTelefone: string;
    tipoTelefone: enumTipoTelefone;
    dataCad?: string;
    dataMod?: string;
}

export default class Telefone {
    private _idTelefone!: string | null;
    private _idFuncionario!: string;
    private _numeroTelefone!: string;
    private _tipoTelefone!: enumTipoTelefone;
    private _dataCad?: string | null;
    private _dataMod?: string | null;

    constructor(
        idTelefone: string | null = null,
        idFuncionario: string,
        numeroTelefone: string,
        tipoTelefone: enumTipoTelefone,
        dataCad?: string,
        dataMod?: string
    ) {
        this.idTelefone = idTelefone;
        this.idFuncionario = idFuncionario;
        this.numeroTelefone = numeroTelefone;
        this.tipoTelefone = this.tipoTelefone;

        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idTelefone() { return this._idTelefone; }
    get idFuncionario() { return this._idFuncionario; }
    get numeroTelefone() { return this._numeroTelefone; }
    get tipoNumero() { return this._tipoTelefone; }
    get dataCad() { return this._dataCad; }
    get dataMod() { return this._dataMod; }

    // --- SETTERS ---
    set idTelefone(id: string | null) {
        this._idTelefone = id || null;
    }

    set idFuncionario(id: string) {
        this._idFuncionario = id;
        this.atualizarDataModificacao();
    }

    set numeroTelefone(numero: string) {
        this.validarTelefone(numero);
        this._numeroTelefone = numero;
        this.atualizarDataModificacao();
    }

    set tipoTelefone(tipo: enumTipoTelefone) {
        this.validarTipoTelefone(tipo);
        this._tipoTelefone = tipo;
        this.atualizarDataModificacao();
    }

    // --- MÉTODOS DE VALIDAÇÃO ---
    private validarTelefone(valor: string): void {
        if (!valor || typeof valor !== 'string') {
            throw new Error('O número de telefone é obrigatório.');
        }

        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length < 10 || apenasNumeros.length > 11) {
            throw new Error('O número de telefone está inválido. Deve conter entre 10 e 11 dígitos (incluindo DDD).');
        }
    }

    private validarTipoTelefone(tipo: enumTipoTelefone): void {
        const tiposValidos = Object.values(enumTipoTelefone);
        if (!tiposValidos.includes(tipo)) {
            throw new Error('Tipo de telefone inválido.');
        }
    }

    // --- MÉTODOS DE FÁBRICA ---

    public static create(dados: Partial<ITelefone>): Telefone {
        return new Telefone(
            dados.idTelefone ? dados.idTelefone : uuid(),
            dados.FK_idFuncionario!,
            dados.numeroTelefone!,
            dados.tipoTelefone as enumTipoTelefone,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: Partial<ITelefone>): Telefone {
        return new Telefone(
            id,
            dados.FK_idFuncionario!,
            dados.numeroTelefone!,
            dados.tipoTelefone as enumTipoTelefone,
            dados.dataCad,
            dados.dataMod
        );
    }

    //---MÉTODOS AUXILIARES----

    private atualizarDataModificacao(): void {
        if (this._dataCad) { // Só atualiza se a instância já concluiu o construtor
            this._dataMod = new Date().toISOString();
        }
    }

    public toJSON() {
        return {
            idTelefone: this._idTelefone,
            idFuncionario: this._idFuncionario,
            numeroTelefone: this._numeroTelefone,
            tipoTelefone: this._tipoTelefone,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}