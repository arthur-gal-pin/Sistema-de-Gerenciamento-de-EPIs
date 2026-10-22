import LoginPage from './pages/LoginPage'
import InstrumentosPage from './pages/InstrumentosPage'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'

function App() {
  return (
<BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/instrumentos" element={<InstrumentosPage/>}/>
        <Route path="*" element={<Navigate to="/login"/>}/>
      </Routes>
  </BrowserRouter>
  )
}

export default App
