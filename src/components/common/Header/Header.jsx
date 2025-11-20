import React from "react";
import "./Header.css";
import "foundation-sites";
import isologo from "../../../assets/isologo.png";
import { NavLink } from "react-router-dom";
import LoginModal from "../../../pages/Login/LoginModal";
import RegisterModal from "../../../pages/Register/RegisterModal";
import { useCart } from "../../../context/CartContext";
import CartMenu from "../../Repuestos/CartMenu/CartMenu";


const Header = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = React.useState(false);
  const { cartItems, toggleCart } = useCart();

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
          <li><NavLink to="/">Inicio</NavLink></li>
          <li><NavLink to="/servicios">Servicios</NavLink></li>
          <li><NavLink to="/repuestos">Repuestos</NavLink></li>
          <li><NavLink to="/nosotros">Nosotros</NavLink></li>
          <li><NavLink to="/api">API</NavLink></li>
        </ul>
      </div>

      <div className="top-bar-right">
        <div className="cart-container">
          <button className="cart-btn" onClick={toggleCart}>
            <i className="fi-shopping-cart cart-icon"></i>
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length}</span>
            )}
          </button>
        </div>

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

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="svg-icon">
            <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
          </svg>
        </button>
      </div>

      <CartMenu />

      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} openRegisterModal={openRegisterModal} />
      <RegisterModal isOpen={isRegisterOpen} onClose={closeRegisterModal} openLoginModal={openLoginModal} />
    </header>
  );
};

export default Header;
