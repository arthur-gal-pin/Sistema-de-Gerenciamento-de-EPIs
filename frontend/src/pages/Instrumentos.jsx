import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import SkeletonLoading from '../components/common/SkeletonLoading';
import { EmptyState, ErrorAlert, PrimaryButton } from '../components/common/Feedback';
import CalibracaoBadge from '../components/instrumentos/CalibracaoBadge';
import InstrumentoFormModal from '../components/instrumentos/InstrumentoFormModal';
import { useResource } from '../hooks/useResource';
import { useModal } from '../hooks/useModal';
import { deleteInstrumento, getInstrumentos, getUsoInstrumento } from '../services/instrumentoService';
import { apiMessage } from '../utils/apiHelpers';
import { canDelete, getUserRole } from '../utils/auth';
import { formatDate, statusCalibracao } from '../utils/calibracao';

function UsoInstrumento({ idInstrumento }) {
  const { data, loading, error } = useResource(() => getUsoInstrumento(idInstrumento), [idInstrumento]);
  if (loading) return <small className="text-lab-on-surface-variant">Carregando usos...</small>;
  if (error) return <small className="text-lab-error">{error}</small>;
  if (!data.length) return <small className="text-lab-on-surface-variant">Este instrumento ainda não foi usado em ensaios.</small>;
  const ensaios = [...new Set(data.map((r) => r.fkIdEnsaio))];
  return (
    <small>
      {data.length} registro(s) em {ensaios.length} ensaio(s):{' '}
      {ensaios.slice(0, 8).map((e, i) => (
        <span key={e}>{i > 0 && ', '}<Link to={`/ensaios/${e}`}>abrir ensaio {i + 1}</Link></span>
      ))}
      {ensaios.length > 8 && ' …'}
    </small>
  );
}

const FILTROS = [
  { v: '', l: 'Todos' }, { v: 'vencida', l: 'Vencidos' }, { v: 'atencao', l: 'Vencem em breve' }, { v: 'ok', l: 'Em dia' },
];

export default function Instrumentos() {
  const role = getUserRole();
  const { data, loading, error, reload } = useResource(getInstrumentos);
  const { isOpen, openModal, closeModal } = useModal();
  const [editing, setEditing] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [busca, setBusca] = useState('');
  const [expandido, setExpandido] = useState(null);
  const [actionError, setActionError] = useState('');

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (data ?? [])
      .map((i) => ({ ...i, calib: statusCalibracao(i.ultimaCalibracao) }))
      .filter((i) => (!filtro || i.calib.status === filtro) && (!termo || i.nomeInstrumento.toLowerCase().includes(termo)))
      .sort((a, b) => (a.calib.dias ?? -Infinity) - (b.calib.dias ?? -Infinity)); // mais urgentes primeiro
  }, [data, filtro, busca]);

  const pendentes = (data ?? []).filter((i) => statusCalibracao(i.ultimaCalibracao).status !== 'ok').length;

  function abrir(instrumento = null) {
    setEditing(instrumento);
    openModal();
  }

  async function handleDelete(i) {
    if (!window.confirm(`Excluir o instrumento "${i.nomeInstrumento}"?`)) return;
    setActionError('');
    try {
      await deleteInstrumento(i.idInstrumento);
      reload();
    } catch (err) {
      setActionError(apiMessage(err, 'Não foi possível excluir. O instrumento pode estar em uso em algum ensaio.'));
    }
  }

  return (
    <AppLayout
      title="Instrumentos"
      subtitle={pendentes ? `${pendentes} instrumento(s) com calibração vencida ou perto de vencer.` : 'Controle de calibração dos instrumentos.'}
      actions={<PrimaryButton icon="add" onClick={() => abrir()}>Novo instrumento</PrimaryButton>}
    >
      <div className="row g-2 mb-3">
        <div className="col-md-7">
          <input className="form-control" placeholder="Buscar instrumento" value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className="col-md-5">
          <select className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            {FILTROS.map((f) => <option key={f.v} value={f.v}>{f.l}</option>)}
          </select>
        </div>
      </div>

      <ErrorAlert message={error || actionError} onRetry={error ? reload : undefined} />

      {loading && !data ? <SkeletonLoading /> : lista.length === 0 ? (
        <EmptyState icon="straighten"
          title={data?.length ? 'Nenhum instrumento neste filtro' : 'Nenhum instrumento cadastrado'}
          text={data?.length ? undefined : 'Cadastre os instrumentos para usá-los nos ensaios.'}
          action={!data?.length && <PrimaryButton icon="add" onClick={() => abrir()}>Novo instrumento</PrimaryButton>} />
      ) : (
        lista.map((i) => (
          <div key={i.idInstrumento} className="card shadow-sm p-3 mb-3">
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2">
              <div>
                <h5 className="mb-1">{i.nomeInstrumento}</h5>
                {i.funcaoInstrumento && <p className="text-lab-on-surface-variant mb-1">{i.funcaoInstrumento}</p>}
                <small className="text-lab-on-surface-variant">
                  Última calibração: {formatDate(i.ultimaCalibracao)} · Próxima: {formatDate(i.calib.proxima)}
                </small>
              </div>
              <div className="d-flex align-items-center gap-1">
                <CalibracaoBadge ultimaCalibracao={i.ultimaCalibracao} />
                <button className="btn btn-sm btn-link" onClick={() => setExpandido(expandido === i.idInstrumento ? null : i.idInstrumento)}>
                  {expandido === i.idInstrumento ? 'Ocultar usos' : 'Ver usos'}
                </button>
                <button className="btn btn-sm btn-link text-lab-on-surface-variant" aria-label="Editar instrumento" onClick={() => abrir(i)}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                </button>
                {canDelete(role) && (
                  <button className="btn btn-sm btn-link text-lab-error" aria-label="Excluir instrumento" onClick={() => handleDelete(i)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                  </button>
                )}
              </div>
            </div>
            {expandido === i.idInstrumento && <div className="mt-2 pt-2 border-top"><UsoInstrumento idInstrumento={i.idInstrumento} /></div>}
          </div>
        ))
      )}

      {isOpen && (
        <InstrumentoFormModal key={editing?.idInstrumento ?? 'novo'} isOpen={isOpen} onClose={closeModal}
          instrumento={editing} onSaved={reload} />
      )}
    </AppLayout>
  );
}
