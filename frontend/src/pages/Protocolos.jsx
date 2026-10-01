import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import SkeletonLoading from '../components/common/SkeletonLoading';
import { EmptyState, ErrorAlert, PrimaryButton } from '../components/common/Feedback';
import ProtocoloFormModal, { TIPOS_PROTOCOLO } from '../components/protocolos/ProtocoloFormModal';
import { useResource } from '../hooks/useResource';
import { useModal } from '../hooks/useModal';
import { deleteProtocolo, getProtocolos } from '../services/protocoloService';
import { getEmpresas, getOcps } from '../services/lookupService';
import { apiMessage } from '../utils/apiHelpers';
import { canDelete, getUserRole } from '../utils/auth';
import { formatDate } from '../utils/calibracao';

async function loadPage() {
  const [protocolos, ocps, empresas] = await Promise.all([getProtocolos(), getOcps(), getEmpresas()]);
  return { protocolos, ocps, empresas };
}

export default function Protocolos() {
  const navigate = useNavigate();
  const role = getUserRole();
  const { data, loading, error, reload } = useResource(loadPage);
  const { isOpen, openModal, closeModal } = useModal();

  const [editing, setEditing] = useState(null);
  const [busca, setBusca] = useState('');
  const [tipo, setTipo] = useState('');
  const [actionError, setActionError] = useState('');

  const empresaNome = useMemo(() => Object.fromEntries((data?.empresas ?? []).map((e) => [e.idEmpresa, e.nomeEmpresa])), [data]);
  const ocpNome = useMemo(() => Object.fromEntries((data?.ocps ?? []).map((o) => [o.idOCP, o.nomeOCP])), [data]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (data?.protocolos ?? []).filter((p) => {
      if (tipo && p.tipoProtocolo !== tipo) return false;
      if (!termo) return true;
      return [p.nomeProtocolo, p.numeroProtocolo, p.numeroSEI, empresaNome[p.fkIdEmpresa]]
        .filter(Boolean).some((v) => v.toLowerCase().includes(termo));
    });
  }, [data, busca, tipo, empresaNome]);

  function abrirFormulario(protocolo = null) {
    setEditing(protocolo);
    openModal();
  }

  async function handleDelete(p) {
    if (!window.confirm(`Excluir o protocolo ${p.numeroProtocolo}? Amostras e ensaios vinculados também serão removidos.`)) return;
    setActionError('');
    try {
      await deleteProtocolo(p.idProtocolo);
      reload();
    } catch (err) {
      setActionError(apiMessage(err, 'Não foi possível excluir o protocolo.'));
    }
  }

  return (
    <AppLayout
      title="Protocolos"
      subtitle="Acompanhe os protocolos e abra os ensaios de cada um."
      actions={<PrimaryButton icon="add" onClick={() => abrirFormulario()}>Novo protocolo</PrimaryButton>}
    >
      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <input className="form-control" placeholder="Buscar por nome, nº do protocolo, SEI ou empresa"
            value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos os tipos</option>
            {Object.entries(TIPOS_PROTOCOLO).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      <ErrorAlert message={error || actionError} onRetry={error ? reload : undefined} />

      {loading && !data ? (
        <SkeletonLoading />
      ) : filtrados.length === 0 ? (
        <EmptyState
          icon="folder_open"
          title={data?.protocolos.length ? 'Nenhum protocolo corresponde à busca' : 'Nenhum protocolo cadastrado'}
          text={data?.protocolos.length ? 'Tente outro termo ou limpe o filtro de tipo.' : 'Cadastre o primeiro protocolo para começar a registrar ensaios.'}
          action={!data?.protocolos.length && <PrimaryButton icon="add" onClick={() => abrirFormulario()}>Novo protocolo</PrimaryButton>}
        />
      ) : (
        <div className="table-responsive card shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Protocolo</th><th>SEI</th><th>Tipo</th><th>Empresa / OCP</th><th>Abertura</th><th>Entrega</th><th />
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p) => (
                <tr key={p.idProtocolo} style={{ cursor: 'pointer' }} onClick={() => navigate(`/protocolos/${p.idProtocolo}`)}>
                  <td>
                    <div className="fw-semibold">{p.numeroProtocolo}</div>
                    <div className="text-lab-on-surface-variant small">{p.nomeProtocolo}</div>
                  </td>
                  <td>{p.numeroSEI}</td>
                  <td>{TIPOS_PROTOCOLO[p.tipoProtocolo] ?? p.tipoProtocolo}</td>
                  <td>
                    <div>{empresaNome[p.fkIdEmpresa] ?? '—'}</div>
                    <div className="text-lab-on-surface-variant small">{ocpNome[p.fkIdOcp] ?? '—'}</div>
                  </td>
                  <td>{formatDate(p.diaAbertura)}</td>
                  <td>{formatDate(p.diaEntrega)}</td>
                  <td className="text-end text-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-sm btn-link text-lab-on-surface-variant" aria-label="Editar protocolo"
                      onClick={() => abrirFormulario(p)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                    </button>
                    {canDelete(role) && (
                      <button className="btn btn-sm btn-link text-lab-error" aria-label="Excluir protocolo" onClick={() => handleDelete(p)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && (
        <ProtocoloFormModal
          key={editing?.idProtocolo ?? 'novo'}
          isOpen={isOpen}
          onClose={closeModal}
          protocolo={editing}
          ocps={data?.ocps ?? []}
          empresas={data?.empresas ?? []}
          onSaved={reload}
        />
      )}
    </AppLayout>
  );
}
