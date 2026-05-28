<<<<<<< HEAD
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_DATABASE'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
    console.error("Variáveis de ambiente ausentes:", missingEnv);
    throw new Error("Faltando variáveis críticas no arquivo .env para o SQL Server.");
=======
import mssql from 'mssql'; // Adicionado 'mssql' aqui
import 'dotenv/config';

// Validação das variáveis de ambiente
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE) {
    throw new Error('Faltando variáveis críticas para o banco de dados SQL Server.');
>>>>>>> 43d9ad0d5469146314952e60044d80f702a9a0d0
}

class Database {
    private static instance: Database | null = null;
    private sequelize!: Sequelize;

    private constructor() {
        // Singleton
    }

    private connect() {
        try {
            this.sequelize = new Sequelize(
                process.env.DB_DATABASE!,
                process.env.DB_USER!,
                process.env.DB_PASSWORD!,
                {
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT) || 1433,
                    dialect: 'mssql', // Define o uso do SQL Server
                    logging: false,    // Defina como console.log para ver as queries
                    dialectOptions: {
                        options: {
                            encrypt: true, // Necessário para Azure/ambientes seguros
                            trustServerCertificate: true, // Comum em dev local
                            enableArithAbort: true
                        }
                    },
                    pool: {
                        max: 50,      // connectionLimit: 50
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    timezone: '+00:00' // Equivalente ao 'Z' (UTC)
                }
            );

            console.log("✅ Conexão Sequelize (SQL Server) configurada com sucesso.");
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

<<<<<<< HEAD
// Exporta a instância do Sequelize pronta para uso nos Mappings
export const sequelize = Database.getInstance().getSequelize();
=======
export const connectionPromise = Database.getInstance().then(db => db.getPool());
>>>>>>> 43d9ad0d5469146314952e60044d80f702a9a0d0
