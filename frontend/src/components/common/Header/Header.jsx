import React, { useEffect, useState } from "react";
import "./Header.css";
import "foundation-sites";
import isologo from "../../../assets/isologo.png";
import { NavLink, useNavigate } from "react-router-dom";
import LoginModal from "../../../pages/Login/LoginModal";
import RegisterModal from "../../../pages/Register/RegisterModal";
import { useCart } from "../../../context/CartContext";
import CartMenu from "../../Repuestos/CartMenu/CartMenu";
import { logoutUser } from "../../../services/AuthService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { cartItems, toggleCart } = useCart();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openRegisterModal = () => setIsRegisterOpen(true);
  const closeRegisterModal = () => setIsRegisterOpen(false);

  // Determina si el usuario actual es administrador
  const isAdmin = user?.rol === "ADMIN";

  useEffect(() => {
    const loadUser = () => {
      const userStorage = localStorage.getItem("user");
      setUser(userStorage ? JSON.parse(userStorage) : null);
    };

    loadUser();
    window.addEventListener("userChanged", loadUser);
    return () => window.removeEventListener("userChanged", loadUser);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Error cerrando sesión:", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      window.dispatchEvent(new Event("userChanged"));
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
        </ul>
      </div>

      <div className="top-bar-right">
        {/* Carrito: solo para usuarios normales, no para admin */}
        {user && !isAdmin && (
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
        {user && isAdmin && (
          <div className="user-section">

            {/* Botón que lleva al panel de administración */}
            <button
              className="btn btn-admin"
              onClick={() => navigate("/admin")}
              title="Acceder a Admin"
            >
              <i className="fi-widget icon-btn"></i>
              <span className="btn-text">Administrador</span>
            </button>

            {/* Botón cerrar sesión */}
            <button className="btn btn-logout-admin" onClick={handleLogout} title="Cerrar sesión">
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <span className="btn-text">Cerrar sesión</span>
            </button>
          </div>
        )}

        {/* === CASO 2: Usuario normal logueado === */}
        {user && !isAdmin && (
          <div className="user-section">
            <span className="user-name">¡ Hola, {user.nombre} !</span>
            <button className="btn-logout" onClick={handleLogout}>
              <i className="fi-x"></i>
            </button>
          </div>
        )}

        {/* === CASO 3: Sin sesión === */}
        {!user && (
          <div className="user-actions">
            <button className="btn btn-login" onClick={openLoginModal}>
              <i className="fi-torso icon-btn"></i>
              <span className="btn-text">Iniciar Sesión</span>
            </button>
            <button className="btn btn-register" onClick={openRegisterModal}>
              <i className="fi-pencil icon-btn"></i>
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