import {Router} from 'express';
const routes = Router();

import cargoRoutes from './funcionarios/cargo.routes';
import funcionarioRoutes from './funcionarios/funcionario.routes';
import telefoneRoutes from './funcionarios/telefone.routes';


routes.use('/cargos', cargoRoutes);
routes.use('/funcionarios', funcionarioRoutes);
routes.use('/telefones', telefoneRoutes);

export default routes;