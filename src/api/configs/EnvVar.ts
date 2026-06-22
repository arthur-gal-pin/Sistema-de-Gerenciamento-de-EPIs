import 'dotenv/config';
import { EnvKey } from '../enum/auth/EnvKey';

export class EnvVar {
    // Impede instanciação
    private constructor() { };

    // Obtem valor com string
    public static getString(chave: EnvKey): string {
        const valor = process.env[chave];
        if (valor === undefined) {
            throw new Error(`Variável ${chave} não definida no .env`);
        }
        return valor;
    }

    // Obtem valor com texto
    public static getNumber(chave: EnvKey): number {
        const valor = this.getString(chave);
        const parsed = Number(valor);

        if (isNaN(parsed)) {
            throw new Error(`Variável ${chave} deve ser um número válido`);
        }
        return parsed;
    }

    //Obtém valor como booleano
    public static getBoolean(key: EnvKey): boolean {
        const value = this.getString(key).toLowerCase();
        return ['true', '1', 'yes', 'on'].includes(value);
    }

    // ===== ACESSO DIRETO (opcional) =====
    public static get SERVER_PORT(): number {
        return this.getNumber(EnvKey.SERVER_PORT);
    }

    public static get DB_HOST(): string {
        return this.getString(EnvKey.DB_HOST);
    }

    public static get DB_USER(): string {
        return this.getString(EnvKey.DB_USER);
    }
    public static get DB_PASSWORD(): string {
        return this.getString(EnvKey.DB_PASSWORD);
    }
    public static get DB_PORT(): number {
        return this.getNumber(EnvKey.DB_PORT);
    }
    public static get DB_DATABASE(): string {
        return this.getString(EnvKey.DB_DATABASE);
    }
}