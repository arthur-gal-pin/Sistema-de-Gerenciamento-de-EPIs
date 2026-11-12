import { useEffect, useState } from "react";
import { PlusCircle, Search, Edit2, Trash2, X, Shield } from "lucide-react";
import { getAllOcps, createOcp, updateOcp, deleteOcp } from "../../services/amostras/ocpService";
import { useFeedback } from "../../hooks/useFeedback";
import FeedbackModal from "../../components/modals/FeedbackModal";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function OcpsPage() {
    const [ocps, setOcps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [ocpEditando, setOcpEditando] = useState(null);
    const [nomeOCP, setNomeOCP] = useState("");
    const [salvando, setSalvando] = useState(false);

    const { showSuccess, showError, feedbackProps, confirm, confirmProps } = useFeedback();

    async function carregar() {
        try {
            setLoading(true);
            const data = await getAllOcps();
            setOcps(data);
        } catch (err) {
            console.error("Erro ao carregar OCPs:", err);
            showError("Não foi possível carregar a lista de OCPs.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const abrirModal = (ocp = null) => {
        if (ocp) {
            setOcpEditando(ocp);
            setNomeOCP(ocp.nomeOCP || ocp.nome || "");
        } else {
            setOcpEditando(null);
            setNomeOCP("");
        }
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setOcpEditando(null);
        setNomeOCP("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSalvando(true);
        try {
            if (ocpEditando) {
                await updateOcp(ocpEditando.idOCP || ocpEditando.id, nomeOCP);
                showSuccess("OCP atualizado com sucesso!");
            } else {
                await createOcp(nomeOCP);
                showSuccess("OCP cadastrado com sucesso!");
            }
            fecharModal();
            carregar();
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao salvar OCP.", "Falha ao Salvar");
        } finally {
            setSalvando(false);
        }
    };

    const handleDelete = async (id, nome) => {
        const aceito = await confirm({
            title: "Excluir OCP",
            message: `Deseja realmente excluir o OCP "${nome}"?`,
            confirmLabel: "Excluir OCP",
            danger: true
        });

        if (!aceito) return;

        try {
            await deleteOcp(id);
            showSuccess(`OCP "${nome}" excluído com sucesso!`);
            carregar();
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao excluir OCP.", "Falha na Exclusão");
        }
    };

    const filtrados = ocps.filter((ocp) =>
        (ocp.nomeOCP || ocp.nome || "").toLowerCase().includes(busca.toLowerCase())
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Organismos de Certificação de Produtos (OCPs)</h1>
                    <p>Cadastro de entidades certificadoras acreditadas pelo Inmetro</p>
                </div>
                <button type="button" onClick={() => abrirModal()} className="btn-primary">
                    <PlusCircle size={18} /> Novo OCP
                </button>
            </div>

            <div className="card">
                <div className="mb-16" style={{ maxWidth: '380px', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nome do OCP..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        style={{ width: '100%', paddingLeft: '36px' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                {loading ? (
                    <p className="text-muted">Carregando OCPs...</p>
                ) : filtrados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 0' }}>
                        <Shield size={40} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                        <p className="text-muted">Nenhum OCP cadastrado ainda.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nome do Organismo de Certificação</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map((ocp) => {
                                    const id = ocp.idOCP || ocp.id;
                                    const nome = ocp.nomeOCP || ocp.nome;
                                    return (
                                        <tr key={id}>
                                            <td><strong>{nome}</strong></td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirModal(ocp)}
                                                        className="btn-icon"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(id, nome)}
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
                            <h3>{ocpEditando ? "Editar OCP" : "Cadastrar Novo OCP"}</h3>
                            <button type="button" onClick={fecharModal} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nome do OCP *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: OCP 0004 - Falcão Bauer"
                                    value={nomeOCP}
                                    onChange={(e) => setNomeOCP(e.target.value)}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={fecharModal} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? "Salvando..." : "Salvar OCP"}
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
