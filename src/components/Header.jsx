import React, { useState, useEffect } from "react";
import "./Header.css";
import $ from "jquery";
import "foundation-sites";
import isologo from "../../assets/isologo.png";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Iniciar Foundation al cargar
  useEffect(() => {
    $(document).foundation();
  }, []);

  return (
    <header className="header">
      <div className="top-bar-left">
        <img src={isologo} alt="Isologo" className="header-logo" />
      </div>

      <div className={`top-bar-center ${menuOpen ? "open" : ""}`}>
        <ul className="menu">
          <li><NavLink to="/" className="nav-link">Inicio</NavLink></li>
          <li><NavLink to="/servicios" className="nav-link">Servicios</NavLink></li>
          <li><NavLink to="/repuestos" className="nav-link">Repuestos</NavLink></li>
          <li><NavLink to="/nosotros" className="nav-link">Nosotros</NavLink></li>
          <li><NavLink to="/api" className="nav-link">API</NavLink></li>
        </ul>
      </div>

      <div className="top-bar-right">
        <NavLink to="/login" className="btn btn-login btn-link">
          <i className="fi-torso icon-btn"></i>
          <span className="btn-text">Iniciar Sesión</span>
        </NavLink>
        <NavLink to="/register" className="btn btn-register btn-link">
          <i className="fi-pencil icon-btn"></i>
          <span className="btn-text">Registrarme</span>
        </NavLink>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon">
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>
      </div>

    </header>
  );
};

export default Header;
