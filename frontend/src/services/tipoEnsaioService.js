import api from './api';
import { dataOf, listOrEmpty } from '../utils/apiHelpers';

// ---- Tipos de ensaio ----
const tipoBody = (f) => ({
  nomeEnsaio: f.nomeEnsaio.trim(),
  categoriaAplicavel: f.categoriaAplicavel, // 'filtro' | 'peca'
  descricaoEnsaio: f.descricao?.trim() || undefined,
});

export const getTiposEnsaio = () => listOrEmpty(api.get('/tipo-ensaio/all'));
export const createTipoEnsaio = (form) => dataOf(api.post('/tipo-ensaio', tipoBody(form)));
export const updateTipoEnsaio = (id, form) => dataOf(api.put(`/tipo-ensaio/${id}`, tipoBody(form)));
export const deleteTipoEnsaio = (id) => api.delete(`/tipo-ensaio/${id}`);

// ---- Campos do tipo ----
// create lê "descricaoCampo" e update lê "descricao": enviamos as duas chaves.
const campoBody = (idTipoEnsaio, f) => ({
  FK_idTipoEnsaio: idTipoEnsaio,
  fkIdTipoEnsaio: idTipoEnsaio,
  nomeCampo: f.nomeCampo.trim(),
  unidadeMedida: f.unidadeMedida.trim(),
  tipoDado: f.tipoDado, // 'string' | 'number' | 'date' | 'char'
  obrigatoriedade: Boolean(f.obrigatoriedade),
  descricaoCampo: f.descricao?.trim() || undefined,
  descricao: f.descricao?.trim() || undefined,
});

export const getCamposByTipo = (idTipoEnsaio) => listOrEmpty(api.get(`/campo-ensaio/tipoEnsaio/${idTipoEnsaio}`));
export const createCampo = (idTipoEnsaio, form) => dataOf(api.post('/campo-ensaio', campoBody(idTipoEnsaio, form)));
export const updateCampo = (idCampo, idTipoEnsaio, form) =>
  dataOf(api.patch(`/campo-ensaio/${idCampo}`, campoBody(idTipoEnsaio, form)));
export const deleteCampo = (idCampo) => api.delete(`/campo-ensaio/${idCampo}`);
