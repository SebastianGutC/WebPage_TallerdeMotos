import React, { useState, useEffect } from "react";
import "./Header.css";
import $ from "jquery";
import "foundation-sites";
import isologo from "../../src/assets/isologo.png";
import { NavLink } from "react-router-dom";
import LoginModal from "../pages/Login/LoginModal";
import RegisterModal from "../pages/Register/RegisterModal";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    $(document).foundation();
  }, []);


  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);

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
        {/* Botón de Login */}
        <button className="btn btn-login btn-link" onClick={openLoginModal}>
          <i className="fi-torso icon-btn"></i>
          <span className="btn-text">Iniciar Sesión</span>
        </button>

        {/* Botón de Registro */}
        <button className="btn btn-register btn-link" onClick={openRegisterModal}>
          <i className="fi-pencil icon-btn"></i>
          <span className="btn-text">Registrarme</span>
        </button>

        {/* Botón menú móvil */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon">
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>
      </div>

      
      <LoginModal
        isOpen={isLoginOpen}
        onClose={closeLoginModal}
        openRegisterModal={openRegisterModal} 
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={closeRegisterModal}
        openLoginModal={openLoginModal} 
      />
    </header>
  );
};

export default Header;
