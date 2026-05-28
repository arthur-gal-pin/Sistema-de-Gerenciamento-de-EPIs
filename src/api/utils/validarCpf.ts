export function validarCpf(cpf: string) {
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

export function limparCpf(cpf: string) {
    const cpfLimpo = cpf.replace(/[^\d]+/g, '');
    return cpfLimpo;
}