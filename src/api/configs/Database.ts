import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

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
            // Se DB_HOST for "ECFP512N1322610\INSTANCIAARTHUR", o hostPuro será "ECFP512N1322610"
            const envHost = process.env.DB_HOST || 'localhost';
            const [hostPuro, instanceName] = envHost.split('\\');
            console.log('azul')

            this.sequelize = new Sequelize(
                process.env.DB_DATABASE! || 'Sistema-de-Gerenciamento-de-EPIs-FUNDACENTRO',
                process.env.DB_USER! || "Testers",
                process.env.DB_PASSWORD! || "1234567890",
                {
                    host: hostPuro, // Ex: "ECFP512N1322610" ou "localhost"
                    port: Number(process.env.DB_PORT) || 1433,
                    dialect: 'mssql',
                    logging: true,
                    dialectOptions: {
                        options: {
                            encrypt: true,
                            trustServerCertificate: true,
                            enableArithAbort: true,
                            // SE houver uma instância nomeada (depois da \), o mssql precisa saber dela aqui:
                            instanceName: instanceName || undefined,
                            //serverName: 'localhost'
                        }
                    },
                    pool: {
                        max: 50,
                        min: 0,
                        acquire: 30000,
                        idle: 10000
                    },
                    timezone: '+00:00'
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

// Exporta a instância do Sequelize pronta para uso nos Mappings
export const sequelize = Database.getInstance().getSequelize();
