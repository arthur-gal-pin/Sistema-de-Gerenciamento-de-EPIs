import { useEffect, useState } from "react";
import { PlusCircle, Search, Edit2, Trash2, X, Building2 } from "lucide-react";
import { getAllEmpresas, createEmpresa, updateEmpresa, deleteEmpresa } from "../../services/amostras/empresaService";
import { useFeedback } from "../../hooks/useFeedback";
import FeedbackModal from "../../components/modals/FeedbackModal";
import ConfirmModal from "../../components/modals/ConfirmModal";

export default function EmpresasPage() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [empresaEditando, setEmpresaEditando] = useState(null);
    const [formData, setFormData] = useState({ nomeEmpresa: "", cnpj: "", emailEmpresa: "" });
    const [salvando, setSalvando] = useState(false);

    const { showSuccess, showError, feedbackProps, confirm, confirmProps } = useFeedback();

    async function carregar() {
        try {
            setLoading(true);
            const data = await getAllEmpresas();
            setEmpresas(data);
        } catch (err) {
            console.error("Erro ao carregar empresas:", err);
            showError("Não foi possível carregar a lista de empresas.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const abrirModal = (emp = null) => {
        if (emp) {
            setEmpresaEditando(emp);
            setFormData({
                nomeEmpresa: emp.nomeEmpresa || emp.nome,
            });
        } else {
            setEmpresaEditando(null);
            setFormData({ nomeEmpresa: ""});
        }
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setEmpresaEditando(null);
        setFormData({ nomeEmpresa: ""});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSalvando(true);
        try {
            if (empresaEditando) {
                await updateEmpresa(empresaEditando.idEmpresa || empresaEditando.id, formData);
                showSuccess("Empresa atualizada com sucesso!");
            } else {
                await createEmpresa(formData);
                showSuccess("Empresa cadastrada com sucesso!");
            }
            fecharModal();
            carregar();
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao salvar empresa.", "Falha ao Salvar");
        } finally {
            setSalvando(false);
        }
    };

    const handleDelete = async (id, nome) => {
        const aceito = await confirm({
            title: "Excluir Empresa",
            message: `Deseja realmente excluir a empresa "${nome}"?`,
            confirmLabel: "Excluir Empresa",
            danger: true
        });

        if (!aceito) return;

        try {
            await deleteEmpresa(id);
            showSuccess(`Empresa "${nome}" excluída com sucesso!`);
            carregar();
        } catch (err) {
            showError(err.response?.data?.message || "Erro ao excluir empresa.", "Falha na Exclusão");
        }
    };

    const filtradas = empresas.filter((emp) =>
        (emp.nomeEmpresa || emp.nome || "").toLowerCase().includes(busca.toLowerCase()) ||
        (emp.cnpj || "").includes(busca)
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Empresas Fabricantes e Importadoras</h1>
                    <p>Cadastro e gerenciamento de fabricantes e importadores de EPIs</p>
                </div>
                <button type="button" onClick={() => abrirModal()} className="btn-primary">
                    <PlusCircle size={18} /> Nova Empresa
                </button>
            </div>

            <div className="card">
                <div className="mb-16" style={{ maxWidth: '380px', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou CNPJ..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        style={{ width: '100%', paddingLeft: '36px' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                {loading ? (
                    <p className="text-muted">Carregando empresas...</p>
                ) : filtradas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 0' }}>
                        <Building2 size={40} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                        <p className="text-muted">Nenhuma empresa encontrada.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nome / Razão Social</th>
                                    <th>CNPJ</th>
                                    <th>E-mail</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtradas.map((emp) => {
                                    const id = emp.idEmpresa || emp.id;
                                    const nome = emp.nomeEmpresa || emp.nome;
                                    return (
                                        <tr key={id}>
                                            <td><strong>{nome}</strong></td>
                                            <td>{emp.cnpj || "-"}</td>
                                            <td>{emp.emailEmpresa || "-"}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => abrirModal(emp)}
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

            {/* Modal de Formulário */}
            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{empresaEditando ? "Editar Empresa" : "Cadastrar Nova Empresa"}</h3>
                            <button type="button" onClick={fecharModal} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Nome / Razão Social *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Pro Safety Equipamentos Ltda"
                                    value={formData.nomeEmpresa}
                                    onChange={(e) => setFormData({ ...formData, nomeEmpresa: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={fecharModal} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? "Salvando..." : "Salvar Empresa"}
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
