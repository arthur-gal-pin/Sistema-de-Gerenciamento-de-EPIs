import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { prisma } from './configs/Database';
import authRoutes from './routes/funcionarios/login.routes';
import routes from './routes/routes';

const app = express();
const PORT = process.env.PORT || 3300;

// --- MIDDLEWARES ---
app.use(express.json()); // Permite que a controller receba JSON no req.body

// --- ROTAS ---
app.use('/auth', authRoutes);
app.use('/', routes);

// --- INICIALIZAÇÃO DO BANCO E SERVIDOR ---
async function startServer() {
    try {
        console.log('🔄 Conectando ao banco de dados...');

        // Testa a conexão com o banco
        await prisma.$connect();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

        // Obs: com Prisma, a sincronização de schema (equivalente ao antigo
        // sequelize.sync()) é feita via CLI, fora do runtime:
        //   npx prisma migrate dev   (gera/aplica migrations versionadas)
        //   npx prisma db push       (sincroniza o schema sem migration)

        // Inicia o servidor Express apenas se o banco conectou com sucesso
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Erro crítico ao iniciar o servidor:', error);
        process.exit(1); // Fecha a aplicação caso não consiga conectar ao banco
    }
}

// Encerramento gracioso da conexão com o banco
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

// Executa a função de inicialização
startServer();
