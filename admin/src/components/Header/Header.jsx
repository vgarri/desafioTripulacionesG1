import React from 'react';
import Nav from './Nav/Nav';

const Header = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="header">
      <div className="header-content">
        <img 
          className="header-logo" 
          src="https://felgtbi.org/wp-content/uploads/2021/10/cropped-logo_felgtbi.png" 
          alt="Logo" 
        />
        {isAuthenticated && <Nav onLogout={onLogout} />}
      </div>
    </header>
  );
};

export default Header;
