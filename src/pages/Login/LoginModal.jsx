import React, { useState } from 'react';
import './login.css';

const LoginModal = ({ isOpen, onClose, openRegisterModal }) => {
  // hooks siempre arriba
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email.trim()) {
      setError('El email es obligatorio.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Por favor, ingresa un email válido.');
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioValido = usuarios.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (!usuarioValido) {
      setError('Email o contraseña incorrectos.');
      return;
    }

    // El registro ahora guarda nombreCompleto (si usaste la última versión)
    const nombreDisplay = usuarioValido.nombreCompleto ?? usuarioValido.nombre ?? usuarioValido.email;

    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));
    setSuccess(`¡Bienvenido, ${nombreDisplay}!`);

    setTimeout(() => {
      setFormData({ email: '', password: '' });
      setSuccess('');
      onClose();
    }, 2000);
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <button className="login-modal-close" onClick={onClose}>
          &times;
        </button>
        <h2 className="title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert-error">
              <p>{error}</p>
              <button
                className="close-button-custom"
                type="button"
                onClick={handleCloseAlert}
              >
                &times;
              </button>
            </div>
          )}
          {success && (
            <div className="alert-success">
              <p>{success}</p>
              <button
                className="close-button-custom"
                type="button"
                onClick={handleCloseAlert}
              >
                &times;
              </button>
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            className="login-input"
          />

          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <br />
        <div className="grid-x grid-padding-x">
          <div className="medium-12 cell text-center">
            <p className="register-text">
              ¿No tienes una cuenta?{' '}
              <a
                href="#"
                className="link"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();            // cierra login
                  openRegisterModal();  // pide al padre abrir register
                }}
              >
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
