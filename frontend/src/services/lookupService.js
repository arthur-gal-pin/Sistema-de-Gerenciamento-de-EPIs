import api from './api';
import { listOrEmpty } from '../utils/apiHelpers';

export const getOcps = () => listOrEmpty(api.get('/ocps/all'));           // { idOCP, nomeOCP }
export const getEmpresas = () => listOrEmpty(api.get('/empresas/all'));   // { idEmpresa, nomeEmpresa }
