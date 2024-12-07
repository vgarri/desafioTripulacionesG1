import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ onLogout }) => {
  return (
    <nav className="nav">
      {/* Links centrados */}
      <ul className="nav-links">
        <li>
          <Link className="btn-link" to="/graficas">Gráficas</Link>
        </li>
        <li>
          <Link className="btn-link" to="/edicion">Edición</Link>
        </li>
      </ul>

      {/* Botón de cerrar sesión a la derecha */}
      <div className="nav-logout">
        <button className="btn-link" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Nav;
