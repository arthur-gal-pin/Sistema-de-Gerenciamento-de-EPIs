import {Router} from 'express';
const routes = Router();

import cargoRoutes from './funcionarios/cargo.routes';
import funcionarioRoutes from './funcionarios/funcionario.routes';
import telefoneRoutes from './funcionarios/telefone.routes';
import amostraRoutes from './amostras/amostra.routes';
import ocpRoutes from './amostras/ocp.routes';
import empresaRoutes from './amostras/empresa.routes';


routes.use('/cargos', cargoRoutes);
routes.use('/funcionarios', funcionarioRoutes);
routes.use('/telefones', telefoneRoutes);
routes.use('/amostras', amostraRoutes);
routes.use('/ocp', ocpRoutes);
routes.use('/empresa', empresaRoutes);

export default routes;