import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { sequelize } from './configs/Database';
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
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');

        await sequelize.sync({ force: false, alter: false });
        console.log('🗄️ Modelos sincronizados com o banco de dados.');

        // Inicia o servidor Express apenas se o banco conectou com sucesso
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
        });

    } catch (error) {
        console.error('❌ Erro crítico ao iniciar o servidor:', error);
        process.exit(1); // Fecha a aplicação caso não consiga conectar ao banco
    }
}

// Executa a função de inicialização
startServer();