import { statusCalibracao } from '../../utils/calibracao';

const STYLES = {
  ok: 'bg-lab-tertiary text-lab-on-tertiary',
  atencao: 'bg-lab-secondary-container text-lab-on-secondary-container',
  vencida: 'bg-lab-error-container text-lab-on-error-container',
};

export default function CalibracaoBadge({ ultimaCalibracao }) {
  const { status, label } = statusCalibracao(ultimaCalibracao);
  return (
    <span className={`d-inline-block rounded-lab-full px-2 py-1 font-label ${STYLES[status]}`} style={{ fontSize: 12 }}>
      {label}
    </span>
  );
}
