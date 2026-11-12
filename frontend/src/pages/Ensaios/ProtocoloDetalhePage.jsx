import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
    FlaskConical, 
    Layers, 
    PlusCircle, 
    UserPlus, 
    FileText, 
    ChevronRight, 
    X, 
    Trash2, 
    CheckCircle2, 
    ClipboardEdit,
    AlertCircle
} from "lucide-react";
import { getProtocoloById } from "../../services/protocoloService";
import { getAmostrasPorProtocolo, createAmostra, deleteAmostra } from "../../services/amostras/amostraService";
import { 
    getEnsaiosPorProtocolo, 
    createEnsaio, 
    deleteEnsaio, 
    getAmostrasDoEnsaio, 
    vincularAmostraAoEnsaio,
    desvincularAmostraDoEnsaio,
    getFuncionariosDoEnsaio, 
    vincularFuncionarioAoEnsaio,
    desvincularFuncionarioDoEnsaio
} from "../../services/ensaioService";
import { getAllTiposEnsaio } from "../../services/tipoEnsaioService";
import { getAllFuncionarios } from "../../services/funcionarioService";
import { getAllInstrumentos } from "../../services/instrumentoService";
import { useFeedback } from "../../hooks/useFeedback";
import FeedbackModal from "../../components/modals/FeedbackModal";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function ProtocoloDetalhePage() {
    const { id } = useParams();
    const [erro, setErro] = useState(null);
    const [protocolo, setProtocolo] = useState(null);
    const [amostras, setAmostras] = useState([]);
    const [ensaios, setEnsaios] = useState([]);
    const [tiposEnsaio, setTiposEnsaio] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [instrumentos, setInstrumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [abaAtiva, setAbaAtiva] = useState("amostras");

    // Modais
    const [modalAmostraAberto, setModalAmostraAberto] = useState(false);
    const [modalEnsaioAberto, setModalEnsaioAberto] = useState(false);
    const [modalVincularAmostraAberto, setModalVincularAmostraAberto] = useState(false);
    const [modalVincularExecutorAberto, setModalVincularExecutorAberto] = useState(false);
    const [ensaioSelecionado, setEnsaioSelecionado] = useState(null);

    // Amostras do ensaio expandido: mapa ensaioId -> lista
    const [amostrasEnsaioMap, setAmostrasEnsaioMap] = useState({});
    const [executoresEnsaioMap, setExecutoresEnsaioMap] = useState({});

    // Form Amostra
    const [formAmostra, setFormAmostra] = useState({
        codigoAmostra: "",
        nomeAmostra: "",
        classificacaoAmostra: "peca",
        subclassificacaoAmostra: "Peça Facial Inteira",
        situacaoAmostra: "prova",
        descricao: ""
    });

    // Form Ensaio
    const [formEnsaio, setFormEnsaio] = useState({
        FK_idTipoEnsaio: "",
        nomeEnsaio: "",
        papel: "prova",
        descricao: ""
    });

    // Form Vincular Amostra ao Ensaio
    const [formVinculoAmostra, setFormVinculoAmostra] = useState({
        FK_idAmostra: "",
        FK_idInstrumento: "",
        temperatura: 22,
        umidade: 55,
        pressao: 1013
    });

    // Form Vincular Executor
    const [formVinculoExecutor, setFormVinculoExecutor] = useState({
        FK_idFuncionario: ""
    });

    const [salvando, setSalvando] = useState(false);
    const { showSuccess, showError, feedbackProps, confirm, confirmProps } = useFeedback();

    async function carregarDados() {
        try {
            setLoading(true);
            const [proto, ams, ens, tipos, funcs, insts] = await Promise.all([
                getProtocoloById(id),
                getAmostrasPorProtocolo(id),
                getEnsaiosPorProtocolo(id),
                getAllTiposEnsaio(),
                getAllFuncionarios(),
                getAllInstrumentos()
            ]);

            setProtocolo(proto);
            setAmostras(ams);
            setEnsaios(ens);
            setTiposEnsaio(tipos);
            setFuncionarios(funcs);
            setInstrumentos(insts);

            // Carrega amostras e executores para cada ensaio
            const amsMap = {};
            const execsMap = {};
            for (const e of ens) {
                const [amostrasDoEnsaio, execs] = await Promise.all([
                    getAmostrasDoEnsaio(e.idEnsaio).catch(() => []),
                    getFuncionariosDoEnsaio(e.idEnsaio).catch(() => [])
                ]);
                amsMap[e.idEnsaio] = amostrasDoEnsaio;
                execsMap[e.idEnsaio] = execs;
            }
            setAmostrasEnsaioMap(amsMap);
            setExecutoresEnsaioMap(execsMap);

        } catch (err) {
            console.error("Erro ao carregar detalhes do protocolo:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarDados();
    }, [id]);

    // Subclassificações conforme a Classificação
    const opcoesSubclassificacao = formAmostra.classificacaoAmostra === "filtro"
        ? ["Filtro para Partículas", "Filtro Quimico", "Filtro Combinado"]
        : ["Peça Facial Inteira", "Peça Facial 1/4", "Peça SemiFacial"];

    const handleClassificacaoChange = (e) => {
        const val = e.target.value;
        const sub = val === "filtro" ? "Filtro para Partículas" : "Peça Facial Inteira";
        setFormAmostra({
            ...formAmostra,
            classificacaoAmostra: val,
            subclassificacaoAmostra: sub
        });
    };

    const handleSalvarAmostra = async (e) => {
        e.preventDefault();
        setErro(null);
        setSalvando(true);
        try {
            await createAmostra({
                ...formAmostra,
                FK_idProtocolo: id
            });
            setModalAmostraAberto(false);
            setFormAmostra({
                codigoAmostra: "",
                nomeAmostra: "",
                classificacaoAmostra: "peca",
                subclassificacaoAmostra: "Peça Facial Inteira",
                situacaoAmostra: "prova",
                descricao: ""
            });
            const novasAmostras = await getAmostrasPorProtocolo(id);
            setAmostras(novasAmostras);
        } catch (err) {
            setErro(err.response?.data?.message || "Erro ao cadastrar amostra.");
        } finally {
            setSalvando(false);
        }
    };

    const handleSalvarEnsaio = async (e) => {
        e.preventDefault();
        setErro(null);
        setSalvando(true);
        try {
            await createEnsaio({
                ...formEnsaio,
                FK_idProtocolo: id,
                nomeEnsaio: formEnsaio.nomeEnsaio || tiposEnsaio.find(t => t.idTipoEnsaio === formEnsaio.FK_idTipoEnsaio)?.nomeEnsaio || "Ensaio"
            });
            setModalEnsaioAberto(false);
            setFormEnsaio({
                FK_idTipoEnsaio: "",
                nomeEnsaio: "",
                papel: "prova",
                descricao: ""
            });
            carregarDados();
        } catch (err) {
            setErro(err.response?.data?.message || "Erro ao adicionar ensaio.");
        } finally {
            setSalvando(false);
        }
    };

    const handleVincularAmostra = async (e) => {
        e.preventDefault();
        setErro(null);
        setSalvando(true);
        try {
            await vincularAmostraAoEnsaio({
                FK_idEnsaio: ensaioSelecionado.idEnsaio,
                FK_idAmostra: formVinculoAmostra.FK_idAmostra,
                FK_idInstrumento: formVinculoAmostra.FK_idInstrumento,
                temperatura: Number(formVinculoAmostra.temperatura),
                umidade: Number(formVinculoAmostra.umidade),
                pressao: Number(formVinculoAmostra.pressao)
            });
            setModalVincularAmostraAberto(false);
            const atualizadas = await getAmostrasDoEnsaio(ensaioSelecionado.idEnsaio);
            setAmostrasEnsaioMap((prev) => ({ ...prev, [ensaioSelecionado.idEnsaio]: atualizadas }));
        } catch (err) {
            setErro(err.response?.data?.message || "Erro ao vincular amostra ao ensaio.");
        } finally {
            setSalvando(false);
        }
    };

    const handleVincularExecutor = async (e) => {
        e.preventDefault();
        setErro(null);
        setSalvando(true);
        try {
            await vincularFuncionarioAoEnsaio({
                FK_idEnsaio: ensaioSelecionado.idEnsaio,
                FK_idFuncionario: formVinculoExecutor.FK_idFuncionario
            });
            setModalVincularExecutorAberto(false);
            const atualizados = await getFuncionariosDoEnsaio(ensaioSelecionado.idEnsaio);
            setExecutoresEnsaioMap((prev) => ({ ...prev, [ensaioSelecionado.idEnsaio]: atualizados }));
        } catch (err) {
            setErro(err.response?.data?.message || "Erro ao vincular executor ao ensaio.");
        } finally {
            setSalvando(false);
        }
    };

    const handleDeleteAmostra = async (idAmostra, codigo) => {
        if (!window.confirm(`Excluir a amostra "${codigo}"?`)) return;
        try {
            await deleteAmostra(idAmostra);
            const novas = await getAmostrasPorProtocolo(id);
            setAmostras(novas);
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao excluir amostra.");
        }
    };

    const handleDeleteEnsaio = async (idEnsaio, nome) => {
        if (!window.confirm(`Excluir o ensaio "${nome}"?`)) return;
        try {
            await deleteEnsaio(idEnsaio);
            carregarDados();
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao excluir ensaio.");
        }
    };

    const handleDesvincularAmostra = async (ensaioId, vinculoId) => {
        if (!window.confirm("Remover esta amostra do ensaio?")) return;
        try {
            await desvincularAmostraDoEnsaio(vinculoId);
            const atualizadas = await getAmostrasDoEnsaio(ensaioId);
            setAmostrasEnsaioMap((prev) => ({ ...prev, [ensaioId]: atualizadas }));
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao desvincular.");
        }
    };

    const handleDesvincularExecutor = async (ensaioId, idFuncEnsaio) => {
        if (!window.confirm("Remover executor deste ensaio?")) return;
        try {
            await desvincularFuncionarioDoEnsaio(idFuncEnsaio);
            const atualizados = await getFuncionariosDoEnsaio(ensaioId);
            setExecutoresEnsaioMap((prev) => ({ ...prev, [ensaioId]: atualizados }));
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao desvincular executor.");
        }
    };

    const abrirModalVinculoAmostra = (ensaio) => {
        setEnsaioSelecionado(ensaio);
        setErro(null);
        setFormVinculoAmostra({
            FK_idAmostra: amostras[0]?.idAmostra || "",
            FK_idInstrumento: instrumentos[0]?.idInstrumento || "",
            temperatura: 22,
            umidade: 55,
            pressao: 1013
        });
        setModalVincularAmostraAberto(true);
    };

    const abrirModalVinculoExecutor = (ensaio) => {
        setEnsaioSelecionado(ensaio);
        setErro(null);
        setFormVinculoExecutor({
            FK_idFuncionario: funcionarios[0]?.idFuncionario || ""
        });
        setModalVincularExecutorAberto(true);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!protocolo) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <AlertCircle size={40} style={{ color: 'var(--danger)', marginBottom: '12px' }} />
                <h2>Protocolo não encontrado</h2>
                <Link to="/protocolos" className="btn-primary mt-16">Voltar para a lista</Link>
            </div>
        );
    }

    const amostraNomeMap = Object.fromEntries(amostras.map((a) => [a.idAmostra, a]));
    const funcNomeMap = Object.fromEntries(funcionarios.map((f) => [f.idFuncionario, f]));
    const instNomeMap = Object.fromEntries(instrumentos.map((i) => [i.idInstrumento, i.nomeInstrumento]));

    return (
        <div>
            {/* Header com dados do protocolo */}
            <div className="page-header" style={{ alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1>Protocolo {protocolo.numeroProtocolo}</h1>
                        <span className={`badge ${protocolo.tipoProtocolo === 'inicial' ? 'badge-blue' : 'badge-amber'}`}>
                            {protocolo.tipoProtocolo}
                        </span>
                    </div>
                    <p style={{ marginTop: '6px' }}>
                        <strong>Processo SEI:</strong> {protocolo.numeroSEI} | <strong>Abertura:</strong> {new Date(protocolo.diaAbertura).toLocaleDateString('pt-BR')}
                    </p>
                    {protocolo.descricao && <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '4px' }}>{protocolo.descricao}</p>}
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <Link to="/protocolos" className="btn-secondary">
                        Voltar
                    </Link>
                </div>
            </div>

            {/* Abas */}
            <div className="tabs">
                <button
                    type="button"
                    className={`tab-btn ${abaAtiva === 'amostras' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('amostras')}
                >
                    <FlaskConical size={18} /> Amostras ({amostras.length})
                </button>
                <button
                    type="button"
                    className={`tab-btn ${abaAtiva === 'ensaios' ? 'active' : ''}`}
                    onClick={() => setAbaAtiva('ensaios')}
                >
                    <Layers size={18} /> Ensaios ({ensaios.length})
                </button>
            </div>

            {/* Aba 1: Amostras */}
            {abaAtiva === 'amostras' && (
                <div className="card">
                    <div className="flex-between mb-16">
                        <h3>Amostras Recebidas no Protocolo</h3>
                        <button type="button" onClick={() => { setErro(null); setModalAmostraAberto(true); }} className="btn-primary">
                            <PlusCircle size={18} /> Adicionar Amostra
                        </button>
                    </div>

                    {amostras.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '36px 0' }}>
                            <p className="text-muted">Nenhuma amostra vinculada a este protocolo.</p>
                            <button type="button" onClick={() => setModalAmostraAberto(true)} className="btn-primary mt-12">
                                Cadastrar Primeira Amostra
                            </button>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Código Amostra</th>
                                        <th>Nome / Modelo</th>
                                        <th>Classificação</th>
                                        <th>Subclassificação</th>
                                        <th>Papel / Situação</th>
                                        <th>Descrição</th>
                                        <th style={{ textAlign: 'right' }}>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {amostras.map((am) => (
                                        <tr key={am.idAmostra}>
                                            <td><strong>{am.codigoAmostra}</strong></td>
                                            <td>{am.nomeAmostra}</td>
                                            <td>
                                                <span className={`badge ${am.classificacaoAmostra === 'peca' ? 'badge-purple' : 'badge-blue'}`}>
                                                    {am.classificacaoAmostra}
                                                </span>
                                            </td>
                                            <td>{am.subclassificacaoAmostra}</td>
                                            <td>
                                                <span className={`badge ${am.situacaoAmostra === 'prova' ? 'badge-blue' : am.situacaoAmostra === 'contraprova' ? 'badge-amber' : 'badge-gray'}`}>
                                                    {am.situacaoAmostra}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {am.descricao || "-"}
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteAmostra(am.idAmostra, am.codigoAmostra)}
                                                    className="btn-icon"
                                                    title="Excluir Amostra"
                                                    style={{ color: 'var(--danger)' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Aba 2: Ensaios */}
            {abaAtiva === 'ensaios' && (
                <div>
                    <div className="flex-between mb-16">
                        <h3 style={{ fontSize: '1.2rem' }}>Ensaios Definidos para o Protocolo</h3>
                        <button type="button" onClick={() => { setErro(null); setModalEnsaioAberto(true); }} className="btn-primary">
                            <PlusCircle size={18} /> Adicionar Ensaio
                        </button>
                    </div>

                    {ensaios.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '36px 0' }}>
                            <p className="text-muted">Nenhum ensaio configurado para este protocolo.</p>
                            <button type="button" onClick={() => setModalEnsaioAberto(true)} className="btn-primary mt-12">
                                Criar Primeiro Ensaio
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {ensaios.map((ens) => {
                                const amostrasVinculadas = amostrasEnsaioMap[ens.idEnsaio] || [];
                                const executores = executoresEnsaioMap[ens.idEnsaio] || [];

                                return (
                                    <div key={ens.idEnsaio} className="card" style={{ padding: '20px' }}>
                                        <div className="flex-between mb-16" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <h3 style={{ fontSize: '1.2rem' }}>{ens.nomeEnsaio}</h3>
                                                    <span className={`badge ${ens.papel === 'prova' ? 'badge-blue' : 'badge-amber'}`}>
                                                        Papel: {ens.papel}
                                                    </span>
                                                </div>
                                                {ens.descricao && <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '4px' }}>{ens.descricao}</p>}
                                            </div>

                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <Link
                                                    to={`/ensaios/${ens.idEnsaio}/registro`}
                                                    className="btn-primary"
                                                    style={{ padding: '7px 14px', fontSize: '0.88rem' }}
                                                >
                                                    <ClipboardEdit size={16} /> Registrar Resultados
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteEnsaio(ens.idEnsaio, ens.nomeEnsaio)}
                                                    className="btn-icon"
                                                    title="Excluir Ensaio"
                                                    style={{ color: 'var(--danger)' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Executores */}
                                        <div style={{ marginBottom: '16px' }}>
                                            <div className="flex-between mb-8">
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                                                    Técnicos Executores ({executores.length})
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => abrirModalVinculoExecutor(ens)}
                                                    className="btn-secondary"
                                                    style={{ padding: '4px 10px', fontSize: '0.82rem' }}
                                                >
                                                    <UserPlus size={14} /> Associar Executor
                                                </button>
                                            </div>

                                            {executores.length === 0 ? (
                                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>Nenhum executor associado ainda.</p>
                                            ) : (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                    {executores.map((ex) => {
                                                        const func = funcNomeMap[ex.fkIdFuncionario || ex.FK_idFuncionario];
                                                        const nome = func ? `${func.nomeFuncionario} ${func.sobrenomeFuncionario || ''}` : "Técnico";
                                                        return (
                                                            <span key={ex.idFuncionarioEnsaio} className="badge badge-gray" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                                {nome}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDesvincularExecutor(ens.idEnsaio, ex.idFuncionarioEnsaio)}
                                                                    style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: 0 }}
                                                                >
                                                                    <X size={12} />
                                                                </button>
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {/* Amostras Ensaidas */}
                                        <div>
                                            <div className="flex-between mb-8">
                                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                                                    Amostras Ensaiadas ({amostrasVinculadas.length})
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => abrirModalVinculoAmostra(ens)}
                                                    className="btn-secondary"
                                                    style={{ padding: '4px 10px', fontSize: '0.82rem' }}
                                                >
                                                    <PlusCircle size={14} /> Adicionar Amostra ao Ensaio
                                                </button>
                                            </div>

                                            {amostrasVinculadas.length === 0 ? (
                                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                    Nenhuma amostra vinculada a este ensaio ainda. Clique em "Adicionar Amostra ao Ensaio" para definir os testes.
                                                </p>
                                            ) : (
                                                <div className="table-container">
                                                    <table className="data-table" style={{ fontSize: '0.88rem' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Código da Amostra</th>
                                                                <th>Instrumento</th>
                                                                <th>Temperatura</th>
                                                                <th>Umidade</th>
                                                                <th>Pressão</th>
                                                                <th style={{ textAlign: 'right' }}>Ação</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {amostrasVinculadas.map((item) => {
                                                                const am = amostraNomeMap[item.fkIdAmostra || item.FK_idAmostra];
                                                                const instNome = instNomeMap[item.fkIdInstrumento || item.FK_idInstrumento] || "Não especificado";

                                                                return (
                                                                    <tr key={item.idAmostraEnsaio}>
                                                                        <td>
                                                                            <strong>{am?.codigoAmostra || "Amostra"}</strong> - {am?.nomeAmostra}
                                                                        </td>
                                                                        <td>{instNome}</td>
                                                                        <td>{item.temperatura}°C</td>
                                                                        <td>{item.umidade}%</td>
                                                                        <td>{item.pressao ? `${item.pressao} hPa` : "-"}</td>
                                                                        <td style={{ textAlign: 'right' }}>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleDesvincularAmostra(ens.idEnsaio, item.idAmostraEnsaio)}
                                                                                className="btn-icon"
                                                                                title="Remover amostra do ensaio"
                                                                                style={{ color: 'var(--danger)' }}
                                                                            >
                                                                                <X size={14} />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Modal Cadastrar Amostra */}
            {modalAmostraAberto && (
                <div className="modal-overlay" onClick={() => setModalAmostraAberto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Adicionar Amostra ao Protocolo</h3>
                            <button type="button" onClick={() => setModalAmostraAberto(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        {erro && <div className="alert alert-error">{erro}</div>}
                        <form onSubmit={handleSalvarAmostra}>
                            <div className="form-group">
                                <label>Código da Amostra (até 40 caracteres) *</label>
                                <input
                                    type="text"
                                    maxLength={40}
                                    required
                                    placeholder="Ex: AM-2026-001"
                                    value={formAmostra.codigoAmostra}
                                    onChange={(e) => setFormAmostra({ ...formAmostra, codigoAmostra: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Nome / Identificação da Peça ou Filtro *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Máscara Facial Modelo Delta"
                                    value={formAmostra.nomeAmostra}
                                    onChange={(e) => setFormAmostra({ ...formAmostra, nomeAmostra: e.target.value })}
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Classificação *</label>
                                    <select
                                        value={formAmostra.classificacaoAmostra}
                                        onChange={handleClassificacaoChange}
                                        required
                                    >
                                        <option value="peca">Peça</option>
                                        <option value="filtro">Filtro</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Subclassificação *</label>
                                    <select
                                        value={formAmostra.subclassificacaoAmostra}
                                        onChange={(e) => setFormAmostra({ ...formAmostra, subclassificacaoAmostra: e.target.value })}
                                        required
                                    >
                                        {opcoesSubclassificacao.map((op) => (
                                            <option key={op} value={op}>{op}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Papel / Situação da Amostra *</label>
                                <select
                                    value={formAmostra.situacaoAmostra}
                                    onChange={(e) => setFormAmostra({ ...formAmostra, situacaoAmostra: e.target.value })}
                                    required
                                >
                                    <option value="prova">Prova</option>
                                    <option value="contraprova">Contraprova</option>
                                    <option value="testemunha">Testemunha</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Descrição Adicional</label>
                                <textarea
                                    rows="3"
                                    placeholder="Detalhes visuais, lote, condição de recebimento..."
                                    value={formAmostra.descricao}
                                    onChange={(e) => setFormAmostra({ ...formAmostra, descricao: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalAmostraAberto(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? "Salvando..." : "Salvar Amostra"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Cadastrar Ensaio */}
            {modalEnsaioAberto && (
                <div className="modal-overlay" onClick={() => setModalEnsaioAberto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Adicionar Ensaio ao Protocolo</h3>
                            <button type="button" onClick={() => setModalEnsaioAberto(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        {erro && <div className="alert alert-error">{erro}</div>}
                        <form onSubmit={handleSalvarEnsaio}>
                            <div className="form-group">
                                <label>Tipo de Ensaio *</label>
                                <select
                                    value={formEnsaio.FK_idTipoEnsaio}
                                    onChange={(e) => {
                                        const t = tiposEnsaio.find(item => item.idTipoEnsaio === e.target.value);
                                        setFormEnsaio({
                                            ...formEnsaio,
                                            FK_idTipoEnsaio: e.target.value,
                                            nomeEnsaio: t ? t.nomeEnsaio : formEnsaio.nomeEnsaio
                                        });
                                    }}
                                    required
                                >
                                    <option value="" disabled>Selecione o tipo de ensaio técnico</option>
                                    {tiposEnsaio.map((t) => (
                                        <option key={t.idTipoEnsaio} value={t.idTipoEnsaio}>
                                            {t.nomeEnsaio} ({t.categoriaAplicavel})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Nome / Identificação do Ensaio *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Ensaio de Resistência - Lote A"
                                    value={formEnsaio.nomeEnsaio}
                                    onChange={(e) => setFormEnsaio({ ...formEnsaio, nomeEnsaio: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Papel do Ensaio *</label>
                                <select
                                    value={formEnsaio.papel}
                                    onChange={(e) => setFormEnsaio({ ...formEnsaio, papel: e.target.value })}
                                    required
                                >
                                    <option value="prova">Prova</option>
                                    <option value="contraprova">Contraprova</option>
                                    <option value="testemunha">Testemunha</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Descrição / Parâmetros Iniciais</label>
                                <textarea
                                    rows="3"
                                    placeholder="Instruções ou referências de procedimento..."
                                    value={formEnsaio.descricao}
                                    onChange={(e) => setFormEnsaio({ ...formEnsaio, descricao: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalEnsaioAberto(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? "Criando..." : "Salvar Ensaio"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Vincular Amostra ao Ensaio */}
            {modalVincularAmostraAberto && (
                <div className="modal-overlay" onClick={() => setModalVincularAmostraAberto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Adicionar Amostra ao Ensaio: {ensaioSelecionado?.nomeEnsaio}</h3>
                            <button type="button" onClick={() => setModalVincularAmostraAberto(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        {erro && <div className="alert alert-error">{erro}</div>}
                        <form onSubmit={handleVincularAmostra}>
                            <div className="form-group">
                                <label>Amostra a ensaiar (permite repetição) *</label>
                                <select
                                    value={formVinculoAmostra.FK_idAmostra}
                                    onChange={(e) => setFormVinculoAmostra({ ...formVinculoAmostra, FK_idAmostra: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Selecione a amostra</option>
                                    {amostras.map((a) => (
                                        <option key={a.idAmostra} value={a.idAmostra}>
                                            {a.codigoAmostra} - {a.nomeAmostra} ({a.subclassificacaoAmostra})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Instrumento de Medição Utilizado *</label>
                                <select
                                    value={formVinculoAmostra.FK_idInstrumento}
                                    onChange={(e) => setFormVinculoAmostra({ ...formVinculoAmostra, FK_idInstrumento: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Selecione o instrumento</option>
                                    {instrumentos.map((i) => (
                                        <option key={i.idInstrumento} value={i.idInstrumento}>
                                            {i.nomeInstrumento} ({i.funcaoInstrumento || "Geral"})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Temperatura (°C) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={formVinculoAmostra.temperatura}
                                        onChange={(e) => setFormVinculoAmostra({ ...formVinculoAmostra, temperatura: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Umidade Relativa (%) *</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        required
                                        value={formVinculoAmostra.umidade}
                                        onChange={(e) => setFormVinculoAmostra({ ...formVinculoAmostra, umidade: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Pressão Atmosférica (hPa / mbar)</label>
                                    <input
                                        type="number"
                                        step="1"
                                        value={formVinculoAmostra.pressao}
                                        onChange={(e) => setFormVinculoAmostra({ ...formVinculoAmostra, pressao: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalVincularAmostraAberto(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? "Vinculando..." : "Vincular Amostra"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Vincular Executor */}
            {modalVincularExecutorAberto && (
                <div className="modal-overlay" onClick={() => setModalVincularExecutorAberto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Associar Executor ao Ensaio</h3>
                            <button type="button" onClick={() => setModalVincularExecutorAberto(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        {erro && <div className="alert alert-error">{erro}</div>}
                        <form onSubmit={handleVincularExecutor}>
                            <div className="form-group">
                                <label>Funcionário Técnico Executor *</label>
                                <select
                                    value={formVinculoExecutor.FK_idFuncionario}
                                    onChange={(e) => setFormVinculoExecutor({ FK_idFuncionario: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Selecione o funcionário executor</option>
                                    {funcionarios.map((f) => (
                                        <option key={f.idFuncionario} value={f.idFuncionario}>
                                            {f.nomeFuncionario} {f.sobrenomeFuncionario || ''} ({f.cargo?.nomeCargo || 'Técnico'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalVincularExecutorAberto(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? "Associando..." : "Associar"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
