import React, { useState } from "react";
import "./register.css";
import { registerUser } from "../../services/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons";

// ── Expresiones regulares ──────────────────────────────────────────────────────
const REGEX = {
  nombre:    /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  apellido:  /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  email:     /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  telefono:  /^3[0-9]{9}$/,
  contraseña:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
};

const MENSAJES = {
  nombre:    "Solo letras y espacios, entre 2 y 50 caracteres.",
  apellido:  "Solo letras y espacios, entre 2 y 50 caracteres.",
  email:     "Ingresa un correo electrónico válido.",
  telefono:  "Ingresa un número celular válido (3XX-XXX-XXXX).",
  contraseña:"Mínimo 6 caracteres, una mayúscula, una minúscula y un número.",
};

const RegisterModal = ({ isOpen, onClose, openLoginModal }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contraseña: "",
    confirmarcontraseña: "",
    aceptaTerminos: false,
  });

  // fieldErrors guarda el error de cada campo individualmente
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  // ── Validar un campo individual al salir del input (onBlur) ──
  const validateField = (name, value) => {
    if (!value || !value.toString().trim()) {
      return "Este campo es obligatorio.";
    }
    if (REGEX[name] && !REGEX[name].test(value.toString().trim())) {
      return MENSAJES[name];
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({ ...formData, [name]: newValue });

    // Limpiar error del campo mientras el usuario escribe
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "confirmarcontraseña") return; // se valida aparte
    const msg = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: msg }));
  };

  // ── Validación completa antes de enviar ──────────────────────────────────────
  const validateAll = () => {
    const errors = {};

    ["nombre", "apellido", "email", "telefono", "contraseña"].forEach((field) => {
      const msg = validateField(field, formData[field]);
      if (msg) errors[field] = msg;
    });

    if (!formData.confirmarcontraseña?.trim()) {
      errors.confirmarcontraseña = "Este campo es obligatorio.";
    } else if (formData.contraseña !== formData.confirmarcontraseña) {
      errors.confirmarcontraseña = "Las contraseñas no coinciden.";
    }

    if (!formData.aceptaTerminos) {
      errors.aceptaTerminos = "Debes aceptar los términos y condiciones.";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const errors = validateAll();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Por favor corrige los errores antes de continuar.");
      return;
    }

    try {
      const res = await registerUser({
        nombre:    formData.nombre,
        apellido:  formData.apellido,
        email:     formData.email,
        contraseña: formData.contraseña,
        telefono:  formData.telefono,
      });

      console.log("Respuesta del backend:", res);
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setFormData({
        nombre: "", apellido: "", email: "",
        telefono: "", contraseña: "", confirmarcontraseña: "",
        aceptaTerminos: false,
      });
      setFieldErrors({});

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
        <button className="register-modal-close" onClick={onClose}>&times;</button>

        <h2 className="register-title">Crear Cuenta</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="register-alert-error">
              <div className="register-alert-content">
                <FontAwesomeIcon icon={faCircleExclamation} className="register-alert-icon" />
                <span className="register-alert-text">{error}</span>
              </div>
              <button className="register-close-alert" type="button" onClick={handleCloseAlert}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          )}

          {success && (
            <div className="register-alert-success">
              <p>{success}</p>
            </div>
          )}

          <div className="register-form-grid">
            <div>
              {/* Nombre */}
              <label className="register-form-label">Nombre</label>
              <input
                type="text" name="nombre" value={formData.nombre}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Tu nombre" className={`register-input ${fieldErrors.nombre ? "input-error" : ""}`}
              />
              {fieldErrors.nombre && <span className="field-error">{fieldErrors.nombre}</span>}

              {/* Apellido */}
              <label className="register-form-label">Apellido</label>
              <input
                type="text" name="apellido" value={formData.apellido}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Tu apellido" className={`register-input ${fieldErrors.apellido ? "input-error" : ""}`}
              />
              {fieldErrors.apellido && <span className="field-error">{fieldErrors.apellido}</span>}

              {/* Contraseña */}
              <label className="register-form-label">Contraseña</label>
              <input
                type="password" name="contraseña" value={formData.contraseña}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Mínimo 6 caracteres" className={`register-input ${fieldErrors.contraseña ? "input-error" : ""}`}
              />
              {fieldErrors.contraseña && <span className="field-error">{fieldErrors.contraseña}</span>}
            </div>

            <div>
              {/* Teléfono */}
              <label className="register-form-label">Teléfono</label>
              <input
                type="text" name="telefono" value={formData.telefono}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="Tu número de teléfono" className={`register-input ${fieldErrors.telefono ? "input-error" : ""}`}
              />
              {fieldErrors.telefono && <span className="field-error">{fieldErrors.telefono}</span>}

              {/* Email */}
              <label className="register-form-label">Correo electrónico</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} onBlur={handleBlur}
                placeholder="tu@email.com" className={`register-input ${fieldErrors.email ? "input-error" : ""}`}
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}

              {/* Confirmar contraseña */}
              <label className="register-form-label">Confirmar contraseña</label>
              <input
                type="password" name="confirmarcontraseña" value={formData.confirmarcontraseña}
                onChange={(e) => {
                  handleChange(e);
                  // Validar coincidencia en tiempo real
                  if (formData.contraseña && e.target.value !== formData.contraseña) {
                    setFieldErrors((prev) => ({ ...prev, confirmarcontraseña: "Las contraseñas no coinciden." }));
                  } else {
                    setFieldErrors((prev) => ({ ...prev, confirmarcontraseña: "" }));
                  }
                }}
                placeholder="Repite tu contraseña" className={`register-input ${fieldErrors.confirmarcontraseña ? "input-error" : ""}`}
              />
              {fieldErrors.confirmarcontraseña && <span className="field-error">{fieldErrors.confirmarcontraseña}</span>}
            </div>
          </div>

          <div className="register-terms-checkbox">
            <input
              type="checkbox" name="aceptaTerminos"
              checked={formData.aceptaTerminos} onChange={handleChange}
            />
            <label>Acepto los términos y condiciones</label>
          </div>
          {fieldErrors.aceptaTerminos && <span className="field-error">{fieldErrors.aceptaTerminos}</span>}

          <button type="submit" className="register-button" disabled={!formData.aceptaTerminos}>
            Registrarme
          </button>
        </form>

        <p className="register-login-text">
          ¿Ya tienes una cuenta?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); onClose(); openLoginModal(); }}>
            Inicia sesión aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;
