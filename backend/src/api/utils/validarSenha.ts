export default function validarSenha(senha: string) {
    if (senha.length < 8) {
            throw new Error("A senha deve ter pelo menos 8 caracteres.");
        }

        if (!/[A-Z]/.test(senha)) {
            throw new Error("A senha deve conter pelo menos uma letra maiúscula.");
        }

        if (!/[a-z]/.test(senha)) {
            throw new Error("A senha deve conter pelo menos uma letra minúscula.");
        }

        if (!/[0-9]/.test(senha)) {
            throw new Error("A senha deve conter pelo menos um número.");
        }

        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha)) {
            throw new Error("A senha deve conter pelo menos um caractere especial.");
        }

        return true;
    }