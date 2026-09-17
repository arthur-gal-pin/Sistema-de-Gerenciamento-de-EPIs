import { uuid } from "uuidv4";
import { enumNivelPermissao } from "../../enum/funcionarios/nivelPermissao.enum";

export interface ICargo {
    idCargo: string | null; 
    nomeCargo: string;
    nivelPermissao: enumNivelPermissao;
    dataCad?: string;
    dataMod?: string;
}

export default class Cargo {
    private _idCargo: string | null; //UUID
    private _nomeCargo: string;
    private _nivelPermissao: enumNivelPermissao;
    private _dataCad?: string ;
    private _dataMod?: string;

    constructor(idCargo: string | null, nomeCargo: string, nivelPermissao: enumNivelPermissao, dataCad?: string, dataMod?: string) {
        this._idCargo = idCargo || null;
        this._nomeCargo = nomeCargo;
        this._nivelPermissao = nivelPermissao;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idCargo() { return this._idCargo };
    get nomeCargo() { return this._nomeCargo };
    get nivelPermissao() { return this._nivelPermissao };
    get dataCad() { return this._dataCad };
    get dataMod() { return this._dataMod };

    // --- SETTERS ---
    set nomeCargo(nome: string) {
        this.validarNomeCargo(nome);
        this._nomeCargo = nome;
    }

    set nivelPermissao(nivel: enumNivelPermissao) {
        this._nivelPermissao = nivel;
    }

    // --- VALIDATION METHODS ---
    private validarNomeCargo(value: string) {
        if (value.trim().length < 4 || value.trim().length > 25) {
            throw new Error('O nome do Cargo está inválido. Seu tamanho deve ser maior de 4 caracteres e menor que 25.')
        };
    }

    // --- FACTORY METHODS ---

    public static create(dados: ICargo): Cargo {

        return new Cargo(
            dados.idCargo ? dados.idCargo : String(uuid()),
            dados.nomeCargo,
            dados.nivelPermissao as enumNivelPermissao,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: ICargo): Cargo {

        return new Cargo(
            id,
            dados.nomeCargo,
            dados.nivelPermissao as enumNivelPermissao,
            dados.dataCad,
            String(new Date().toISOString())
        )
    }


    public toJSON() {
        return {
            idCargo: this._idCargo,
            nomeCargo: this._nomeCargo,
            nivelPermissao: this._nivelPermissao,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}