import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import SkeletonLoading from '../components/common/SkeletonLoading';
import { EmptyState, ErrorAlert, PrimaryButton } from '../components/common/Feedback';
import CondicoesForm from '../components/ensaios/CondicoesForm';
import CamposForm from '../components/ensaios/CamposForm';
import { PAPEIS } from '../components/protocolos/NovoEnsaioModal';
import { useResource } from '../hooks/useResource';
import { getAmostrasByProtocolo } from '../services/protocoloService';
import { getInstrumentos } from '../services/instrumentoService';
import { getCamposByTipo } from '../services/tipoEnsaioService';
import {
  createDado, createRegistro, deleteRegistro, getDadosByRegistro, getEnsaioById,
  getRegistrosByEnsaio, updateDado, updateRegistro,
} from '../services/execucaoEnsaioService';
import { apiMessage } from '../utils/apiHelpers';
import { canDelete, getUserRole } from '../utils/auth';

const NOVO = 'novo';

export default function ExecucaoEnsaio() {
  const { id } = useParams();
  const role = getUserRole();

  // Dados de apoio: tudo em paralelo depois de conhecer o ensaio (precisamos do tipo e do protocolo)
  const { data, loading, error, reload } = useResource(async () => {
    const ensaio = await getEnsaioById(id);
    const [campos, amostras, instrumentos, registros] = await Promise.all([
      getCamposByTipo(ensaio.fkIdTipoEnsaio),
      getAmostrasByProtocolo(ensaio.fkIdProtocolo),
      getInstrumentos(),
      getRegistrosByEnsaio(id),
    ]);
    return { ensaio, campos, amostras, instrumentos, registros };
  }, [id]);

  // Estado da tela
  const [selecionadoId, setSelecionadoId] = useState(null); // idAmostraEnsaio | 'novo' | null
  const [passo, setPasso] = useState('condicoes');           // 'condicoes' | 'dados'
  const [valores, setValores] = useState({});                // { [idCampoEnsaio]: string }
  const [dadosSalvos, setDadosSalvos] = useState({});        // { [idCampoEnsaio]: DadosEnsaio }
  const [errosCampos, setErrosCampos] = useState({});
  const [saving, setSaving] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const registro = data?.registros.find((r) => r.idAmostraEnsaio === selecionadoId) ?? null;
  const amostraDe = (r) => data?.amostras.find((a) => a.idAmostra === r.fkIdAmostra);
  const instrumentoDe = (r) => data?.instrumentos.find((i) => i.idInstrumento === r.fkIdInstrumento);

  async function abrirRegistro(r) {
    setSelecionadoId(r.idAmostraEnsaio);
    setPasso('dados');
    setErrosCampos({});
    setMensagem({ tipo: '', texto: '' });
    try {
      const dados = await getDadosByRegistro(r.idAmostraEnsaio);
      setDadosSalvos(Object.fromEntries(dados.map((d) => [d.fkIdCampoEnsaio, d])));
      setValores(Object.fromEntries(dados.map((d) => [d.fkIdCampoEnsaio, d.dado])));
    } catch (err) {
      setMensagem({ tipo: 'danger', texto: apiMessage(err, 'Não foi possível carregar os dados deste registro.') });
    }
  }

  function novoRegistro() {
    setSelecionadoId(NOVO);
    setPasso('condicoes');
    setValores({});
    setDadosSalvos({});
    setErrosCampos({});
    setMensagem({ tipo: '', texto: '' });
  }

  async function salvarCondicoes(form) {
    setSaving(true);
    setMensagem({ tipo: '', texto: '' });
    try {
      const payload = { ...form, ensaioId: id };
      if (selecionadoId === NOVO) {
        const criado = await createRegistro(payload);
        reload();
        setSelecionadoId(criado.idAmostraEnsaio);
        setValores({});
        setDadosSalvos({});
      } else {
        await updateRegistro(selecionadoId, payload);
        reload();
      }
      setPasso('dados');
    } catch (err) {
      setMensagem({ tipo: 'danger', texto: apiMessage(err, 'Não foi possível salvar as condições do ensaio.') });
    } finally {
      setSaving(false);
    }
  }

  function validarCampos() {
    const erros = {};
    data.campos.forEach((c) => {
      const v = (valores[c.idCampoEnsaio] ?? '').trim();
      if (!v) {
        if (c.obrigatoriedade) erros[c.idCampoEnsaio] = 'Campo obrigatório.';
      } else if (c.tipoDado === 'number' && Number.isNaN(Number(v))) {
        erros[c.idCampoEnsaio] = 'Informe um número válido.';
      } else if (c.tipoDado === 'char' && v.length !== 1) {
        erros[c.idCampoEnsaio] = 'Informe apenas um caractere.';
      }
    });
    setErrosCampos(erros);
    return Object.keys(erros).length === 0;
  }

  async function salvarDados() {
    if (!validarCampos()) return;
    setSaving(true);
    setMensagem({ tipo: '', texto: '' });

    // Um POST (novo) ou PATCH (já existente e alterado) por campo preenchido
    const tarefas = data.campos
      .map((campo) => ({ campo, valor: (valores[campo.idCampoEnsaio] ?? '').trim(), existente: dadosSalvos[campo.idCampoEnsaio] }))
      .filter(({ valor, existente }) => valor && (!existente || existente.dado !== valor));

    const resultados = await Promise.allSettled(
      tarefas.map(({ campo, valor, existente }) =>
        existente
          ? updateDado(existente.idDadosEnsaio, valor)
          : createDado({ idAmostraEnsaio: selecionadoId, campo, valor })
      )
    );

    const novosSalvos = { ...dadosSalvos };
    const falhas = {};
    resultados.forEach((res, i) => {
      const { campo, valor, existente } = tarefas[i];
      if (res.status === 'fulfilled') {
        novosSalvos[campo.idCampoEnsaio] = { ...(existente ?? {}), ...(res.value ?? {}), fkIdCampoEnsaio: campo.idCampoEnsaio, dado: valor };
      } else {
        falhas[campo.idCampoEnsaio] = apiMessage(res.reason, 'Não foi possível salvar este campo.');
      }
    });

    setDadosSalvos(novosSalvos);
    setErrosCampos(falhas);
    setMensagem(
      Object.keys(falhas).length
        ? { tipo: 'danger', texto: `${Object.keys(falhas).length} campo(s) não foram salvos. Corrija e salve de novo.` }
        : { tipo: 'success', texto: tarefas.length ? 'Dados salvos.' : 'Nenhuma alteração para salvar.' }
    );
    setSaving(false);
  }

  async function removerRegistro(r) {
    if (!window.confirm('Remover esta amostra do ensaio? Os dados registrados serão apagados.')) return;
    try {
      await deleteRegistro(r.idAmostraEnsaio);
      if (selecionadoId === r.idAmostraEnsaio) setSelecionadoId(null);
      reload();
    } catch (err) {
      setMensagem({ tipo: 'danger', texto: apiMessage(err, 'Não foi possível remover o registro.') });
    }
  }

  const ensaio = data?.ensaio;

  return (
    <AppLayout
      back={ensaio ? { to: `/protocolos/${ensaio.fkIdProtocolo}`, label: 'Voltar ao protocolo' } : { to: '/protocolos', label: 'Protocolos' }}
      title={ensaio?.nomeEnsaio ?? 'Ensaio'}
      subtitle={ensaio && `Papel: ${PAPEIS[ensaio.papelEnsaio] ?? ensaio.papelEnsaio}`}
      actions={ensaio && <PrimaryButton icon="add" onClick={novoRegistro}>Adicionar amostra</PrimaryButton>}
      maxWidth={1200}
    >
      <ErrorAlert message={error} onRetry={reload} />

      {loading && !data ? <SkeletonLoading /> : ensaio && (
        <div className="row g-4">
          {/* Coluna esquerda: amostras já registradas neste ensaio */}
          <div className="col-lg-4">
            <h6 className="font-headline mb-2">Amostras neste ensaio ({data.registros.length})</h6>
            {data.registros.length === 0 ? (
              <p className="text-lab-on-surface-variant">Nenhuma amostra registrada ainda.</p>
            ) : (
              <div className="list-group shadow-sm">
                {data.registros.map((r) => {
                  const a = amostraDe(r);
                  return (
                    <div key={r.idAmostraEnsaio}
                      className={`list-group-item d-flex justify-content-between align-items-start ${selecionadoId === r.idAmostraEnsaio ? 'active' : ''}`}
                      role="button" tabIndex={0}
                      onClick={() => abrirRegistro(r)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && abrirRegistro(r)}>
                      <div>
                        <div className="fw-semibold">{a ? `${a.codigoAmostra} · ${a.nomeAmostra}` : 'Amostra'}</div>
                        <small>{instrumentoDe(r)?.nomeInstrumento ?? 'Instrumento'} · {Number(r.temperatura)} °C · {Number(r.umidade)}%</small>
                      </div>
                      {canDelete(role) && (
                        <button className="btn btn-sm btn-link text-reset" aria-label="Remover amostra do ensaio"
                          onClick={(e) => { e.stopPropagation(); removerRegistro(r); }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Coluna direita: passo 1 (condições) e passo 2 (dados) */}
          <div className="col-lg-8">
            {!selecionadoId ? (
              <EmptyState icon="science" title="Escolha uma amostra ou adicione uma nova"
                text="Registre as condições do ambiente e depois os dados do ensaio." />
            ) : (
              <div className="card shadow-sm p-4">
                <ul className="nav nav-pills mb-4">
                  <li className="nav-item">
                    <button className={`nav-link ${passo === 'condicoes' ? 'active' : ''}`} onClick={() => setPasso('condicoes')}>
                      1. Amostra e condições
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${passo === 'dados' ? 'active' : ''}`} disabled={selecionadoId === NOVO}
                      onClick={() => setPasso('dados')}>
                      2. Dados do ensaio
                    </button>
                  </li>
                </ul>

                {mensagem.texto && <div className={`alert alert-${mensagem.tipo} py-2`}>{mensagem.texto}</div>}

                {passo === 'condicoes' ? (
                  <CondicoesForm
                    key={registro?.idAmostraEnsaio ?? NOVO}
                    amostras={data.amostras}
                    instrumentos={data.instrumentos}
                    registros={data.registros}
                    registro={registro}
                    saving={saving}
                    onSubmit={salvarCondicoes}
                    onCancel={registro ? () => setPasso('dados') : undefined}
                  />
                ) : (
                  <CamposForm
                    campos={data.campos}
                    valores={valores}
                    errors={errosCampos}
                    saving={saving}
                    onChange={(campoId, valor) => {
                      setValores((v) => ({ ...v, [campoId]: valor }));
                      setErrosCampos((e) => ({ ...e, [campoId]: undefined }));
                      setMensagem({ tipo: '', texto: '' });
                    }}
                    onSubmit={salvarDados}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
