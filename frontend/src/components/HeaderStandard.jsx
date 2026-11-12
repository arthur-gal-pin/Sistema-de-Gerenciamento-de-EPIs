import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import avatarPadrao from "../assets/avatar_generico.png";
import SetaVoltar from "./SetaVoltar";
import { useAuth } from "../hooks/useAuth";
import { API_BASE_URL } from "../services/api";

export default function HeaderStandard() {
    const { user: usuario, loading, logout } = useAuth();
    const location = useLocation();

    const fotoUrl = usuario?.caminhoImagemPerfil
        ? (usuario.caminhoImagemPerfil.startsWith("http")
            ? usuario.caminhoImagemPerfil
            : `${API_BASE_URL}/${usuario.caminhoImagemPerfil}`)
        : avatarPadrao;

    const ehHome = location.pathname === "/" || location.pathname === "/home";

    return (
        <header className="header-standard">
            <div className="header-left">
                {!ehHome && <SetaVoltar />}
                <span style={{ fontWeight: 600, color: '#334155' }}>
                    Laboratório de Equipamentos de Proteção Individual
                </span>
            </div>

            <div className="header-right">
                <Link to="/profile" className="cardUsuario" title="Ver meu perfil">
                    <img
                        src={fotoUrl}
                        alt="Foto de Perfil"
                        onError={(e) => { e.target.src = avatarPadrao; }}
                    />
                    <div className="cardUsuario-info">
                        <h3>Olá, <strong>{loading ? 'Carregando...' : (usuario?.nomeFuncionario || 'Usuário')}</strong></h3>
                        <h5>Cargo: {usuario?.cargo?.nomeCargo || 'Não informado'}</h5>
                    </div>
                </Link>

                <button 
                    type="button" 
                    onClick={logout} 
                    className="btn-icon" 
                    title="Encerrar sessão"
                    style={{ color: '#ef4444' }}
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}
