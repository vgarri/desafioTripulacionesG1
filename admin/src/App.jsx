import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './components/Main/Login/Login';
import Graficas from './components/Main/Graficas/Graficas';
import Edicion from './components/Main/Edicion/Edicion';
import '@fortawesome/fontawesome-free/css/all.css';

import './styles/styles.scss';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = '/'; // Redirige al login al cerrar sesión
  };

  return (
    <Router>
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
              element={isAuthenticated ? <Graficas /> : <Navigate to="/" />}
            />
            {/* Edición */}
            <Route
              path="/edicion"
              element={isAuthenticated ? <Edicion /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
