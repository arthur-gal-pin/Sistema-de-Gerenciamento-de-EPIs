import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Exibe loader enquanto valida a sessão
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '12px' }}>
        <div className="spinner" />
        <p>Carregando sessão...</p>
      </div>
    );
  }

  // 2. Se não autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const nivelPermissao = user?.cargo?.nivelPermissao;

  if (allowedRoles && !allowedRoles.includes(nivelPermissao)) {
    return <Navigate to="/" replace />;
  }

  // 3. Renderiza as rotas filhas
  return <Outlet />;
}
