import React, { useState } from 'react';
import '../styles/register.css';

const Register = () => {
const [formData, setFormData] = useState({
nombre: '',
apellido: '',
email: '',
password: '',
confirmarPassword: '',
telefono: '',
aceptaTerminos: false
});
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
setFormData({
...formData,
[name]: type === 'checkbox' ? checked : value
});
};

const handleSubmit = (e) => {
e.preventDefault();
setError('');
setSuccess('');

if (!formData.nombre.trim()) {
  setError('El nombre es obligatorio.');
  return;
}
if (!formData.apellido.trim()) {
  setError('El apellido es obligatorio.');
  return;
}
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
if (formData.password !== formData.confirmarPassword) {
  setError('Las contraseñas no coinciden.');
  return;
}
if (!formData.aceptaTerminos) {
  setError('Debes aceptar los términos y condiciones.');
  return;
}

console.log('Datos de registro enviados:', formData);
setSuccess('¡Registro exitoso! Redirigiendo...');

setTimeout(() => {
  setFormData({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmarPassword: '',
    telefono: '',
    aceptaTerminos: false
  });
  setSuccess('');
}, 3000);


};

const handleCloseAlert = () => {
setError('');
setSuccess('');
};

return ( <div className="register-container"> <div className="grid-container"> <div className="grid-x grid-padding-x"> <div className="cell"> <div className="form-wrapper"> <h2 className="title">Registrar Cuenta</h2> <form onSubmit={handleSubmit}>

```
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
            
            {/* Nombre y Apellido */}
            <div className="grid-x grid-padding-x">
              <div className="medium-6 cell">
                <label className="form-label" htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="input"
                  required
                />
              </div>
              <div className="medium-6 cell">
                <label className="form-label" htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                  className="input"
                  required
                />
              </div>
            </div>
            
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
            
            {/* Teléfono */}
            <div className="grid-x grid-padding-x">
              <div className="medium-12 cell">
                <label className="form-label" htmlFor="telefono">Teléfono (opcional)</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="input"
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
                  placeholder="Crea una contraseña segura (mín. 6 caracteres)"
                  className="input"
                  required
                  minLength="6"
                />
              </div>
            </div>
            
            {/* Confirmar Contraseña */}
            <div className="grid-x grid-padding-x">
              <div className="medium-12 cell">
                <label className="form-label" htmlFor="confirmarPassword">Confirmar Contraseña</label>
                <input
                  type="password"
                  id="confirmarPassword"
                  name="confirmarPassword"
                  value={formData.confirmarPassword}
                  onChange={handleChange}
                  placeholder="Repite tu contraseña"
                  className="input"
                  required
                />
              </div>
            </div>
            
            {/* Checkbox de términos (layout corregido) */}
            <div className="grid-x grid-padding-x">
              <div className="medium-12 cell">
                <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="aceptaTerminos"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    required
                    className="terms-input"
                  />
                  <label className="terms-label" htmlFor="aceptaTerminos">
                    Acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer" className="link">términos y condiciones</a>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Botón de submit */}
            <div className="grid-x grid-padding-x">
              <div className="medium-12 cell">
                <button
                  type="submit"
                  className="button-custom"
                  disabled={!formData.aceptaTerminos}
                >
                  Registrarse
                </button>
              </div>
            </div>
            
            {/* Enlace a login */}
            <div className="grid-x grid-padding-x">
              <div className="medium-12 cell text-center">
                <p className="login-text">
                  ¿Ya tienes una cuenta?{' '}
                  <a href="/login" className="link">
                    Inicia sesión aquí
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

export default Register;
