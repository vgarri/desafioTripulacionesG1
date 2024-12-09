import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = ({ onLogout }) => {
  return (
    <nav className="nav">
      <ul className="nav-links">
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'btn-link active' : 'btn-link')}
            to="/graficas"
          >
            Gráficas
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'btn-link active' : 'btn-link')}
            to="/edicion"
          >
            Edición
          </NavLink>
        </li>
      </ul>
      <div className="nav-logout">
        <button className="btn-link" onClick={onLogout}>Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Nav;
