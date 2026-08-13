import { PrismaClient, Prisma } from '../../generated/prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
    'DB_HOST',
    'DB_USER',
    'DB_PASSWORD',
    'DB_DATABASE'
];

const missingEnv = requiredEnv.filter(
    key => !process.env[key]
);

if (missingEnv.length > 0) {
    console.error(
        'Variáveis de ambiente ausentes:',
        missingEnv
    );

    throw new Error(
        'Faltando variáveis críticas no arquivo .env para o SQL Server.'
    );
}

class Database {
    private static instance: Database | null = null;
    private prisma!: PrismaClient;

    private constructor() {}

    private connect(): void {
        try {
            const envHost = process.env.DB_HOST!;

            // Permite:
            // localhost
            // localhost\SQLEXPRESS
            const [host, instanceName] = envHost.split('\\');

            const adapter = new PrismaMssql({
                server: host,
                port: Number(process.env.DB_PORT ?? 1433),

                database: process.env.DB_DATABASE!,
                user: process.env.DB_USER!,
                password: process.env.DB_PASSWORD!,

                options: {
                    encrypt: true,
                    trustServerCertificate: true,
                    enableArithAbort: true,
                    instanceName: instanceName || undefined,
                },
            });

            this.prisma = new PrismaClient({
                adapter,
            });

            console.log(
                '✅ Conexão Prisma (SQL Server) configurada com sucesso.'
            );
        } catch (error) {
            console.error(
                '❌ Erro ao configurar o Prisma:',
                error
            );

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

export const prisma =
    Database.getInstance().getPrisma();

export { Prisma };