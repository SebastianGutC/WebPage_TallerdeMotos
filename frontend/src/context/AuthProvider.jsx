import { useState } from "react";
import { AuthContext } from "./AuthContext";
import LoginModal from "../pages/Login/LoginModal";
import RegisterModal from "../pages/Register/RegisterModal";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const [showLogin, setShowLogin] = useState(false);
  const [showregister, setShowregister] = useState(false);

  const openLoginModal = () => setShowLogin(true);
  const closeLoginModal = () => setShowLogin(false);

  const openRegisterModal = () => setShowregister(true);
  const closeRegisterModal = () => setShowregister(false);

  const login = (data) => {
    setUsuario(data.usuario);
    setToken(data.token);

    localStorage.setItem("usuario", JSON.stringify(data.usuario));
    localStorage.setItem("token", data.token);

    closeLoginModal();
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);

    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  };

  const isAuthenticated = !!usuario;

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated,
        login,
        logout,
        showLogin,
        openLoginModal,
        closeLoginModal,
        showregister,
        openRegisterModal,
        closeRegisterModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};