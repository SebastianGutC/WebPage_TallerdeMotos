import React, { useState } from "react";
import "./register.css";
import { registerUser } from "../../services/AuthService";

const RegisterModal = ({ isOpen, onClose, openLoginModal }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    confirmarContraseña: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!formData.apellido.trim()) {
      setError("El apellido es obligatorio.");
      return;
    }

    if (!formData.email.trim()) {
      setError("El correo electrónico es obligatorio.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    if (formData.contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (formData.contraseña.trim() !== formData.confirmarcontraseña.trim()) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!formData.aceptaTerminos) {
      setError("Debes aceptar los términos y condiciones.");
      return;
    }

    try {
      const res = await registerUser({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        contraseña: formData.contraseña,
        telefono: formData.telefono,
      });

      setFormData({
        nombreCompleto: "",
        email: "",
        password: "",
        confirmarPassword: "",
        aceptaTerminos: false,
      });

      console.log("Respuesta del backend:", res);

      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");

      setTimeout(() => {
        onClose();
        openLoginModal();
      }, 2000);
    } catch (error) {
      setError(error.response?.data?.message || "Error al registrarse");
    }
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
          <div className="register-form-grid">
            <div>
              <label className="register-form-label">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="register-input"
              />

              <label className="register-form-label">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                className="register-input"
              />
              <label className="register-form-label">Contraseña</label>
              <input
                type="password"
                name="contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="register-input"
              />
            </div>
            <div>
              <label className="register-form-label">Telefono</label>
              <input
                type="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Tu número de teléfono"
                className="register-input"
              />

              <label className="register-form-label">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="register-input"
              />

              <label className="register-form-label">
                Confirmar contraseña
              </label>
              <input
                type="password"
                name="confirmarcontraseña"
                value={formData.confirmarcontraseña}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                className="register-input"
              />
            </div>
          </div>

          <div className="register-terms-checkbox">
            <input
              type="checkbox"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
            />
            <label>Acepto los términos y condiciones</label>
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
