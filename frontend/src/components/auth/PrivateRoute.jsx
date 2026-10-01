import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../../utils/auth';

// Uso: <Route element={<PrivateRoute roles={['administrador','coordenador','funcionario']} />}> ...rotas... </Route>
export default function PrivateRoute({ roles }) {
  const session = getSession();
  if (!session) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(session.nivelPermissao)) return <Navigate to="/home" replace />;
  return <Outlet />;
}
