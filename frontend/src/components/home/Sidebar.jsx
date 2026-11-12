import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
    Menu, 
    LogOut, 
    House, 
    Microscope, 
    FlaskConical, 
    Factory, 
    Shield, 
    SquareText, 
    Users, 
    User,
    Layers,
    X 
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function SideBar() {
    const [isOpen, setIsOpen] = useState(true);
    const { user, logout } = useAuth();

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    const nivelPermissao = user?.cargo?.nivelPermissao;

    return (
        <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
            <div className="sidebar-header">
                {isOpen && <h2>Lab EPIs</h2>}
                <button 
                    className="sidebar-toggle-btn" 
                    onClick={toggleIsOpen} 
                    type="button"
                    title={isOpen ? "Recolher menu" : "Expandir menu"}
                >
                    {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/" end title="Início">
                            <House size={20} />
                            {isOpen && <span>Início</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/protocolos" title="Protocolos">
                            <FlaskConical size={20} />
                            {isOpen && <span>Protocolos</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/instrumentos" title="Instrumentos">
                            <Microscope size={20} />
                            {isOpen && <span>Instrumentos</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/tipos-ensaio" title="Tipos de Ensaio">
                            <Layers size={20} />
                            {isOpen && <span>Tipos de Ensaio</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/ocps" title="OCPs">
                            <Shield size={20} />
                            {isOpen && <span>OCPs</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/empresas" title="Empresas">
                            <Factory size={20} />
                            {isOpen && <span>Empresas</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/relatorios" title="Relatórios">
                            <SquareText size={20} />
                            {isOpen && <span>Relatórios</span>}
                        </NavLink>
                    </li>

                    {/* Exibido para Administrador */}
                    {nivelPermissao === 'administrador' && (
                        <li>
                            <NavLink to="/usuarios" title="Funcionários">
                                <Users size={20} />
                                {isOpen && <span>Funcionários</span>}
                            </NavLink>
                        </li>
                    )}

                    <li>
                        <NavLink to="/profile" title="Meu Perfil">
                            <User size={20} />
                            {isOpen && <span>Meu Perfil</span>}
                        </NavLink>
                    </li>

                    <li>
                        <button type="button" onClick={logout} className="logout-btn" title="Sair do sistema">
                            <LogOut size={20} />
                            {isOpen && <span>Sair</span>}
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
