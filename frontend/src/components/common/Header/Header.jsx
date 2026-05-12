import React, { useState } from "react";
import "./Header.css";
import "foundation-sites";
import isologo from "../../../assets/isologo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import CartMenu from "../../Repuestos/CartMenu/CartMenu";
import { logoutUser } from "../../../services/AuthService";
import { useAuth } from "../../../context/UseAuth"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket, faUser, faUserPlus, faUserShield } from "@fortawesome/free-solid-svg-icons";


const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartItems, toggleCart } = useCart();
  const navigate = useNavigate();

  const { usuario, isAuthenticated, logout, openLoginModal, openRegisterModal } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Error cerrando sesión:", error);
    } finally {
      logout(); 
      navigate("/");
    }
  };

  return (
    <header className="header">
      <div className="top-bar-left">
        <img src={isologo} alt="Isologo" className="header-logo" />
      </div>

      <div className={`top-bar-center ${menuOpen ? "open" : ""}`}>
        <ul className="menu">
          <li><NavLink to="/">Inicio</NavLink></li>
          <li><NavLink to="/servicios">Servicios</NavLink></li>
          <li><NavLink to="/repuestos">Repuestos</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/api">API</NavLink></li>
        </ul>
      </div>

      <div className="top-bar-right">
        {isAuthenticated && (
          <div className="cart-container">
            <button className="cart-btn" onClick={toggleCart}>
              <i className="fi-shopping-cart cart-icon"></i>
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>
          </div>
        )}

 {/* === CASO 1: Admin logueado === */}
        {usuario && usuario.rol === "ADMIN" && (
          <div className="user-section">

            {/* Botón que lleva al panel de administración */}
            <button
              className="btn btn-admin"
              onClick={() => navigate("/admin")}
              title="Acceder a Admin"
            >
              <FontAwesomeIcon icon={faUserShield} className="icon-mobile" />
              <span className="btn-text">Administrador</span>
            </button>

            {/* Botón cerrar sesión */}
            <button className="btn btn-logout-admin" onClick={handleLogout} title="Cerrar sesión">
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon-mobile" />
              <span className="btn-text">Cerrar sesión</span>
            </button>
          </div>
        )}

        {/* === CASO 2: Usuario normal logueado === */}
        {usuario && usuario.rol === "USUARIO" && (
          <div className="user-section">
            <span className="user-name">¡ Hola, {usuario.nombre} !</span>
            <button className="btn-logout" onClick={handleLogout}>
              <i className="fi-x"></i>
            </button>
          </div>
        )}

        {!usuario && (
          <div className="user-actions">
            <button className="btn btn-login" onClick={openLoginModal}>
              <FontAwesomeIcon icon={faUser} className="icon-mobile" />
              <span className="btn-text">Iniciar Sesión</span>
            </button>
            <button className="btn btn-register" onClick={openRegisterModal}>
              <FontAwesomeIcon icon={faUserPlus} className="icon-mobile" />
              <span className="btn-text">Registrarme</span>
            </button>
          </div>
        )}

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon">
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>
      </div>

      <CartMenu />

    </header>
  );
};

export default Header;