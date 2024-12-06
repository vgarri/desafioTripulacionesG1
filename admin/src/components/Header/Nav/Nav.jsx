import React from 'react';
import { Link } from 'react-router-dom';

const Nav = ({ onLogout }) => {
  return (
    <nav className="nav_generic">
      <ul className="nav">
        <li className="nav-link">
          <Link className="btn-link" to="/graficas">Gráficas</Link>
        </li>
        <li className="nav-link">
          <Link className="btn-link" to="/edicion">Edición</Link>
        </li>
        <li className="nav-link">
          <button className="btn-link" onClick={onLogout}>Cerrar sesión</button>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
