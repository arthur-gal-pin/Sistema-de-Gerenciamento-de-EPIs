import api from './api';
import { dataOf, listOrEmpty } from '../utils/apiHelpers';

// O backend (Protocolo.create) espera FK_idOCP / FK_idEmpresa
function toBody(f) {
  return {
    FK_idOCP: f.ocpId,
    FK_idEmpresa: f.empresaId,
    nomeProtocolo: f.nomeProtocolo.trim(),
    numeroProtocolo: f.numeroProtocolo.trim(),
    numeroSEI: f.numeroSEI.trim(),
    tipoProtocolo: f.tipoProtocolo,
    diaAbertura: f.diaAbertura,
    diaEntrega: f.diaEntrega || undefined,
    descricao: f.descricao?.trim() || undefined,
  };
}

export const getProtocolos = () => listOrEmpty(api.get('/protocolos/all'));
export const getProtocoloById = (id) => dataOf(api.get(`/protocolos/id/${id}`));
export const createProtocolo = (form) => dataOf(api.post('/protocolos', toBody(form)));
export const updateProtocolo = (id, form) => dataOf(api.patch(`/protocolos/${id}`, toBody(form)));
export const deleteProtocolo = (id) => api.delete(`/protocolos/${id}`);

export const getAmostrasByProtocolo = (idProtocolo) => listOrEmpty(api.get(`/amostras/protocolo/${idProtocolo}`));
export const getEnsaiosByProtocolo = (idProtocolo) => listOrEmpty(api.get(`/ensaios/protocolo/${idProtocolo}`));
