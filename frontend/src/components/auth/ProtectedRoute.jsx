import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Exibe o loader enquanto valida o cookie/sessão no AuthContext
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  // 2. Se não estiver autenticado, redireciona para o login guardando o destino
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role || user?.cargo?.nomeCargo;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />; // Redireciona para a Home
  }

  // 3. Renderiza as rotas filhas
  return <Outlet />;
}