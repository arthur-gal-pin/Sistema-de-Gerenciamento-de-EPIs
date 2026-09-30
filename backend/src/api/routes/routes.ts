import { Router } from 'express';
const routes = Router();

import cargoRoutes from './funcionarios/cargo.routes';
import funcionarioRoutes from './funcionarios/funcionario.routes';
import telefoneRoutes from './funcionarios/telefone.routes';
import amostraRoutes from './amostras/amostra.routes';
import ocpRoutes from './amostras/ocp.routes';
import empresaRoutes from './amostras/empresa.routes';
import protocoloRoutes from './ensaios/protocolo.routes';
import instrumentoRoutes from './ensaios/dados/instrumento.routes';
import profileActionsRoutes from './funcionarios/profileActions.routes';
import authRoutes from './funcionarios/login.routes';
import tipoEnsaioRoutes from './ensaios/dados/tipoEnsaio.routes';
import campoEnsaioRoutes from './ensaios/dados/campoEnsaio.routes';
import funcionarioEnsaioRoutes from './ensaios/relacionamentos/funcionarioEnsaio.routes';
import amostraEnsaioRoutes from './ensaios/relacionamentos/amostraEnsaio.routes';
import dadosEnsaioRoutes from './ensaios/dados/dadosEnsaio.routes';
import ensaioRoutes from './ensaios/ensaio.routes';

routes.use('/profile', profileActionsRoutes)
routes.use('/cargos', cargoRoutes);
routes.use('/funcionarios', funcionarioRoutes);
routes.use('/telefones', telefoneRoutes);
routes.use('/amostras', amostraRoutes);
routes.use('/ocps', ocpRoutes);
routes.use('/empresas', empresaRoutes);
routes.use('/protocolos', protocoloRoutes);
routes.use('/instrumentos', instrumentoRoutes);
routes.use('/tipo-ensaio', tipoEnsaioRoutes);
routes.use('/campo-ensaio', campoEnsaioRoutes);
routes.use('/ensaios', ensaioRoutes);
routes.use('/dados-ensaio', dadosEnsaioRoutes);
routes.use('/ensaios/amostras', amostraEnsaioRoutes);
routes.use('/ensaios/funcionarios', funcionarioEnsaioRoutes);
routes.use('', authRoutes);

export default routes;