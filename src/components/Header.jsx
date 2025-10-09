import React from "react";
import "./Header.css";
import $ from "jquery";
import "foundation-sites";
import isologo from "../assets/isologo.png";

const Header = () => {
  // Iniciar Foundation al cargar
  React.useEffect(() => {
    $(document).foundation();
  }, []);

  return (
    <header className="header">
      <div className="top-bar-left">
        <img src={isologo} alt="Isologo" className="header-logo" />
      </div>

      <div className="top-bar-center">
        <ul className="menu">
          <li><a href="/">Inicio</a></li>
          <li><a href="/servicios">Servicios</a></li>
          <li><a href="/repuestos">Repuestos</a></li>
          <li><a href="/nosotros">Nosotros</a></li>
          <li><a href="/api">API</a></li>
        </ul>
      </div>

      <div className="top-bar-right">
        <button className="btn btn-login" onClick={() => window.location.href='/login'}>Iniciar Sesión</button>
        <button className="btn btn-register" onClick={() => window.location.href='/register'}>Registrarme</button>
      </div>
    </header>
  );
};

export default Header;