import api from './api';
import { dataOf, listOrEmpty } from '../utils/apiHelpers';

const toBody = (f) => ({
  nomeInstrumento: f.nomeInstrumento.trim(),
  funcaoInstrumento: f.funcaoInstrumento?.trim() || undefined,
  ultimaCalibracao: f.ultimaCalibracao,
});

export const getInstrumentos = () => listOrEmpty(api.get('/instrumentos/all'));
export const createInstrumento = (form) => dataOf(api.post('/instrumentos', toBody(form)));
export const updateInstrumento = (id, form) => dataOf(api.patch(`/instrumentos/${id}`, toBody(form)));
export const deleteInstrumento = (id) => api.delete(`/instrumentos/${id}`);

// Registros AmostraEnsaio que usaram o instrumento
export const getUsoInstrumento = (id) => listOrEmpty(api.get(`/ensaios/amostras/instrumento/${id}`));
