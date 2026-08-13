<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
=======
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Bootstrap (CSS e JS via bundle, sem outros frameworks)
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Estilos do design system do projeto
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
>>>>>>> feat/Tela-Home
)
