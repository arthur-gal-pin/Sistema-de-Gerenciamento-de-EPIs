import { useEffect, useState } from "react";
import { PlusCircle, Layers, Edit2, Trash2, X, Plus, List } from "lucide-react";
import { 
    getAllTiposEnsaio, 
    createTipoEnsaio, 
    deleteTipoEnsaio, 
    getAllCamposEnsaio, 
    createCampoEnsaio, 
    deleteCampoEnsaio 
} from "../../services/tipoEnsaioService";

// 18 Tipos da Tabela 4 do PDF para carga facilitada se necessário
const TIPOS_TABELA_4 = [
    { nomeEnsaio: "Resistência à Respiração - Inalação", categoriaAplicavel: "peca", descricaoEnsaio: "Mede o fluxo contínuo de inalação a 30 e 95 L/min" },
    { nomeEnsaio: "Resistência à Respiração - Exalação", categoriaAplicavel: "peca", descricaoEnsaio: "Mede o fluxo contínuo de exalação a 160 L/min" },
    { nomeEnsaio: "Penetração de Filtro com NaCl", categoriaAplicavel: "filtro", descricaoEnsaio: "Avaliação da penetração de aerossol de cloreto de sódio" },
    { nomeEnsaio: "Penetração de Filtro com Óleo de Parafina", categoriaAplicavel: "filtro", descricaoEnsaio: "Avaliação da penetração de aerossol de óleo" },
    { nomeEnsaio: "Vazamento Total para o Interior (VTI)", categoriaAplicavel: "peca", descricaoEnsaio: "Avaliação do vazamento com usuários em esteira" },
    { nomeEnsaio: "Teor de Dióxido de Carbono no Ar Inalado", categoriaAplicavel: "peca", descricaoEnsaio: "Medição do espaço morto e acúmulo de CO2" },
    { nomeEnsaio: "Inflamabilidade", categoriaAplicavel: "peca", descricaoEnsaio: "Exposição à chama direta a 800°C" },
    { nomeEnsaio: "Resistência Mecânica dos Tirantes", categoriaAplicavel: "peca", descricaoEnsaio: "Tracionamento mecânico dos tirantes e fixadores" },
    { nomeEnsaio: "Ensaio Prático de Desempenho", categoriaAplicavel: "peca", descricaoEnsaio: "Desempenho em atividades simuladas de trabalho" },
    { nomeEnsaio: "Campo Visual", categoriaAplicavel: "peca", descricaoEnsaio: "Determinação do campo visual total e binocular" },
    { nomeEnsaio: "Capacidade de Retenção de Gases (Filtros Químicos)", categoriaAplicavel: "filtro", descricaoEnsaio: "Tempo de ruptura contra vapores específicos" }
];

export default function TiposEnsaioPage() {
    const [tipos, setTipos] = useState([]);
    const [campos, setCampos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalTipoAberto, setModalTipoAberto] = useState(false);
    const [modalCampoAberto, setModalCampoAberto] = useState(false);
    const [tipoSelecionado, setTipoSelecionado] = useState(null);
    const [formTipo, setFormTipo] = useState({ nomeEnsaio: "", categoriaAplicavel: "peca", descricaoEnsaio: "" });
    const [formCampo, setFormCampo] = useState({
        FK_idTipoEnsaio: "",
        nomeCampo: "",
        tipoDado: "number",
        unidadeMedida: "mbar",
        obrigatoriedade: true,
        descricao: ""
    });
    const [erro, setErro] = useState(null);
    const [salvando, setSalvando] = useState(false);

    async function carregar() {
        try {
            setLoading(true);
            const [listaTipos, listaCampos] = await Promise.all([
                getAllTiposEnsaio(),
                getAllCamposEnsaio()
            ]);
            setTipos(listaTipos);
            setCampos(listaCampos);
        } catch (err) {
            console.error("Erro ao carregar tipos de ensaio:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const handleSalvarTipo = async (e) => {
        e.preventDefault();
        setErro(null);
        setSalvando(true);
        try {
            await createTipoEnsaio(formTipo);
            setModalTipoAberto(false);
            setFormTipo({ nomeEnsaio: "", categoriaAplicavel: "peca", descricaoEnsaio: "" });
            carregar();
        } catch (err) {
            setErro(err.response?.data?.message || "Erro ao salvar tipo de ensaio.");
        } finally {
            setSalvando(false);
        }
    };

    const handleSalvarCampo = async (e) => {
        e.preventDefault();
        setErro(null);
        setSalvando(true);
        try {
            await createCampoEnsaio(formCampo);
            setModalCampoAberto(false);
            setFormCampo({
                FK_idTipoEnsaio: "",
                nomeCampo: "",
                tipoDado: "number",
                unidadeMedida: "mbar",
                obrigatoriedade: true,
                descricao: ""
            });
            carregar();
        } catch (err) {
            setErro(err.response?.data?.message || "Erro ao salvar campo.");
        } finally {
            setSalvando(false);
        }
    };

    const handleDeleteTipo = async (id, nome) => {
        if (!window.confirm(`Excluir o tipo de ensaio "${nome}"?`)) return;
        try {
            await deleteTipoEnsaio(id);
            carregar();
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao excluir tipo de ensaio.");
        }
    };

    const handleDeleteCampo = async (id) => {
        if (!window.confirm("Excluir este campo dinâmico?")) return;
        try {
            await deleteCampoEnsaio(id);
            carregar();
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao excluir campo.");
        }
    };

    const handleCarregarTabela4 = async () => {
        if (!window.confirm("Deseja cadastrar automaticamente os tipos de ensaios padrão do laboratório?")) return;
        setSalvando(true);
        try {
            for (const t of TIPOS_TABELA_4) {
                await createTipoEnsaio(t).catch(() => null);
            }
            carregar();
        } catch (err) {
            alert("Erro ao importar modelos padrão.");
        } finally {
            setSalvando(false);
        }
    };

    const abrirModalCampoParaTipo = (tipo) => {
        setTipoSelecionado(tipo);
        setFormCampo({
            FK_idTipoEnsaio: tipo.idTipoEnsaio,
            nomeCampo: "",
            tipoDado: "number",
            unidadeMedida: "mbar",
            obrigatoriedade: true,
            descricao: ""
        });
        setModalCampoAberto(true);
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Tipos de Ensaios e Campos Dinâmicos</h1>
                    <p>Configuração dos procedimentos técnicos e variáveis coletadas nos ensaios</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {tipos.length === 0 && (
                        <button type="button" onClick={handleCarregarTabela4} className="btn-secondary" disabled={salvando}>
                            Carregar Modelos Padrão (Tabela 4)
                        </button>
                    )}
                    <button type="button" onClick={() => setModalTipoAberto(true)} className="btn-primary">
                        <PlusCircle size={18} /> Novo Tipo de Ensaio
                    </button>
                </div>
            </div>

            <div className="card">
                {loading ? (
                    <p className="text-muted">Carregando tipos de ensaio...</p>
                ) : tipos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 0' }}>
                        <Layers size={40} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                        <p className="text-muted">Nenhum tipo de ensaio cadastrado ainda.</p>
                        <button type="button" onClick={handleCarregarTabela4} className="btn-primary mt-12">
                            Carregar Modelos Padrão da Tabela 4
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {tipos.map((t) => {
                            const camposDoTipo = campos.filter((c) => c.fkIdTipoEnsaio === t.idTipoEnsaio || c.FK_idTipoEnsaio === t.idTipoEnsaio);
                            return (
                                <div key={t.idTipoEnsaio} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                                    <div className="flex-between mb-12">
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <h3 style={{ fontSize: '1.1rem' }}>{t.nomeEnsaio}</h3>
                                                <span className={`badge ${t.categoriaAplicavel === 'filtro' ? 'badge-blue' : 'badge-purple'}`}>
                                                    Aplica a: {t.categoriaAplicavel === 'filtro' ? 'Filtros' : 'Peças Faciais'}
                                                </span>
                                            </div>
                                            {t.descricaoEnsaio && <p className="text-muted" style={{ fontSize: '0.88rem', marginTop: '4px' }}>{t.descricaoEnsaio}</p>}
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => abrirModalCampoParaTipo(t)}
                                                className="btn-secondary"
                                                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                                            >
                                                <Plus size={16} /> Adicionar Campo
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteTipo(t.idTipoEnsaio, t.nomeEnsaio)}
                                                className="btn-icon"
                                                title="Excluir Tipo de Ensaio"
                                                style={{ color: 'var(--danger)' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Lista de Campos Dinâmicos */}
                                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>
                                            Campos Dinâmicos para Coleta de Resultados ({camposDoTipo.length})
                                        </div>

                                        {camposDoTipo.length === 0 ? (
                                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                                                Nenhum campo específico cadastrado para este ensaio. Clique em "Adicionar Campo" acima.
                                            </p>
                                        ) : (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {camposDoTipo.map((c) => (
                                                    <span 
                                                        key={c.idCampoEnsaio}
                                                        style={{
                                                            backgroundColor: '#fff',
                                                            border: '1px solid var(--border)',
                                                            borderRadius: '6px',
                                                            padding: '6px 10px',
                                                            fontSize: '0.85rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '8px'
                                                        }}
                                                    >
                                                        <strong>{c.nomeCampo}</strong>
                                                        <span style={{ color: 'var(--text-muted)' }}>({c.unidadeMedida || c.tipoDado})</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteCampo(c.idCampoEnsaio)}
                                                            style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: 0 }}
                                                            title="Remover campo"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal Novo Tipo de Ensaio */}
            {modalTipoAberto && (
                <div className="modal-overlay" onClick={() => setModalTipoAberto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Cadastrar Novo Tipo de Ensaio</h3>
                            <button type="button" onClick={() => setModalTipoAberto(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        {erro && <div className="alert alert-error">{erro}</div>}
                        <form onSubmit={handleSalvarTipo}>
                            <div className="form-group">
                                <label>Nome do Ensaio *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Penetração de Aerossol de NaCl"
                                    value={formTipo.nomeEnsaio}
                                    onChange={(e) => setFormTipo({ ...formTipo, nomeEnsaio: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Categoria Aplicável *</label>
                                <select
                                    value={formTipo.categoriaAplicavel}
                                    onChange={(e) => setFormTipo({ ...formTipo, categoriaAplicavel: e.target.value })}
                                    required
                                >
                                    <option value="peca">Peça Facial (Inteira, 1/4, Semifacial)</option>
                                    <option value="filtro">Filtro (Partículas, Químico, Combinado)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Descrição Técnica / Norma</label>
                                <textarea
                                    rows="3"
                                    placeholder="Procedimentos ou parâmetros de referência..."
                                    value={formTipo.descricaoEnsaio}
                                    onChange={(e) => setFormTipo({ ...formTipo, descricaoEnsaio: e.target.value })}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalTipoAberto(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Novo Campo de Ensaio */}
            {modalCampoAberto && (
                <div className="modal-overlay" onClick={() => setModalCampoAberto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Adicionar Campo Dinâmico a "{tipoSelecionado?.nomeEnsaio}"</h3>
                            <button type="button" onClick={() => setModalCampoAberto(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        {erro && <div className="alert alert-error">{erro}</div>}
                        <form onSubmit={handleSalvarCampo}>
                            <div className="form-group">
                                <label>Nome da Variável / Campo *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Perda de Pressão / Resistência"
                                    value={formCampo.nomeCampo}
                                    onChange={(e) => setFormCampo({ ...formCampo, nomeCampo: e.target.value })}
                                />
                            </div>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Tipo do Dado *</label>
                                    <select
                                        value={formCampo.tipoDado}
                                        onChange={(e) => setFormCampo({ ...formCampo, tipoDado: e.target.value })}
                                    >
                                        <option value="number">Numérico (number)</option>
                                        <option value="string">Texto (string)</option>
                                        <option value="date">Data (date)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Unidade de Medida</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: mbar, %, L/min, °C"
                                        value={formCampo.unidadeMedida}
                                        onChange={(e) => setFormCampo({ ...formCampo, unidadeMedida: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalCampoAberto(false)} className="btn-secondary">Cancelar</button>
                                <button type="submit" className="btn-primary" disabled={salvando}>{salvando ? "Salvando..." : "Adicionar Campo"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
