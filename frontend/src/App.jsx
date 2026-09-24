import { Navigate, Route, Routes } from "react-router-dom"
import Login from "../pages/login"
import Home from "./pages/Home"
import Amostras from "./pages/Amostras"

export default function App() {

  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
      {/* <Route path="/login" element={<Login />} /> */}
      <Route path="/home" element={<Home />} />
      <Route path="/amostras" element={<Amostras />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
