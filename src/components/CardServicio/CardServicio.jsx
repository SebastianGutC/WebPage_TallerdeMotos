import React, { useState } from "react";
import "foundation-sites/dist/css/foundation.min.css";
import "./cardServicio.css";

const CardServicio = ({ titulo, descripcion, icono, precio }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const abrirModal = () => setMostrarModal(true);
  const cerrarModal = () => setMostrarModal(false);

  const confirmarCita = () => {
    if (!fecha || !hora) {
      alert("Por favor selecciona una fecha y hora para la cita.");
      return;
    }
    alert(`Cita agendada para ${titulo} el ${fecha} a las ${hora}`);
    cerrarModal();
  };

  return (
    <div className="cell small-12 medium-6 large-4">
      <div className="card card-servicio text-center">
        <div className="card-divider card-servicio-header">
          <div className="icono-servicio">
            <i className={icono}></i>
          </div>
          <h4 className="titulo-servicio">{titulo}</h4>
        </div>

        <div className="card-section card-servicio-body">
          <p className="descripcion-servicio">{descripcion}</p>
          <p className="precio-servicio">${precio.toLocaleString("es-CO")}</p>
          <button className="button btn-servicio" onClick={abrirModal}>
            Solicitar Servicio
          </button>
        </div>
      </div>


      {mostrarModal && (
        <div className="modal-overlay servicios">
          <div className="modal">
            <h4>Agendar cita para {titulo}</h4>
            <label>Selecciona la fecha:</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />

            <label>Selecciona la hora:</label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
            />

            <div className="modal-buttons">
              <button className="button success" onClick={confirmarCita}>
                Confirmar
              </button>
              <button className="button alert" onClick={cerrarModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardServicio;




