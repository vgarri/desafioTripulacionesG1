import React from "react";
import { Link } from 'react-router-dom';

const Nav = () => {
  return (
    <nav className="nav_generic">
      <ul className="nav">
        <li className="nav-link">
          <Link className="btn-link" to="/">Gráficas</Link>
        </li>
        <li className="nav-link">
          <Link className="btn-link" to="/edicion">Edición</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;