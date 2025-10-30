import React, { useState } from "react";
import "./register.css";

const RegisterModal = ({ isOpen, onClose, openLoginModal }) => {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmarPassword: "",
    aceptaTerminos: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nombreCompleto.trim()) {
      setError("El nombre completo es obligatorio.");
      return;
    }
    if (!formData.email.trim()) {
      setError("El correo electrónico es obligatorio.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (formData.password !== formData.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!formData.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioExistente = usuarios.find((u) => u.email === formData.email);
    if (usuarioExistente) {
      setError("Este correo ya está registrado.");
      return;
    }

    usuarios.push({
      nombreCompleto: formData.nombreCompleto,
      email: formData.email,
      password: formData.password,
    });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    setSuccess("¡Registro exitoso! Redirigiendo al inicio de sesión...");

    setTimeout(() => {
      onClose();
      openLoginModal();
    }, 2000);
  };

  const handleCloseAlert = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className="register-modal-overlay">
      <div className="register-modal-container">
        <button className="register-modal-close" onClick={onClose}>
          &times;
        </button>

        <h2 className="register-title">Crear Cuenta</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="register-alert-error">
              <p>{error}</p>
              <button
                className="register-close-alert"
                type="button"
                onClick={handleCloseAlert}
              >
                &times;
              </button>
            </div>
          )}
          {success && (
            <div className="register-alert-success">
              <p>{success}</p>
              <button
                className="register-close-alert"
                type="button"
                onClick={handleCloseAlert}
              >
                &times;
              </button>
            </div>
          )}

          <label className="register-form-label">Nombre completo</label>
          <input
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            className="register-input"
            required
          />

          <label className="register-form-label">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="register-input"
            required
          />

          <label className="register-form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Crea una contraseña (mínimo 6 caracteres)"
            className="register-input"
            minLength="6"
            required
          />

          <label className="register-form-label">Confirmar contraseña</label>
          <input
            type="password"
            name="confirmarPassword"
            value={formData.confirmarPassword}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            className="register-input"
            required
          />

          <div className="register-terms-checkbox">
            <input
              type="checkbox"
              id="aceptaTerminos"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
              className="register-terms-input"
            />
            <label
              className="register-terms-label"
              htmlFor="aceptaTerminos"
            >
              Acepto los{" "}
              <a
                href="/terminos"
                target="_blank"
                rel="noopener noreferrer"
                className="register-link"
              >
                términos y condiciones
              </a>
            </label>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={!formData.aceptaTerminos}
          >
            Registrarme
          </button>
        </form>

        <p className="register-login-text">
          ¿Ya tienes una cuenta?{" "}
          <a
            href="#"
            className="register-link"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              openLoginModal();
            }}
          >
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;




