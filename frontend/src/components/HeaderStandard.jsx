import { LogOut } from "lucide-react";
import avatarPadrao from "../assets/avatar_generico.png";
import SetaVoltar from "./SetaVoltar";
import { meService } from "../services/auth/loginService";
import { useEffect, useState } from "react";

export default function HeaderStandard() {
    const [usuario, setUsuario] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarUsuário() {
            try {
                const dados = await meService();
                if (!dados || dados === undefined) {
                    return;
                }
                setUsuario(dados.data.data);

            } catch (error) {
                setMensagemError(error);
                alert(`Ops, ocorreu um erro! Erro: ${mensagemError}`);
            } finally {
                setLoading(false);
            }
        }
        carregarUsuário();
    }, [])

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