import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import SkeletonLoading from '../components/common/SkeletonLoading';
import { EmptyState, ErrorAlert, PrimaryButton } from '../components/common/Feedback';
import NovoEnsaioModal, { PAPEIS } from '../components/protocolos/NovoEnsaioModal';
import { TIPOS_PROTOCOLO } from '../components/protocolos/ProtocoloFormModal';
import { useResource } from '../hooks/useResource';
import { useModal } from '../hooks/useModal';
import { getAmostrasByProtocolo, getEnsaiosByProtocolo, getProtocoloById } from '../services/protocoloService';
import { getTiposEnsaio } from '../services/tipoEnsaioService';
import { formatDate } from '../utils/calibracao';

export default function ProtocoloDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [aba, setAba] = useState('ensaios');
  const { isOpen, openModal, closeModal } = useModal();

  const { data, loading, error, reload } = useResource(async () => {
    const [protocolo, amostras, ensaios, tipos] = await Promise.all([
      getProtocoloById(id), getAmostrasByProtocolo(id), getEnsaiosByProtocolo(id), getTiposEnsaio(),
    ]);
    return { protocolo, amostras, ensaios, tipos };
  }, [id]);

  const tipoNome = useMemo(() => Object.fromEntries((data?.tipos ?? []).map((t) => [t.idTipoEnsaio, t.nomeEnsaio])), [data]);
  const p = data?.protocolo;

  return (
    <AppLayout
      back={{ to: '/protocolos', label: 'Protocolos' }}
      title={p ? `Protocolo ${p.numeroProtocolo}` : 'Protocolo'}
      subtitle={p && `${p.nomeProtocolo} · ${TIPOS_PROTOCOLO[p.tipoProtocolo] ?? p.tipoProtocolo} · SEI ${p.numeroSEI}`}
      actions={p && <PrimaryButton icon="add" onClick={openModal}>Novo ensaio</PrimaryButton>}
    >
      <ErrorAlert message={error} onRetry={reload} />
      {loading && !data ? <SkeletonLoading /> : p && (
        <>
          <div className="card shadow-sm p-3 mb-4">
            <div className="row">
              <div className="col-md-3"><small className="text-lab-on-surface-variant">Abertura</small><div>{formatDate(p.diaAbertura)}</div></div>
              <div className="col-md-3"><small className="text-lab-on-surface-variant">Entrega</small><div>{formatDate(p.diaEntrega)}</div></div>
              <div className="col-md-6"><small className="text-lab-on-surface-variant">Descrição</small><div>{p.descricao || '—'}</div></div>
            </div>
          </div>

          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button className={`nav-link ${aba === 'ensaios' ? 'active' : ''}`} onClick={() => setAba('ensaios')}>
                Ensaios ({data.ensaios.length})
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${aba === 'amostras' ? 'active' : ''}`} onClick={() => setAba('amostras')}>
                Amostras ({data.amostras.length})
              </button>
            </li>
          </ul>

          {aba === 'ensaios' && (data.ensaios.length === 0 ? (
            <EmptyState icon="science" title="Nenhum ensaio neste protocolo"
              text="Crie um ensaio para registrar condições e dados por amostra."
              action={<PrimaryButton icon="add" onClick={openModal}>Novo ensaio</PrimaryButton>} />
          ) : (
            <div className="list-group shadow-sm">
              {data.ensaios.map((e) => (
                <Link key={e.idEnsaio} to={`/ensaios/${e.idEnsaio}`}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                  <span>
                    <span className="fw-semibold">{e.nomeEnsaio}</span>
                    <span className="text-lab-on-surface-variant small ms-2">{tipoNome[e.fkIdTipoEnsaio]}</span>
                  </span>
                  <span className="d-flex align-items-center gap-2">
                    <span className="text-lab-on-surface-variant small">{PAPEIS[e.papelEnsaio] ?? e.papelEnsaio}</span>
                    <span className="material-symbols-outlined">chevron_right</span>
                  </span>
                </Link>
              ))}
            </div>
          ))}

          {aba === 'amostras' && (data.amostras.length === 0 ? (
            <EmptyState icon="biotech" title="Nenhuma amostra neste protocolo" text="Cadastre amostras na tela Amostras." />
          ) : (
            <div className="table-responsive card shadow-sm">
              <table className="table align-middle mb-0">
                <thead><tr><th>Código</th><th>Nome</th><th>Classificação</th><th>Situação</th></tr></thead>
                <tbody>
                  {data.amostras.map((a) => (
                    <tr key={a.idAmostra}>
                      <td>{a.codigoAmostra}</td>
                      <td>{a.nomeAmostra}</td>
                      <td>{a.subclassificacaoAmostra}</td>
                      <td>{a.situacaoAmostra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}

      {isOpen && (
        <NovoEnsaioModal
          isOpen={isOpen}
          onClose={closeModal}
          protocoloId={id}
          tipos={data?.tipos ?? []}
          onCreated={(ensaio) => navigate(`/ensaios/${ensaio.idEnsaio}`)}
        />
      )}
    </AppLayout>
  );
}
