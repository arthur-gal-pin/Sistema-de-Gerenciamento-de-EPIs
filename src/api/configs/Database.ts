import { PrismaClient, Prisma } from '../../../generated/prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';
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
    private prisma!: PrismaClient;

    private constructor() {
        // Singleton
    }

    private connect() {
        try {
            // Separar o host puro do nome da instância
            const envHost = process.env.DB_HOST || 'localhost';
            const [hostPuro, instanceName] = envHost.split('\\');

            const adapter = new PrismaMssql({
                server: hostPuro,
                port: Number(process.env.DB_PORT) || 1433,
                database: process.env.DB_DATABASE! || 'Sistema-de-Gerenciamento-de-EPIs-FUNDACENTRO',
                user: process.env.DB_USER! || 'Testers',
                password: process.env.DB_PASSWORD! || '1234567890',
                options: {
                    encrypt: true,
                    trustServerCertificate: true,
                    enableArithAbort: true,
                    instanceName: instanceName || undefined,
                }
            });

            this.prisma = new PrismaClient({ adapter });

            console.log("✅ Conexão Prisma (SQL Server) configurada com sucesso.");
        } catch (error) {
            console.error("❌ Erro ao configurar o Prisma:", error);
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

    public getPrisma(): PrismaClient {
        return this.prisma;
    }
}

export const prisma = Database.getInstance().getPrisma();
export { Prisma };
