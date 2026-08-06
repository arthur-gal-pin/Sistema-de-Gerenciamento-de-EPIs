import {Router} from 'express';
const routes = Router();

import cargoRoutes from './funcionarios/cargo.routes';
import funcionarioRoutes from './funcionarios/funcionario.routes';
import telefoneRoutes from './funcionarios/telefone.routes';
import amostraRoutes from './amostras/amostra.routes';
import ocpRoutes from './amostras/ocp.routes';
import empresaRoutes from './amostras/empresa.routes';
import authRoutes from './funcionarios/login.routes';


routes.use('/cargos', cargoRoutes);
routes.use('/funcionarios', funcionarioRoutes);
routes.use('/telefones', telefoneRoutes);
routes.use('/amostras', amostraRoutes);
routes.use('/ocps', ocpRoutes);
routes.use('/empresas', empresaRoutes);
routes.use('', authRoutes);

export default routes;