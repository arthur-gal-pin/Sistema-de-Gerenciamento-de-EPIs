// O schema só guarda "ultimaCalibracao". A validade é uma regra do laboratório: ajuste aqui.
export const VALIDADE_CALIBRACAO_DIAS = 365;
export const ALERTA_DIAS = 30;

export function statusCalibracao(ultimaCalibracao) {
  if (!ultimaCalibracao) return { status: 'vencida', dias: null, proxima: null, label: 'Sem calibração' };

  const proxima = new Date(ultimaCalibracao);
  proxima.setUTCDate(proxima.getUTCDate() + VALIDADE_CALIBRACAO_DIAS);
  const dias = Math.ceil((proxima.getTime() - Date.now()) / 86400000);

  if (dias < 0) return { status: 'vencida', dias, proxima, label: `Vencida há ${Math.abs(dias)} d` };
  if (dias <= ALERTA_DIAS) return { status: 'atencao', dias, proxima, label: `Vence em ${dias} d` };
  return { status: 'ok', dias, proxima, label: 'Em dia' };
}

export const formatDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—';

export const toInputDate = (iso) => (iso ? String(iso).slice(0, 10) : '');
