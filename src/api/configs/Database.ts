import { Sequelize } from 'sequelize-typescript'; 
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
    console.error("Variáveis de ambiente ausentes:", missingEnv);
    throw new Error("Faltando variáveis críticas no arquivo .env para o SQL Server.");
}

class Database {
    private static instance: Database | null = null;
    private sequelize!: Sequelize;

    private constructor() {
        // Singleton
    }

    private connect() {
        try {
            // Separar o host puro do nome da instância
            const envHost = process.env.DB_HOST || 'localhost';
            const [hostPuro, instanceName] = envHost.split('\\');

            this.sequelize = new Sequelize({
                database: process.env.DB_DATABASE! || 'Sistema-de-Gerenciamento-de-EPIs-FUNDACENTRO',
                username: process.env.DB_USER! || "Testers",
                password: process.env.DB_PASSWORD! || "1234567890",
                host: hostPuro, 
                port: Number(process.env.DB_PORT) || 1433,
                dialect: 'mssql',
                logging: false,
                dialectOptions: {
                    options: {
                        encrypt: true,
                        trustServerCertificate: true,
                        enableArithAbort: true,
                        instanceName: instanceName || undefined,
                    }
                },
                pool: {
                    max: 50,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },

                
                models: [path.join(__dirname, '../mappings/**/*.map.ts'), path.join(__dirname, '../../models/**/*.map.js')],
                
            });

            console.log("✅ Conexão Sequelize-Typescript (SQL Server) configurada com sucesso.");
        } catch (error) {
            console.error("❌ Erro ao configurar o Sequelize:", error);
            throw error;
        }
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
            Database.instance.connect();
        }
        return Database.instance;
    }

    public getSequelize(): Sequelize {
        return this.sequelize;
    }
}

export const sequelize = Database.getInstance().getSequelize();