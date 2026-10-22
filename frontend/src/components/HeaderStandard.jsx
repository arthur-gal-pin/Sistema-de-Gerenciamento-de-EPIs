import { LogOut } from "lucide-react";
import avatarPadrao from "../assets/avatar_generico.png";
import SetaVoltar from "./SetaVoltar";
import { useAuth } from "../hooks/useAuth";

export default function HeaderStandard() {
    const { user: usuario, loading } = useAuth();
    return (
        <div>
            <SetaVoltar />
            <header>
                <nav className="nav-link">
                    <a href="/profile">
                        <div className="cardUsuario">
                            <img
                                src={usuario?.caminhoImagemPerfil || avatarPadrao}
                                alt="Foto de Perfil"
                                width="30"
                                height="30"
                            />
                            <h3>Olá <strong>{loading ? 'Carregando...' : usuario?.nomeFuncionario}</strong></h3>
                            <h5>Cargo: {usuario?.cargo?.nomeCargo || 'Não informado.'}</h5>
                        </div>
                    </a>

                    <a href="/logout">
                        <LogOut size={30} />
                    </a>
                </nav>
            </header>
        </div>
    );
}