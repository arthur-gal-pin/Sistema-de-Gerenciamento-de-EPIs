import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../src/pages/login"
import Cadastro from "../src/pages/cadastro"
import Home from "./pages/Home"
import Amostras from "./pages/Amostras"

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/home" element={<Home />} />
      <Route path="/amostras" element={<Amostras />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}