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
    private _idTelefone: string | null;
    private _idFuncionario: string;
    private _numeroTelefone: string;
    private _tipoNumero: enumTipoTelefone;
    private _dataCad?: string | null;
    private _dataMod?: string | null;

    constructor(
        idTelefone: string | null,
        idFuncionario: string,
        numeroTelefone: string,
        tipoNumero: enumTipoTelefone,
        dataCad?: string,
        dataMod?: string
    ) {
        this._idTelefone = idTelefone || null;
        this._idFuncionario = idFuncionario;
        this._numeroTelefone = numeroTelefone;
        this._tipoNumero = tipoNumero;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idTelefone() { return this._idTelefone; }
    get idFuncionario() { return this._idFuncionario; }
    get numeroTelefone() { return this._numeroTelefone; }
    get tipoNumero() { return this._tipoNumero; }
    get dataCad() { return this._dataCad; }
    get dataMod() { return this._dataMod; }

    // --- SETTERS ---
    set idFuncionario(id: string) {
        this._idFuncionario = id;
    }

    set numeroTelefone(numero: string) {
        this.validarTelefone(numero);
        this._numeroTelefone = numero;
    }

    set tipoNumero(tipo: enumTipoTelefone) {
        this._tipoNumero = tipo;
    }

    // --- VALIDATION METHODS ---
    private validarTelefone(valor: string) {
        // Remove caracteres não numéricos para validar apenas a extensão
        const apenasNumeros = valor.replace(/\D/g, '');
        if (apenasNumeros.length < 10 || apenasNumeros.length > 11) {
            throw new Error('O número de telefone está inválido. Deve conter entre 10 e 11 dígitos (incluindo DDD).');
        }
    }

    // --- FACTORY METHODS ---
    public static create(dados: ITelefone): Telefone {
        return new Telefone(
            dados.idTelefone ? dados.idTelefone : uuid(),
            dados.FK_idFuncionario,
            dados.numeroTelefone,
            dados.tipoTelefone as enumTipoTelefone,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: ITelefone): Telefone {
        return new Telefone(
            id,
            dados.FK_idFuncionario,
            dados.numeroTelefone,
            dados.tipoTelefone as enumTipoTelefone,
            dados.dataCad,
            dados.dataMod
        );
    }

    public toJSON() {
        return {
            idTelefone: this._idTelefone,
            idFuncionario: this._idFuncionario,
            numeroTelefone: this._numeroTelefone,
            tipoNumero: this._tipoNumero,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}