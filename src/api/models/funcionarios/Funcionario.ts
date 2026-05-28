import { uuid } from "uuidv4";
import { enumSituacaoEmpregaticia } from "../../enum/funcionarios/situacaoEmpregaticia";

export interface IFuncionario {
    idFuncionario: string | null;
    FK_idCargo: string;
    nomeFuncionario: string;
    sobrenomeFuncionario: string;
    cpf: string;
    email: string;
    senhaHash: string;
    situacaoEmpregaticia: enumSituacaoEmpregaticia;
    caminhoImagemPerfil?: string;
    dataCad?: string;
    dataMod?: string;
}

export default class Funcionario {
    private _idFuncionario: string | null;
    private _idCargo!: string;
    private _nomeFuncionario!: string;
    private _sobrenomeFuncionario!: string;
    private _cpf!: string;
    private _email!: string;
    private _senhaHash!: string;
    private _situacaoEmpregaticia!: enumSituacaoEmpregaticia;
    private _caminhoImagemPerfil: string | undefined;
    private _dataCad: string;
    private _dataMod: string;

    constructor(
        idFuncionario: string | null,
        idCargo: string,
        nomeFuncionario: string,
        sobrenomeFuncionario: string,
        cpf: string,
        email: string,
        senhaHash: string,
        situacaoEmpregaticia: enumSituacaoEmpregaticia,
        caminhoImagemPerfil?: string,
        dataCad?: string,
        dataMod?: string
    ) {
        this._idFuncionario = idFuncionario || null;
        this.idCargo = idCargo;
        this.nomeFuncionario = nomeFuncionario;
        this.sobrenomeFuncionario = sobrenomeFuncionario;
        this.cpf = cpf;
        this.email = email;
        this.senhaHash = senhaHash;
        this.situacaoEmpregaticia = situacaoEmpregaticia;
        this._caminhoImagemPerfil = caminhoImagemPerfil;
        this._dataCad = dataCad || new Date().toISOString();
        this._dataMod = dataMod || new Date().toISOString();
    }

    // --- GETTERS ---
    get idFuncionario() { return this._idFuncionario; }
    get idCargo() { return this._idCargo; }
    get nomeFuncionario() { return this._nomeFuncionario; }
    get sobrenomeFuncionario() { return this._sobrenomeFuncionario; }
    get cpf() { return this._cpf; }
    get email() { return this._email; }
    get senhaHash() { return this._senhaHash; }
    get situacaoEmpregaticia() { return this._situacaoEmpregaticia; }
    get caminhoImagemPerfil() { return this._caminhoImagemPerfil ?? '' }
    get dataCad() { return this._dataCad; }
    get dataMod() { return this._dataMod; }

    // --- SETTERS ---
    set idCargo(id: string) { this._idCargo = id; }

    set nomeFuncionario(nome: string) {
        this.validarTexto(nome, "Nome", 2, 50);
        this._nomeFuncionario = nome;
    }

    set sobrenomeFuncionario(sobrenome: string) {
        this.validarTexto(sobrenome, "Sobrenome", 2, 200);
        this._sobrenomeFuncionario = sobrenome;
    }

    set cpf(valor: string) {
        const validacao: boolean = this.validarCpf(valor);
        if(!validacao) {
            throw new Error(`O CPF inserido é inválido.`);
        }
        this._cpf = valor;
    }

    set email(valor: string) {
        this.validarEmail(valor);
        this._email = valor;
    }

    set senhaHash(hash: string) { this._senhaHash = hash; }

    set caminhoImagemPerfil(caminho: string) { this._caminhoImagemPerfil = caminho; }

    set situacaoEmpregaticia(situacao: enumSituacaoEmpregaticia) {
        this._situacaoEmpregaticia = situacao;
    }

    // --- VALIDATION METHODS ---
    private validarTexto(valor: string, campo: string, min: number, max: number) {
        if (valor.trim().length < min || valor.trim().length > max) {
            throw new Error(`O ${campo} está inválido. Deve ter entre ${min} e ${max} caracteres.`);
        }
    }

    private validarCpf(cpf: string) {
        // 1. Remove caracteres não numéricos
        cpf = cpf.replace(/[^\d]+/g, '');

        // 2. Verifica se tem 11 dígitos ou se é uma sequência de números iguais
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        // 3. Validação do 1º dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digito1 = resto === 10 || resto === 11 ? 0 : resto;

        if (digito1 !== parseInt(cpf.charAt(9))) {
            return false;
        }

        // 4. Validação do 2º dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digito2 = resto === 10 || resto === 11 ? 0 : resto;

        if (digito2 !== parseInt(cpf.charAt(10))) {
            return false;
        }

        return true;
    }

    private validarEmail(email: string) {
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(email)) {
            throw new Error('O email inserido é inválido.');
        }
    }

    // --- FACTORY METHODS ---
    public static create(dados: IFuncionario): Funcionario {
        return new Funcionario(
            dados.idFuncionario ? dados.idFuncionario : uuid(),
            dados.FK_idCargo,
            dados.nomeFuncionario,
            dados.sobrenomeFuncionario,
            dados.cpf,
            dados.email,
            dados.senhaHash,
            dados.situacaoEmpregaticia as enumSituacaoEmpregaticia,
            dados.caminhoImagemPerfil,
            dados.dataCad,
            dados.dataMod
        );
    }

    public static edit(id: string, dados: IFuncionario): Funcionario {
        return new Funcionario(
            id,
            dados.FK_idCargo,
            dados.nomeFuncionario,
            dados.sobrenomeFuncionario,
            dados.cpf,
            dados.email,
            dados.senhaHash,
            dados.situacaoEmpregaticia as enumSituacaoEmpregaticia,
            dados.caminhoImagemPerfil,
            dados.dataCad,
            new Date().toISOString()
        );
    }

    public toJSON() {
        return {
            idFuncionario: this._idFuncionario,
            FK_idCargo: this._idCargo,
            nomeFuncionario: this._nomeFuncionario,
            sobrenomeFuncionario: this._sobrenomeFuncionario,
            cpf: this._cpf,
            email: this._email,
            senhaHash: this._senhaHash,
            caminhoImagemPerfil: this._caminhoImagemPerfil,
            situacaoEmpregaticia: this._situacaoEmpregaticia,
            dataCad: this._dataCad,
            dataMod: this._dataMod
        };
    }
}