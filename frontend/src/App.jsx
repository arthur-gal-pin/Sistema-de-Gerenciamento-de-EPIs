import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../src/pages/login"
import Cadastro from "../src/pages/cadastro"
import Home from "./pages/Home"
import Amostras from "./pages/Amostras"
import ProfilePage from "./pages/Profile"
import PrivateRoute from './components/auth/PrivateRoute'
import Protocolos from './pages/Protocolos'
import ProtocoloDetalhe from './pages/ProtocoloDetalhe'
import ExecucaoEnsaio from './pages/ExecucaoEnsaio'
import Instrumentos from './pages/Instrumentos'
import TiposEnsaio from './pages/TiposEnsaio'


export default function App() {

  return (
    <Routes>
      <Route element={<PrivateRoute roles={['administrador', 'coordenador', 'funcionario']} />}>
        <Route path="/protocolos" element={<Protocolos />} />
        <Route path="/protocolos/:id" element={<ProtocoloDetalhe />} />
        <Route path="/ensaios/:id" element={<ExecucaoEnsaio />} />
        <Route path="/instrumentos" element={<Instrumentos />} />
        <Route path="/tipos-ensaio" element={<TiposEnsaio />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/amostras" element={<Amostras />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}