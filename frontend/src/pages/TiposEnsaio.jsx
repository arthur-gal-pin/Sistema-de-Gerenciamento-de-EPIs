import { useMemo, useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import SkeletonLoading from '../components/common/SkeletonLoading';
import { EmptyState, ErrorAlert, PrimaryButton } from '../components/common/Feedback';
import TipoEnsaioFormModal, { CATEGORIAS } from '../components/tipos-ensaio/TipoEnsaioFormModal';
import CampoFormModal, { TIPOS_DADO } from '../components/tipos-ensaio/CampoFormModal';
import { useResource } from '../hooks/useResource';
import { useModal } from '../hooks/useModal';
import { deleteCampo, deleteTipoEnsaio, getCamposByTipo, getTiposEnsaio } from '../services/tipoEnsaioService';
import { apiMessage } from '../utils/apiHelpers';
import { canDelete, getUserRole } from '../utils/auth';

export default function TiposEnsaio() {
  const role = getUserRole();
  const tipos = useResource(getTiposEnsaio);
  const [selecionadoId, setSelecionadoId] = useState(null);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [actionError, setActionError] = useState('');

  const tipoModal = useModal();
  const campoModal = useModal();
  const [editingTipo, setEditingTipo] = useState(null);
  const [editingCampo, setEditingCampo] = useState(null);

  // Campos carregam ao selecionar um tipo (mestre-detalhe)
  const campos = useResource(() => (selecionadoId ? getCamposByTipo(selecionadoId) : Promise.resolve([])), [selecionadoId]);

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return (tipos.data ?? []).filter(
      (t) => (!categoria || t.categoriaAplicavel === categoria) && (!termo || t.nomeEnsaio.toLowerCase().includes(termo))
    );
  }, [tipos.data, busca, categoria]);

  const selecionado = (tipos.data ?? []).find((t) => t.idTipoEnsaio === selecionadoId) ?? null;

  function abrirTipo(t = null) { setEditingTipo(t); tipoModal.openModal(); }
  function abrirCampo(c = null) { setEditingCampo(c); campoModal.openModal(); }

  async function excluirTipo(t) {
    if (!window.confirm(`Excluir o tipo "${t.nomeEnsaio}" e todos os seus campos?`)) return;
    setActionError('');
    try {
      await deleteTipoEnsaio(t.idTipoEnsaio);
      if (selecionadoId === t.idTipoEnsaio) setSelecionadoId(null);
      tipos.reload();
    } catch (err) {
      setActionError(apiMessage(err, 'Não foi possível excluir. O tipo pode estar em uso em algum ensaio.'));
    }
  }

  async function excluirCampo(c) {
    if (!window.confirm(`Excluir o campo "${c.nomeCampo}"?`)) return;
    setActionError('');
    try {
      await deleteCampo(c.idCampoEnsaio);
      campos.reload();
    } catch (err) {
      setActionError(apiMessage(err, 'Não foi possível excluir. Já existem dados registrados neste campo.'));
    }
  }

  return (
    <AppLayout
      title="Tipos de ensaio"
      subtitle="Defina quais campos cada tipo de ensaio pede na hora do registro."
      actions={<PrimaryButton icon="add" onClick={() => abrirTipo()}>Novo tipo</PrimaryButton>}
      maxWidth={1200}
    >
      <ErrorAlert message={tipos.error || actionError} onRetry={tipos.error ? tipos.reload : undefined} />

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="row g-2 mb-3">
            <div className="col-7">
              <input className="form-control" placeholder="Buscar tipo" value={busca} onChange={(e) => setBusca(e.target.value)} />
            </div>
            <div className="col-5">
              <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas</option>
                {Object.entries(CATEGORIAS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>

          {tipos.loading && !tipos.data ? <SkeletonLoading /> : lista.length === 0 ? (
            <EmptyState icon="rule" title={tipos.data?.length ? 'Nenhum tipo neste filtro' : 'Nenhum tipo cadastrado'}
              text={tipos.data?.length ? undefined : 'Crie um tipo e depois adicione os campos que o ensaio deve registrar.'} />
          ) : (
            <div className="list-group shadow-sm">
              {lista.map((t) => (
                <div key={t.idTipoEnsaio}
                  className={`list-group-item d-flex justify-content-between align-items-start ${selecionadoId === t.idTipoEnsaio ? 'active' : ''}`}
                  role="button" tabIndex={0}
                  onClick={() => setSelecionadoId(t.idTipoEnsaio)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelecionadoId(t.idTipoEnsaio)}>
                  <div>
                    <div className="fw-semibold">{t.nomeEnsaio}</div>
                    <small>{CATEGORIAS[t.categoriaAplicavel] ?? t.categoriaAplicavel}</small>
                  </div>
                  <div className="text-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button className="btn btn-sm btn-link text-reset" aria-label="Editar tipo" onClick={() => abrirTipo(t)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                    </button>
                    {canDelete(role) && (
                      <button className="btn btn-sm btn-link text-reset" aria-label="Excluir tipo" onClick={() => excluirTipo(t)}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-lg-7">
          {!selecionado ? (
            <EmptyState icon="arrow_back" title="Escolha um tipo de ensaio" text="Os campos dele aparecem aqui." />
          ) : (
            <div className="card shadow-sm p-3">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="mb-1">{selecionado.nomeEnsaio}</h5>
                  <p className="text-lab-on-surface-variant mb-0">{selecionado.descricao || 'Sem descrição.'}</p>
                </div>
                <PrimaryButton icon="add" onClick={() => abrirCampo()}>Novo campo</PrimaryButton>
              </div>

              <ErrorAlert message={campos.error} onRetry={campos.reload} />
              {campos.loading && !campos.data ? <SkeletonLoading /> : (campos.data ?? []).length === 0 ? (
                <EmptyState icon="input" title="Este tipo ainda não tem campos"
                  text="Sem campos, o ensaio não tem o que registrar." />
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead><tr><th>Campo</th><th>Tipo</th><th>Unidade</th><th>Obrigatório</th><th /></tr></thead>
                    <tbody>
                      {campos.data.map((c) => (
                        <tr key={c.idCampoEnsaio}>
                          <td>{c.nomeCampo}</td>
                          <td>{TIPOS_DADO[c.tipoDado] ?? c.tipoDado}</td>
                          <td>{c.unidadeMedida}</td>
                          <td>{c.obrigatoriedade ? 'Sim' : 'Não'}</td>
                          <td className="text-end text-nowrap">
                            <button className="btn btn-sm btn-link text-lab-on-surface-variant" aria-label="Editar campo" onClick={() => abrirCampo(c)}>
                              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
                            </button>
                            {canDelete(role) && (
                              <button className="btn btn-sm btn-link text-lab-error" aria-label="Excluir campo" onClick={() => excluirCampo(c)}>
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
            </div>
          )}
        </div>
      </div>

      {tipoModal.isOpen && (
        <TipoEnsaioFormModal key={editingTipo?.idTipoEnsaio ?? 'novo'} isOpen={tipoModal.isOpen} onClose={tipoModal.closeModal}
          tipo={editingTipo} onSaved={tipos.reload} />
      )}
      {campoModal.isOpen && selecionado && (
        <CampoFormModal key={editingCampo?.idCampoEnsaio ?? 'novo'} isOpen={campoModal.isOpen} onClose={campoModal.closeModal}
          idTipoEnsaio={selecionado.idTipoEnsaio} campo={editingCampo} onSaved={campos.reload} />
      )}
    </AppLayout>
  );
}
