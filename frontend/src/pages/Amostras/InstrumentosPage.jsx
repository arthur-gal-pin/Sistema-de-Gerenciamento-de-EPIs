import { useEffect, useState } from "react";
import { PlusCircle, Search, Edit2, Trash2, X, Microscope } from "lucide-react";
import { getAllInstrumentos, createInstrumento, updateInstrumento, deleteInstrumento } from "../../services/instrumentoService";
import { useFeedback } from "../../hooks/useFeedback";
import FeedbackModal from "../../components/modals/FeedbackModal";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function InstrumentosPage() {
    const [instrumentos, setInstrumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [instEditando, setInstEditando] = useState(null);
    const [formData, setFormData] = useState({
        nomeInstrumento: "",
        funcaoInstrumento: "",
        ultimaCalibracao: new Date().toISOString().split("T")[0]
    });
    const [salvando, setSalvando] = useState(false);

    const { showSuccess, showError, feedbackProps, confirm, confirmProps } = useFeedback();

    async function carregar() {
        try {
            setLoading(true);
            const data = await getAllInstrumentos();
            setInstrumentos(data);
        } catch (err) {
            console.error("Erro ao carregar instrumentos:", err);
            showError("Não foi possível carregar a lista de instrumentos.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const abrirModal = (inst = null) => {
        if (inst) {
            setInstEditando(inst);
            const dataIso = inst.ultimaCalibracao ? new Date(inst.ultimaCalibracao).toISOString().split("T")[0] : "";
            setFormData({
                nomeInstrumento: inst.nomeInstrumento || "",
                funcaoInstrumento: inst.funcaoInstrumento || "",
                ultimaCalibracao: dataIso
            });
        } else {
            setInstEditando(null);
            setFormData({
                nomeInstrumento: "",
                funcaoInstrumento: "",
                ultimaCalibracao: new Date().toISOString().split("T")[0]
            });
        }
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setInstEditando(null);
        setFormData({
            nomeInstrumento: "",
            funcaoInstrumento: "",
            ultimaCalibracao: new Date().toISOString().split("T")[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSalvando(true);
        try {
            if (instEditando) {
                await updateInstrumento(instEditando.idInstrumento, formData);
                showSuccess("Instrumento atualizado com sucesso!");
            } else {
                await createInstrumento(formData);
                showSuccess("Instrumento cadastrado com sucesso!");
            }
            fecharModal();
            carregar();
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao salvar instrumento.", "Falha ao Salvar");
        } finally {
            setSalvando(false);
        }
    };

    const handleDelete = async (id, nome) => {
        const aceito = await confirm({
            title: "Excluir Instrumento",
            message: `Deseja realmente excluir o instrumento "${nome}"?`,
            confirmLabel: "Excluir Instrumento",
            danger: true
        });

        if (!aceito) return;

        try {
            await deleteInstrumento(id);
            showSuccess(`Instrumento "${nome}" excluído com sucesso!`);
            carregar();
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao excluir instrumento.", "Falha na Exclusão");
        }
    };

    const filtrados = instrumentos.filter((inst) =>
        (inst.nomeInstrumento || "").toLowerCase().includes(busca.toLowerCase()) ||
        (inst.funcaoInstrumento || "").toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Instrumentos de Medição e Ensaio</h1>
                    <p>Controle de calibração e equipamentos do laboratório</p>
                </div>
                <button type="button" onClick={() => abrirModal()} className="btn-primary">
                    <PlusCircle size={18} /> Novo Instrumento
                </button>
            </div>

            <div className="card">
                <div className="mb-16" style={{ maxWidth: '380px', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou função..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        style={{ width: '100%', paddingLeft: '36px' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                {loading ? (
                    <p className="text-muted">Carregando instrumentos...</p>
                ) : filtrados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 0' }}>
                        <Microscope size={40} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                        <p className="text-muted">Nenhum instrumento cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nome do Instrumento</th>
                                    <th>Função / Aplicação</th>
                                    <th>Última Calibração</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map((inst) => {
                                    const calibDate = inst.ultimaCalibracao ? new Date(inst.ultimaCalibracao) : null;
                                    const agora = new Date();
                                    const mesesAtras = calibDate ? (agora.getFullYear() - calibDate.getFullYear()) * 12 + (agora.getMonth() - calibDate.getMonth()) : 0;
                                    const emDia = mesesAtras < 12;

                                    return (
                                        <tr key={inst.idInstrumento}>
                                            <td><strong>{inst.nomeInstrumento}</strong></td>
                                            <td>{inst.funcaoInstrumento || "Geral"}</td>
                                            <td>{calibDate ? calibDate.toLocaleDateString("pt-BR") : "-"}</td>
                                            <td>
                                                <span className={`badge ${emDia ? 'badge-green' : 'badge-amber'}`}>
                                                    {emDia ? 'Calibrado' : 'Revisão Recomendada'}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirModal(inst)}
                                                        className="btn-icon"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(inst.idInstrumento, inst.nomeInstrumento)}
                                                        className="btn-icon"
                                                        title="Excluir"
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

            {/* Modal */}
            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{instEditando ? "Editar Instrumento" : "Cadastrar Novo Instrumento"}</h3>
                            <button type="button" onClick={fecharModal} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nome do Instrumento *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Manômetro Digital M-04"
                                    value={formData.nomeInstrumento}
                                    onChange={(e) => setFormData({ ...formData, nomeInstrumento: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Função / Aplicação</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Medição de perda de carga / resistência à respiração"
                                    value={formData.funcaoInstrumento}
                                    onChange={(e) => setFormData({ ...formData, funcaoInstrumento: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label>Data da Última Calibração *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.ultimaCalibracao}
                                    onChange={(e) => setFormData({ ...formData, ultimaCalibracao: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={fecharModal} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? "Salvando..." : "Salvar Instrumento"}
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
