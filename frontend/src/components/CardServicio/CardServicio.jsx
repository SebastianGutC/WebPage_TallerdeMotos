import React, { useEffect, useState } from "react";
import "foundation-sites/dist/css/foundation.min.css";
import "./cardServicio.css";
import { getCitasPorEstado, agendarCita } from "../../services/CitasService";
import { useAuth } from "../../context/UseAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CardServicio = ({ nombre, descripcion, icono, precio }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citasDisponibles, setCitasDisponibles] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { usuario } = useAuth();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await getCitasPorEstado("disponible");
        const citas = res.data;
        setCitasDisponibles(citas);
        const fechas = citas.map((cita) => new Date(cita.fecha).toDateString());
        setFechasDisponibles(fechas);
      } catch (error) {
        console.error("Error fetching citas:", error);
      }
    };

    if (mostrarModal) fetchCitas();
  }, [mostrarModal]);

  useEffect(() => {
    if (!fechaSeleccionada) return;
    const fechaStr = fechaSeleccionada.toDateString();
    const horas = citasDisponibles.filter(
      (cita) => new Date(cita.fecha).toDateString() === fechaStr
    );
    setHorasDisponibles(horas);
    setHoraSeleccionada("");
  }, [fechaSeleccionada, citasDisponibles]);

  const abrirModal = () => {
    setMostrarModal(true);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFechaSeleccionada(null);
    setHoraSeleccionada("");
    setErrorMsg("");
    setSuccessMsg("");
  };

  const confirmarCita = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!fechaSeleccionada || !horaSeleccionada) {
      setErrorMsg("Debes seleccionar fecha y hora");
      return;
    }

    try {
      await agendarCita(horaSeleccionada, {
        usuarioId: usuario._id,
        estado: "pendiente",
        servicios: [{ nombre, costo: precio }],
      });

      setSuccessMsg("Cita agendada correctamente");

      setTimeout(() => {
        cerrarModal();
      }, 2000);

    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Error al agendar la cita"
      );
    }
  };

  return (
    <div className="cell small-12 medium-6 large-4">
      <div className="card card-servicio text-center">
        <div className="card-divider card-servicio-header">
          <div className="icono-servicio">
            <i className={icono}></i>
          </div>
          <h4 className="titulo-servicio">{nombre}</h4>
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
            <h4>Agendar cita para {nombre}</h4>

            {errorMsg && (
              <div className="alert-error">
                <p>{errorMsg}</p>
                <button
                  className="close-button-custom"
                  type="button"
                  onClick={() => setErrorMsg("")}
                >
                  &times;
                </button>
              </div>
            )}

            {successMsg && (
              <div className="alert-success">
                <p>{successMsg}</p>
                <button
                  className="close-button-custom"
                  type="button"
                  onClick={() => setSuccessMsg("")}
                >
                  &times;
                </button>
              </div>
            )}

            <label>Selecciona la fecha:</label>
            <DatePicker
              selected={fechaSeleccionada}
              onChange={(date) => setFechaSeleccionada(date)}
              filterDate={(date) =>
                fechasDisponibles.includes(date.toDateString())
              }
              placeholderText="Selecciona una fecha"
              dateFormat="dd/MM/yyyy"
            />

            <label>Selecciona la hora:</label>
            <select
              value={horaSeleccionada}
              onChange={(e) => setHoraSeleccionada(e.target.value)}
              disabled={!fechaSeleccionada}
            >
              <option value="">Selecciona...</option>
              {horasDisponibles.map((cita) => (
                <option key={cita._id} value={cita._id}>
                  {cita.hora}
                </option>
              ))}
            </select>

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
