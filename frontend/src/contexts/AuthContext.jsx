import { createContext, useState, useEffect } from "react";
import { loginService, meService, logoutService } from "../services/authService";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarSessao() {
            try {
                // Tenta buscar o perfil do usuário logado via cookie
                const dados = await meService();
                setUser(dados.usuario || dados);
            } catch (error) {
                // Se der erro 401/403, significa que o cookie não existe ou expirou
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        carregarSessao();
    }, []);

    async function login(cpf, senha) {
        const dados = await loginService(cpf, senha);
        setUser(dados.usuario || dados);
    }

    async function logout() {
        try {
            await logoutService();
        } catch (error) {
            console.error("Erro ao encerrar sessão:", error);
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}