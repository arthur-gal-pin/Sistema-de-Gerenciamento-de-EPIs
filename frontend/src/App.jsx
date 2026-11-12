import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

// Páginas
import LoginPage from "./pages/Profiles/LoginPage";
import NoLoginPage from "./pages/Profiles/NoLoginPage";
import HomePage from "./pages/HomePage";
import ProtocolosPage from "./pages/Ensaios/ProtocolosPage";
import ProtocoloDetalhePage from "./pages/Ensaios/ProtocoloDetalhePage";
import RegistroEnsaioPage from "./pages/Ensaios/RegistroEnsaioPage";
import InstrumentosPage from "./pages/Amostras/InstrumentosPage";
import TiposEnsaioPage from "./pages/Ensaios/TiposEnsaioPage";
import OcpsPage from "./pages/Amostras/OcpsPage";
import EmpresasPage from "./pages/Amostras/EmpresasPage";
import RelatoriosPage from "./pages/RelatoriosPage";
import ProfilePage from "./pages/Profiles/ProfilePage";
import UsuariosPage from "./pages/Profiles/UsuariosPage";
import NotFoundPage from "./pages/NotFoundPage";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/no-login" element={<NoLoginPage />} />

            {/* Rotas Autenticadas compartilhando o AppLayout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/protocolos" element={<ProtocolosPage />} />
                <Route path="/protocolos/:id" element={<ProtocoloDetalhePage />} />
                <Route path="/ensaios/:id/registro" element={<RegistroEnsaioPage />} />
                <Route path="/instrumentos" element={<InstrumentosPage />} />
                <Route path="/tipos-ensaio" element={<TiposEnsaioPage />} />
                <Route path="/ocps" element={<OcpsPage />} />
                <Route path="/empresas" element={<EmpresasPage />} />
                <Route path="/relatorios" element={<RelatoriosPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Rota restrita a administradores */}
                <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
                  <Route path="/usuarios" element={<UsuariosPage />} />
                </Route>
              </Route>
            </Route>

            {/* Fallback 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
