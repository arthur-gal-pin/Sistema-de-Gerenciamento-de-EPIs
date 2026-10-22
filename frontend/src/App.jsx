import LoginPage from './pages/LoginPage'
import NoLoginPage from './pages/NoLoginPage';
import HomePage from './pages/HomePage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css'

function App() {
  return (
<BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/no-login" element={<NoLoginPage/>}/>
        <Route path="*" element={<Navigate to="/login"/>}/>
        <Route path= "/home-page" element={<HomePage/>}/>
      </Routes>
  </BrowserRouter>
  )
}

export default App
