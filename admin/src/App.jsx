import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './components/Main/Login/Login';
import Graficas from './components/Main/Graficas/Graficas';
import VisorGraficas from './components/Main/VisorGraficas/VisorGraficas';
import Edicion from './components/Main/Edicion/Edicion';
import '@fortawesome/fontawesome-free/css/all.css';
import { adminContext } from "./context/adminContext";
import GraficasUsuarios from './components/Main/VisorGraficas/GraficasUsuarios/GraficasUsuarios';

import './styles/styles.scss';

function App() {
  const [botonPulsado, setBotonPulsado] = useState("");//estado a usar por el context
  
  const updateBotonPulsado = (newBoton) => { //funcion de context
    const {boton} = newBoton
    setBotonPulsado(boton)
  };
  //export del context
  const botonGrafica = {
    botonPulsado,
    updateBotonPulsado
  }







  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = '/'; // Redirige al login al cerrar sesión
  };

  return (
    <Router>
      <adminContext.Provider value={botonGrafica}>
      <div className="app-container">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            {/* Login */}
            <Route
              path="/"
              element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/graficas" />}
            />
            {/* Graficas */}
            <Route
              path="/graficas"
              element={isAuthenticated ? <VisorGraficas /> : <Navigate to="/" />}
            />
               <Route path="/graficas-usuarios" element={<GraficasUsuarios />} />
            {/* Edición */}
            <Route
              path="/edicion"
              element={isAuthenticated ? <Edicion /> : <Navigate to="/" />}
            />
             

          </Routes>
        </main>
        <Footer />
      </div>
      </adminContext.Provider>
    </Router>
  );
}

export default App;
