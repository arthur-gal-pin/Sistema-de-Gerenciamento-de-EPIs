import { useEffect, useState } from "react";
import { PlusCircle, Search, Edit2, Trash2, X, Users, Phone, ShieldCheck, UserCheck } from "lucide-react";
import { 
    getAllFuncionarios, 
    createFuncionario, 
    updateFuncionario, 
    deleteFuncionario, 
    getAllCargos,
    createTelefone 
} from "../../services/funcionarioService";

export default function UsuariosPage() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [modalAberto, setModalAberto] = useState(false);
    const [modalTelefoneAberto, setModalTelefoneAberto] = useState(false);
    const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

    // Form cadastro
    const [formData, setFormData] = useState({
        nomeFuncionario: "",
        sobrenomeFuncionario: "",
        cpf: "",
        email: "",
        senha: "",
        fkIdCargo: "",
        telefoneInicial: ""
    });

    const [novoTelefone, setNovoTelefone] = useState({
        numeroTelefone: "",
        tipoTelefone: "celular"
    });

    const [erro, setErro] = useState(null);
    const [salvando, setSalvando] = useState(false);

    async function carregar() {
        try {
            setLoading(true);
            const [funcs, listaCargos] = await Promise.all([
                getAllFuncionarios(),
                getAllCargos()
            ]);
            setFuncionarios(funcs);
            setCargos(listaCargos);
        } catch (err) {
            console.error("Erro ao carregar funcionários:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const formatarCPF = (valor) => {
        valor = valor.replace(/\D/g, "");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
        valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        return valor;
    };

    const abrirModalNovo = () => {
        setErro(null);
        setFormData({
            nomeFuncionario: "",
            sobrenomeFuncionario: "",
            cpf: "",
            email: "",
            senha: "",
            fkIdCargo: cargos[0]?.idCargo || "",
            telefoneInicial: ""
        });
        setModalAberto(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(null);
        setSalvando(true);
        try {
            const form = new FormData();
            form.append("nomeFuncionario", formData.nomeFuncionario);
            form.append("sobrenomeFuncionario", formData.sobrenomeFuncionario);
            form.append("cpf", formData.cpf.replace(/\D/g, ""));
            form.append("email", formData.email);
            form.append("senha", formData.senha);
            form.append("fkIdCargo", formData.fkIdCargo);

            const res = await createFuncionario(form);

            // Se digitou telefone inicial, adiciona
            if (formData.telefoneInicial && res?.data?.idFuncionario) {
                await createTelefone({
                    FK_idFuncionario: res.data.idFuncionario,
                    numeroTelefone: formData.telefoneInicial,
                    tipoTelefone: "celular"
                }).catch(() => null);
            }

            setModalAberto(false);
            carregar();
        } catch (err) {
            setErro(err.response?.data?.message || "Erro ao criar funcionário.");
        } finally {
            setSalvando(false);
        }
    };

    const handleDelete = async (id, nome) => {
        if (!window.confirm(`Deseja realmente excluir o funcionário "${nome}"?`)) return;
        try {
            await deleteFuncionario(id);
            carregar();
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao excluir funcionário.");
        }
    };

    const handleAdicionarTelefone = async (e) => {
        e.preventDefault();
        if (!funcionarioSelecionado) return;
        setSalvando(true);
        try {
            await createTelefone({
                FK_idFuncionario: funcionarioSelecionado.idFuncionario,
                numeroTelefone: novoTelefone.numeroTelefone,
                tipoTelefone: novoTelefone.tipoTelefone
            });
            setModalTelefoneAberto(false);
            setNovoTelefone({ numeroTelefone: "", tipoTelefone: "celular" });
            carregar();
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao salvar telefone.");
        } finally {
            setSalvando(false);
        }
    };

    const filtrados = funcionarios.filter((f) =>
        `${f.nomeFuncionario} ${f.sobrenomeFuncionario || ''}`.toLowerCase().includes(busca.toLowerCase()) ||
        (f.email || "").toLowerCase().includes(busca.toLowerCase()) ||
        (f.cpf || "").includes(busca)
    );

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Gestão de Funcionários</h1>
                    <p>Controle de usuários, níveis de permissão e acessos ao laboratório</p>
                </div>
                <button type="button" onClick={abrirModalNovo} className="btn-primary">
                    <PlusCircle size={18} /> Novo Funcionário
                </button>
            </div>

            <div className="card">
                <div className="mb-16" style={{ maxWidth: '380px', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nome, e-mail ou CPF..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        style={{ width: '100%', paddingLeft: '36px' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                </div>

                {loading ? (
                    <p className="text-muted">Carregando funcionários...</p>
                ) : filtrados.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 0' }}>
                        <Users size={40} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                        <p className="text-muted">Nenhum funcionário encontrado.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nome Completo</th>
                                    <th>CPF</th>
                                    <th>E-mail</th>
                                    <th>Cargo</th>
                                    <th>Nível</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrados.map((func) => (
                                    <tr key={func.idFuncionario}>
                                        <td>
                                            <strong>{func.nomeFuncionario} {func.sobrenomeFuncionario}</strong>
                                        </td>
                                        <td>{func.cpf}</td>
                                        <td>{func.email}</td>
                                        <td>{func.cargo?.nomeCargo || "Não definido"}</td>
                                        <td>
                                            <span className={`badge ${func.cargo?.nivelPermissao === 'administrador' ? 'badge-red' : func.cargo?.nivelPermissao === 'coordenador' ? 'badge-amber' : 'badge-blue'}`}>
                                                {func.cargo?.nivelPermissao || "funcionario"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${func.situacaoEmpregaticia === 'ativo' ? 'badge-green' : 'badge-gray'}`}>
                                                {func.situacaoEmpregaticia || 'ativo'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFuncionarioSelecionado(func);
                                                        setModalTelefoneAberto(true);
                                                    }}
                                                    className="btn-icon"
                                                    title="Adicionar Telefone"
                                                >
                                                    <Phone size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(func.idFuncionario, func.nomeFuncionario)}
                                                    className="btn-icon"
                                                    title="Excluir"
                                                    style={{ color: 'var(--danger)' }}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Novo Funcionário */}
            {modalAberto && (
                <div className="modal-overlay" onClick={() => setModalAberto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Cadastrar Novo Funcionário</h3>
                            <button type="button" onClick={() => setModalAberto(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>

                        {erro && <div className="alert alert-error">{erro}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nome *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ex: Carlos"
                                        value={formData.nomeFuncionario}
                                        onChange={(e) => setFormData({ ...formData, nomeFuncionario: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Sobrenome</label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Silveira"
                                        value={formData.sobrenomeFuncionario}
                                        onChange={(e) => setFormData({ ...formData, sobrenomeFuncionario: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>CPF *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        value={formData.cpf}
                                        onChange={(e) => setFormData({ ...formData, cpf: formatarCPF(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>E-mail *</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="carlos@fundacentro.gov.br"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Senha Inicial de Acesso *</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Mínimo 8 caracteres"
                                        value={formData.senha}
                                        onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cargo / Permissão *</label>
                                    <select
                                        value={formData.fkIdCargo}
                                        onChange={(e) => setFormData({ ...formData, fkIdCargo: e.target.value })}
                                        required
                                    >
                                        <option value="" disabled>Selecione o cargo</option>
                                        {cargos.map((c) => (
                                            <option key={c.idCargo} value={c.idCargo}>
                                                {c.nomeCargo} ({c.nivelPermissao})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Telefone Celular de Contato</label>
                                <input
                                    type="text"
                                    placeholder="(11) 90000-0000"
                                    value={formData.telefoneInicial}
                                    onChange={(e) => setFormData({ ...formData, telefoneInicial: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalAberto(false)} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? "Cadastrando..." : "Cadastrar Funcionário"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Telefone */}
            {modalTelefoneAberto && (
                <div className="modal-overlay" onClick={() => setModalTelefoneAberto(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Adicionar Telefone para {funcionarioSelecionado?.nomeFuncionario}</h3>
                            <button type="button" onClick={() => setModalTelefoneAberto(false)} className="modal-close-btn">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdicionarTelefone}>
                            <div className="form-group">
                                <label>Número do Telefone *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="(11) 98765-4321"
                                    value={novoTelefone.numeroTelefone}
                                    onChange={(e) => setNovoTelefone({ ...novoTelefone, numeroTelefone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Tipo de Telefone *</label>
                                <select
                                    value={novoTelefone.tipoTelefone}
                                    onChange={(e) => setNovoTelefone({ ...novoTelefone, tipoTelefone: e.target.value })}
                                >
                                    <option value="celular">Celular</option>
                                    <option value="fixo">Fixo</option>
                                    <option value="comercial">Comercial</option>
                                </select>
                            </div>
                            <div className="modal-footer">
                                <button type="button" onClick={() => setModalTelefoneAberto(false)} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary" disabled={salvando}>
                                    {salvando ? "Salvando..." : "Salvar Telefone"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
