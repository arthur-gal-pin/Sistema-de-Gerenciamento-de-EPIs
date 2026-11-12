import { createContext, useState, useEffect } from "react";
import { loginService, meService, logoutService } from "../services/auth/loginService";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function carregarSessao() {
        try {
            const dados = await meService();
            setUser(dados.data || dados.usuario || dados);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarSessao();
    }, []);

    async function login(cpf, senha) {
        await loginService(cpf, senha);
        // O back responde apenas { message } no login, portanto buscamos o perfil para alimentar a sessão
        const perfil = await meService();
        setUser(perfil.data || perfil.usuario || perfil);
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
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading, carregarSessao }}>
            {children}
        </AuthContext.Provider>
    );
}
