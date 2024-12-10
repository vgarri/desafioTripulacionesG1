import React from "react";

const Header = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
      <a href="https://felgtbi.org/">
          <img 
            className="header-logo" 
            src="https://felgtbi.org/wp-content/uploads/2021/10/logo_felgtbi_blanco.png" 
            alt="Logo" 
          />
        </a>
      </div>
    </header>
  );
};

export default Header;