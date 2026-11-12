import { useState, useEffect, useRef } from "react";
import { User, Lock, Camera, Trash2, Save, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import avatarPadrao from "../../assets/avatar_generico.png";
import { 
    getMeuPerfil, 
    updatePerfilInfo, 
    updatePerfilPassword, 
    updatePerfilPfp, 
    removePerfilPfp 
} from "../../services/profileService";
import { API_BASE_URL } from "../../services/api";

export default function ProfilePage() {
    const { user, carregarSessao } = useAuth();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form dados pessoais
    const [formInfo, setFormInfo] = useState({ novoNome: "", novoSobrenome: "", novoEmail: "" });
    const [salvandoInfo, setSalvandoInfo] = useState(false);
    const [sucessoInfo, setSucessoInfo] = useState(null);
    const [erroInfo, setErroInfo] = useState(null);

    // Form senha
    const [formSenha, setFormSenha] = useState({ senhaInformada: "", senhaNova: "", confirmaSenha: "" });
    const [salvandoSenha, setSalvandoSenha] = useState(false);
    const [sucessoSenha, setSucessoSenha] = useState(null);
    const [erroSenha, setErroSenha] = useState(null);

    // Foto
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const fileInputRef = useRef(null);

    async function carregar() {
        try {
            setLoading(true);
            const dados = await getMeuPerfil();
            setPerfil(dados);
            setFormInfo({
                novoNome: dados?.nomeFuncionario || "",
                novoSobrenome: dados?.sobrenomeFuncionario || "",
                novoEmail: dados?.email || ""
            });
        } catch (err) {
            console.error("Erro ao carregar perfil:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, []);

    const handleSalvarInfo = async (e) => {
        e.preventDefault();
        setErroInfo(null);
        setSucessoInfo(null);
        setSalvandoInfo(true);
        try {
            await updatePerfilInfo(formInfo);
            setSucessoInfo("Informações cadastrais atualizadas com sucesso!");
            await carregarSessao();
            carregar();
        } catch (err) {
            setErroInfo(err.response?.data?.message || "Erro ao atualizar informações.");
        } finally {
            setSalvandoInfo(false);
        }
    };

    const handleSalvarSenha = async (e) => {
        e.preventDefault();
        setErroSenha(null);
        setSucessoSenha(null);

        if (formSenha.senhaNova !== formSenha.confirmaSenha) {
            setErroSenha("A nova senha e a confirmação não coincidem.");
            return;
        }

        setSalvandoSenha(true);
        try {
            await updatePerfilPassword({
                senhaInformada: formSenha.senhaInformada,
                senhaNova: formSenha.senhaNova
            });
            setSucessoSenha("Senha alterada com sucesso!");
            setFormSenha({ senhaInformada: "", senhaNova: "", confirmaSenha: "" });
        } catch (err) {
            setErroSenha(err.response?.data?.message || "Erro ao alterar senha.");
        } finally {
            setSalvandoSenha(false);
        }
    };

    const handleUploadFoto = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setUploadingFoto(true);
        try {
            await updatePerfilPfp(formData);
            await carregarSessao();
            carregar();
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao enviar imagem de perfil.");
        } finally {
            setUploadingFoto(false);
        }
    };

    const handleRemoverFoto = async () => {
        if (!window.confirm("Deseja remover sua foto de perfil?")) return;
        setUploadingFoto(true);
        try {
            await removePerfilPfp();
            await carregarSessao();
            carregar();
        } catch (err) {
            alert(err.response?.data?.message || "Erro ao remover imagem.");
        } finally {
            setUploadingFoto(false);
        }
    };

    const fotoUrl = perfil?.caminhoImagemPerfil
        ? (perfil.caminhoImagemPerfil.startsWith("http")
            ? perfil.caminhoImagemPerfil
            : `${API_BASE_URL}/${perfil.caminhoImagemPerfil}`)
        : avatarPadrao;

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Meu Perfil</h1>
                    <p>Gerencie seus dados pessoais, credenciais de acesso e foto</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'flex-start' }}>
                {/* Cartão de Foto e Resumo */}
                <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                        <img
                            src={fotoUrl}
                            alt="Foto do Usuário"
                            style={{
                                width: '130px',
                                height: '130px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid var(--border)',
                                boxShadow: 'var(--shadow-md)'
                            }}
                            onError={(e) => { e.target.src = avatarPadrao; }}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                position: 'absolute',
                                bottom: '4px',
                                right: '4px',
                                backgroundColor: 'var(--primary)',
                                color: '#fff',
                                border: '2px solid #fff',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                            title="Trocar foto"
                            disabled={uploadingFoto}
                        >
                            <Camera size={18} />
                        </button>
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleUploadFoto}
                    />

                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                        {perfil?.nomeFuncionario} {perfil?.sobrenomeFuncionario}
                    </h3>
                    <p className="badge badge-blue mb-12">
                        {perfil?.cargo?.nomeCargo || 'Técnico de Laboratório'}
                    </p>

                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                        <strong>CPF:</strong> {perfil?.cpf || "-"}
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                        <strong>Permissão:</strong> {perfil?.cargo?.nivelPermissao || "funcionario"}
                    </p>

                    {perfil?.caminhoImagemPerfil && (
                        <button
                            type="button"
                            onClick={handleRemoverFoto}
                            className="btn-link text-danger mt-12"
                            style={{ fontSize: '0.82rem' }}
                            disabled={uploadingFoto}
                        >
                            <Trash2 size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            Remover foto
                        </button>
                    )}
                </div>

                {/* Formulários de Alteração */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Dados Pessoais */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <User size={20} /> Informações Pessoais
                        </h3>

                        {sucessoInfo && <div className="alert alert-success">{sucessoInfo}</div>}
                        {erroInfo && <div className="alert alert-error">{erroInfo}</div>}

                        <form onSubmit={handleSalvarInfo}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nome *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formInfo.novoNome}
                                        onChange={(e) => setFormInfo({ ...formInfo, novoNome: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Sobrenome</label>
                                    <input
                                        type="text"
                                        value={formInfo.novoSobrenome}
                                        onChange={(e) => setFormInfo({ ...formInfo, novoSobrenome: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>E-mail *</label>
                                <input
                                    type="email"
                                    required
                                    value={formInfo.novoEmail}
                                    onChange={(e) => setFormInfo({ ...formInfo, novoEmail: e.target.value })}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button type="submit" className="btn-primary" disabled={salvandoInfo}>
                                    <Save size={16} /> {salvandoInfo ? "Salvando..." : "Salvar Alterações"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Troca de Senha */}
                    <div className="card">
                        <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Lock size={20} /> Alterar Senha de Acesso
                        </h3>

                        {sucessoSenha && <div className="alert alert-success">{sucessoSenha}</div>}
                        {erroSenha && <div className="alert alert-error">{erroSenha}</div>}

                        <form onSubmit={handleSalvarSenha}>
                            <div className="form-group">
                                <label>Senha Atual *</label>
                                <input
                                    type="password"
                                    required
                                    placeholder="Digite sua senha atual"
                                    value={formSenha.senhaInformada}
                                    onChange={(e) => setFormSenha({ ...formSenha, senhaInformada: e.target.value })}
                                />
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Nova Senha *</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Mínimo 8 caracteres"
                                        value={formSenha.senhaNova}
                                        onChange={(e) => setFormSenha({ ...formSenha, senhaNova: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Confirmar Nova Senha *</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Repita a nova senha"
                                        value={formSenha.confirmaSenha}
                                        onChange={(e) => setFormSenha({ ...formSenha, confirmaSenha: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                                <button type="submit" className="btn-primary" disabled={salvandoSenha}>
                                    <Lock size={16} /> {salvandoSenha ? "Alterando..." : "Atualizar Senha"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
