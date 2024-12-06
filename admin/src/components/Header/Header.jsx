import React from 'react';
import Nav from './Nav/Nav';

const Header = ({ isAuthenticated, onLogout }) => {
  return (
    <section id="header">
            <img src="https://felgtbi.org/wp-content/uploads/2021/10/cropped-logo_felgtbi.png" alt="Logo" />
      {/* Solo muestra el Nav si el usuario está autenticado */}
      {isAuthenticated && <Nav onLogout={onLogout} />}
    </section>
  );
};

export default Header;
