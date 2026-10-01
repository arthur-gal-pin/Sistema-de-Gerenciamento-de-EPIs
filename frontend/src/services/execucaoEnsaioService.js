import api from './api';
import { dataOf, listOrEmpty } from '../utils/apiHelpers';

// ---- Ensaio ----
export const getEnsaioById = (id) => dataOf(api.get(`/ensaios/id/${id}`));

export const createEnsaio = (f) =>
  dataOf(
    api.post('/ensaios', {
      FK_idProtocolo: f.protocoloId,
      FK_idTipoEnsaio: f.tipoEnsaioId,
      nomeEnsaio: f.nomeEnsaio.trim(),
      papel: f.papel, // 'prova' | 'contraprova' | 'testemunha'
      descricao: f.descricao?.trim() || undefined,
    })
  );

// ---- Passo 1: amostra + instrumento + condições ambientais ----
const registroBody = (f) => ({
  FK_idAmostra: f.amostraId,
  FK_idEnsaio: f.ensaioId,
  FK_idInstrumento: f.instrumentoId,
  temperatura: Number(f.temperatura),
  umidade: Number(f.umidade),
  pressao: f.pressao === '' || f.pressao == null ? undefined : Number(f.pressao),
});

export const getRegistrosByEnsaio = (idEnsaio) => listOrEmpty(api.get(`/ensaios/amostras/ensaio/${idEnsaio}`));
export const createRegistro = (form) => dataOf(api.post('/ensaios/amostras', registroBody(form)));
export const updateRegistro = (id, form) => dataOf(api.patch(`/ensaios/amostras/${id}`, registroBody(form)));
export const deleteRegistro = (id) => api.delete(`/ensaios/amostras/${id}`);

// ---- Passo 2: valores dos campos ----
export const getDadosByRegistro = (idAmostraEnsaio) => listOrEmpty(api.get(`/dados-ensaio/amostraEnsaio/${idAmostraEnsaio}`));

export const createDado = ({ idAmostraEnsaio, campo, valor }) =>
  dataOf(
    api.post('/dados-ensaio', {
      FK_idAmostraEnsaio: idAmostraEnsaio,
      FK_idCampoEnsaio: campo.idCampoEnsaio,
      nomeDado: campo.nomeCampo.slice(0, 80),
      dado: String(valor),
    })
  );

export const updateDado = (idDado, valor) => dataOf(api.patch(`/dados-ensaio/${idDado}`, { dado: String(valor) }));
