import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, FlaskConical, X, ChevronRight, Trash2, Info } from "lucide-react";
import { getAllProtocolos, createProtocolo, deleteProtocolo } from "../../services/protocoloService";
import { getAllEmpresas } from "../../services/amostras/empresaService";
import { getAllOcps } from "../../services/amostras/ocpService";
import { useFeedback } from "../../hooks/useFeedback";
import FeedbackModal from "../../components/modals/FeedbackModal";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function ProtocolosPage() {
    const [protocolos, setProtocolos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [ocps, setOcps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    
    // Os 6 campos na ordem do PDF:
    // 1. número (numeroProtocolo)
    // 2. data (diaAbertura)
    // 3. SEI (numeroSEI)
    // 4. tipo (tipoProtocolo: inicial, manutencao, controle_qualidade)
    // 5. fabricante/importador (FK_idEmpresa)
    // 6. OCP (FK_idOCP)
    const [formData, setFormData] = useState({
        numeroProtocolo: "",
        diaAbertura: new Date().toISOString().split("T")[0],
        numeroSEI: "",
        tipoProtocolo: "inicial",
        FK_idEmpresa: "",
        FK_idOCP: "",
        nomeProtocolo: "",
        descricao: ""
    });

    const [salvando, setSalvando] = useState(false);
    const { showSuccess, showError, feedbackProps, confirm, confirmProps } = useFeedback();

    async function carregar() {
        try {
            setLoading(true);
            const [listaProto, listaEmp, listaOcp] = await Promise.all([
                getAllProtocolos(),
                getAllEmpresas(),
                getAllOcps()
            ]);
            setProtocolos(listaProto);
            setEmpresas(listaEmp);
            setOcps(listaOcp);
        } catch (err) {
            console.error("Erro ao carregar dados de protocolos:", err);
            showError("Não foi possível carregar a lista de protocolos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const abrirModal = () => {
        setFormData({
            numeroProtocolo: "",
            diaAbertura: new Date().toISOString().split("T")[0],
            numeroSEI: "",
            tipoProtocolo: "inicial",
            FK_idEmpresa: empresas[0]?.idEmpresa || empresas[0]?.id || "",
            FK_idOCP: ocps[0]?.idOCP || ocps[0]?.id || "",
            nomeProtocolo: "",
            descricao: ""
        });
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSalvando(true);
        try {
            const payload = {
                ...formData,
                nomeProtocolo: formData.nomeProtocolo || `Protocolo ${formData.numeroProtocolo}`
            };
            await createProtocolo(payload);
            showSuccess(`Protocolo Nº ${formData.numeroProtocolo} incluído com sucesso!`);
            fecharModal();
            carregar();
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao criar protocolo.", "Falha ao Criar");
        } finally {
            setSalvando(false);
        }
    };

    const handleDelete = async (id, num) => {
        const aceito = await confirm({
            title: "Excluir Protocolo",
            message: `Deseja realmente excluir o protocolo Nº ${num}? Todos os ensaios e dados vinculados serão afetados.`,
            confirmLabel: "Excluir Protocolo",
            danger: true
        });

        if (!aceito) return;

        try {
            await deleteProtocolo(id);
            showSuccess(`Protocolo Nº ${num} excluído com sucesso!`);
            carregar();
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao excluir protocolo.", "Falha na Exclusão");
        }
    };

    const empresaMap = Object.fromEntries(empresas.map((e) => [e.idEmpresa || e.id, e.nomeEmpresa || e.nome]));
    const ocpMap = Object.fromEntries(ocps.map((o) => [o.idOCP || o.id, o.nomeOCP || o.nome]));

    const filtrados = protocolos.filter((p) =>
        (p.numeroProtocolo || "").toLowerCase().includes(busca.toLowerCase()) ||
        (p.numeroSEI || "").toLowerCase().includes(busca.toLowerCase()) ||
        (p.nomeProtocolo || "").toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Protocolos de Ensaio</h1>
                    <p>Processos de avaliação de conformidade e ensaios de EPI</p>
                </div>
                <button type="button" onClick={abrirModal} className="btn-primary">
                    <PlusCircle size={18} /> Incluir Protocolo
                </button>
            </div>

            <div className="card">
                <div className="mb-16" style={{ maxWidth: '400px', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Buscar por número, SEI ou nome..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        style={{ width: '100%', paddingLeft: '36px' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                {loading ? (
                    <p className="text-muted">Carregando protocolos...</p>
                ) : filtrados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 0' }}>
                        <FlaskConical size={40} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                        <p className="text-muted">Nenhum protocolo encontrado.</p>
                        {empresas.length === 0 || ocps.length === 0 ? (
                            <div style={{ marginTop: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '6px', background: 'var(--secondary-light)', color: 'var(--secondary)', fontSize: '0.88rem' }}>
                                <Info size={16} />
                                <span>Dica: Cadastre ao menos uma Empresa e um OCP antes de criar um protocolo.</span>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nº Protocolo</th>
                                    <th>Data Abertura</th>
                                    <th>Processo SEI</th>
                                    <th>Tipo</th>
                                    <th>Fabricante / Importador</th>
                                    <th>OCP</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map((p) => {
                                    const empNome = empresaMap[p.fkIdEmpresa || p.FK_idEmpresa] || "-";
                                    const ocpNome = ocpMap[p.fkIdOCP || p.FK_idOCP] || "-";
                                    const dataAbertura = p.diaAbertura ? new Date(p.diaAbertura).toLocaleDateString('pt-BR') : "-";

                                    return (
                                        <tr key={p.idProtocolo}>
                                            <td>
                                                <Link to={`/protocolos/${p.idProtocolo}`} style={{ fontWeight: 600, color: 'var(--secondary)' }}>
                                                    {p.numeroProtocolo}
                                                </Link>
                                            </td>
                                            <td>{dataAbertura}</td>
                                            <td>{p.numeroSEI || "-"}</td>
                                            <td>
                                                <span className={`badge ${p.tipoProtocolo === 'inicial' ? 'badge-blue' : p.tipoProtocolo === 'manutencao' ? 'badge-amber' : 'badge-purple'}`}>
                                                    {p.tipoProtocolo}
                                                </span>
                                            </td>
                                            <td>{empNome}</td>
                                            <td>{ocpNome}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                                                    <Link
                                                        to={`/protocolos/${p.idProtocolo}`}
                                                        className="btn-secondary"
                                                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                                                    >
                                                        Abrir <ChevronRight size={14} />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(p.idProtocolo, p.numeroProtocolo)}
                                                        className="btn-icon"
                                                        title="Excluir Protocolo"
                                                        style={{ color: 'var(--danger)' }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal: Incluir Protocolo (6 campos na ordem do PDF) */}
            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Incluir Protocolo</h3>
                            <button type="button" onClick={fecharModal} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* 1. Número do protocolo */}
                            <div className="form-group">
                                <label>1. Número do Protocolo *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: 2026/0014"
                                    value={formData.numeroProtocolo}
                                    onChange={(e) => setFormData({ ...formData, numeroProtocolo: e.target.value })}
                                />
                            </div>

                            {/* 2. Data */}
                            <div className="form-group">
                                <label>2. Data de Abertura *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.diaAbertura}
                                    onChange={(e) => setFormData({ ...formData, diaAbertura: e.target.value })}
                                />
                            </div>

                            {/* 3. SEI */}
                            <div className="form-group">
                                <label>3. Processo SEI *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: 19975.000123/2026-45"
                                    value={formData.numeroSEI}
                                    onChange={(e) => setFormData({ ...formData, numeroSEI: e.target.value })}
                                />
                            </div>

                            {/* 4. Tipo */}
                            <div className="form-group">
                                <label>4. Tipo de Processo *</label>
                                <select
                                    value={formData.tipoProtocolo}
                                    onChange={(e) => setFormData({ ...formData, tipoProtocolo: e.target.value })}
                                    required
                                >
                                    <option value="inicial">Inicial (Certificação)</option>
                                    <option value="manutencao">Manutenção periódica</option>
                                    <option value="controle_qualidade">Controle de qualidade</option>
                                </select>
                            </div>

                            {/* 5. Fabricante/Importador */}
                            <div className="form-group">
                                <label>5. Fabricante / Importador (Empresa) *</label>
                                <select
                                    value={formData.FK_idEmpresa}
                                    onChange={(e) => setFormData({ ...formData, FK_idEmpresa: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Selecione a empresa</option>
                                    {empresas.map((emp) => (
                                        <option key={emp.idEmpresa || emp.id} value={emp.idEmpresa || emp.id}>
                                            {emp.nomeEmpresa || emp.nome} {emp.cnpj ? `(${emp.cnpj})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 6. OCP */}
                            <div className="form-group">
                                <label>6. Organismo de Certificação (OCP) *</label>
                                <select
                                    value={formData.FK_idOCP}
                                    onChange={(e) => setFormData({ ...formData, FK_idOCP: e.target.value })}
                                    required
                                >
                                    <option value="" disabled>Selecione o OCP</option>
                                    {ocps.map((ocp) => (
                                        <option key={ocp.idOCP || ocp.id} value={ocp.idOCP || ocp.id}>
                                            {ocp.nomeOCP || ocp.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={fecharModal} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? "Criando..." : "Criar Protocolo"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modais Globais de Feedback e Confirmação */}
            <FeedbackModal {...feedbackProps} />
            <ConfirmModal {...confirmProps} />
        </div>
    );
}
