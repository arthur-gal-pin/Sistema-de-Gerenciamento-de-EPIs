import LoginPage from './pages/LoginPage'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'

function App() {
  return (
<BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="*" element={<Navigate to="/login"/>}/>
      </Routes>
  </BrowserRouter>
  )
}

export default App
