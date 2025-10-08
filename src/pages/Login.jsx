import React, { useState } from 'react';
import '../styles/login.css';
// import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

// Obtener lista de usuarios
const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

// Buscar si hay un usuario con ese email y password
const usuarioValido = usuarios.find(
  u => u.email === formData.email && u.password === formData.password
);

if (!usuarioValido) {
  setError('Email o contraseña incorrectos.');
  return;
}

// Simular sesión iniciada
localStorage.setItem('usuarioActivo', JSON.stringify(usuarioValido));

setSuccess(`¡Bienvenido, ${usuarioValido.nombre}! Redirigiendo...`);

/* PARA REDIRECCIONAR A HOME AL INICIAR SESIÓN

const navigate = useNavigate();

setTimeout(() => {
    navigate('/home'); 
}, 2000);

*/

    setTimeout(() => {
      setFormData({
        email: '',
        password: ''
      });
      setSuccess('');
    }, 3000);
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className="login-container">
      <div className="grid-container">
        <div className="grid-x grid-padding-x">
          <div className="cell">
            <div className="form-wrapper">
              <h2 className="title">Iniciar Sesión</h2>
              <form onSubmit={handleSubmit}>
                {/* Mensajes de error o éxito */}
                {error && (
                  <div className="alert-error" data-closable>
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
                  <div className="alert-success" data-closable>
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
                
                {/* Email */}
                <div className="grid-x grid-padding-x">
                  <div className="medium-12 cell">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className="input"
                      required
                    />
                  </div>
                </div>
                
                {/* Contraseña */}
                <div className="grid-x grid-padding-x">
                  <div className="medium-12 cell">
                    <label className="form-label" htmlFor="password">Contraseña</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Ingresa tu contraseña (mín. 6 caracteres)"
                      className="input"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
                
                {/* Botón de submit */}
                <div className="grid-x grid-padding-x">
                  <div className="medium-12 cell">
                    <button
                      type="submit"
                      className="button-custom"
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                </div>
                
                {/* Enlace a registro */}
                <div className="grid-x grid-padding-x">
                  <div className="medium-12 cell text-center">
                    <p className="register-text">
                      ¿No tienes una cuenta?{' '}
                      <a href="/register" className="link">
                        Regístrate aquí
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;