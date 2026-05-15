import React, { useState } from 'react';
import './login.css';
import { loginUser } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UseAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";


const LoginModal = ({ isOpen, onClose, openRegisterModal }) => {
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    contraseña: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email.trim()) {
      setError('El email es obligatorio.');
      return;
    }

    try {
      const res = await loginUser(formData);

      login({
        usuario: res.data.user,
        token: res.data.token,
      });

      if(res.data.user.rol === "USUARIO") {
        navigate('/servicios');
      }

      const user = res.data.user;
      const nombreDisplay = user?.nombre || user?.email;

      if (user?.rol === "ADMIN") {
        // Admin: saludo diferente, redirige al panel sin esperar
        setSuccess(`¡Bienvenido de nuevo, ${nombreDisplay}! `);
        setTimeout(() => {
          setFormData({ email: '', contraseña: '' });
          setSuccess('');
          onClose();
          navigate("/admin");
        }, 1500);
      } else {
        // Usuario normal: saludo estándar, solo cierra el modal
        setSuccess(`¡Bienvenido, ${nombreDisplay}!`);
        setTimeout(() => {
          setFormData({ email: '', contraseña: '' });
          setSuccess('');
          onClose();
          navigate("/servicios#servicios")
        }, 2000);
      }

    } catch (error) {
      setError(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <button className="login-modal-close" onClick={onClose}>&times;</button>

        <h2 className="title">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert-error">
              <div className="alert-content">
                <FontAwesomeIcon icon={faCircleExclamation} className="alert-icon" />
                <span className="alert-text">{error}</span>
              </div>

              <button
                className="alert-close"
                type="button"
                onClick={handleCloseAlert}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}
          {success && (
            <div className="alert-success">
              <p>{success}</p>
            </div>
          )}

          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="login-input"
          />

          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="contraseña"
            value={formData.contraseña}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            className="login-input"
          />

          <button type="submit" className="login-button">Iniciar Sesión</button>
        </form>

        <br />

        <div className="grid-x grid-padding-x">
          <div className="medium-12 cell text-center">
            <p className="register-text">
              ¿No tienes una cuenta?{' '}
              <a href="#" className="link" onClick={(e) => {
                e.preventDefault();
                onClose();
                openRegisterModal();
              }}>
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
