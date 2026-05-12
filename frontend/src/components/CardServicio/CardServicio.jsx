import React, { useEffect, useState } from "react";
import "foundation-sites/dist/css/foundation.min.css";
import "./cardServicio.css";
import { getCitasPorEstado, agendarCita } from "../../services/CitasService";
import { useAuth } from "../../context/UseAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getAllMotocicletas } from "../../services/AdminService";

const CardServicio = ({ nombre, descripcion, icono, precio }) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citasDisponibles, setCitasDisponibles] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [motocicletas, setMotocicletas] = useState([]);
  const [motocicletaId, setMotocicletaId] = useState("");

  const { usuario, isAuthenticated, openLoginModal } = useAuth();

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await getCitasPorEstado("disponible");
        const citas = res.data;

        console.log("Citas disponibles:", citas); // ← verificá la estructura

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
    const fetchMotocicletas = async () => {
      try {
        const res = await getAllMotocicletas();
        setMotocicletas(res.data);
      } catch (error) {
        console.error("Error fetching motocicletas:", error);
      }
    };
    if (mostrarModal) fetchMotocicletas();
  }, [mostrarModal]);

  const handleAgendar = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    } else {
      abrirModal();
    }
  };

  useEffect(() => {
    if (!fechaSeleccionada) return;

    const fechaStr = fechaSeleccionada.toDateString();

    const horas = citasDisponibles.filter(
      (cita) => new Date(cita.fecha).toDateString() === fechaStr,
    );

    setHorasDisponibles(horas);
    setCitaSeleccionada(null);
  }, [fechaSeleccionada, citasDisponibles]);

  const abrirModal = () => {
    setMostrarModal(true);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setFechaSeleccionada(null);
    setCitaSeleccionada(null);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const confirmarCita = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!fechaSeleccionada || !citaSeleccionada) {
      setErrorMsg("Debes seleccionar fecha y hora");
      return;
    }

    console.log("Confirmando cita:", citaSeleccionada); // ← verificá los datos

    try {
      await agendarCita(citaSeleccionada._id.toString(), {
        horaSeleccionada: citaSeleccionada.hora,
        usuarioId: usuario.id,
        estado: "pendiente",
        servicios: [{ nombre, costo: precio }],
        placaMoto: numeroPlaca,
        motocicletaId: motocicletaId,
      });

      setSuccessMsg("¡Cita agendada correctamente!");

      setTimeout(() => {
        cerrarModal();
      }, 2000);
    } catch (error) {
      console.error("Error agendando cita:", error);
      setErrorMsg(error.response?.data?.message || "Error al agendar la cita");
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
          <button className="button btn-servicio" onClick={handleAgendar}>
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
              value={citaSeleccionada?._id?.toString() || ""}
              onChange={(e) => {
                const cita = horasDisponibles.find(
                  (c) => c._id.toString() === e.target.value, // ✅ .toString() en ambos lados
                );
                console.log("Cita seleccionada:", cita); // ← verificá que no sea undefined
                setCitaSeleccionada(cita || null);
              }}
              disabled={!fechaSeleccionada}
            >
              <option value="">Selecciona...</option>
              {horasDisponibles.map((cita) => (
                <option key={cita._id.toString()} value={cita._id.toString()}>
                  {" "}
                  {/* ✅ .toString() */}
                  {cita.hora}
                </option>
              ))}
            </select>

            <label>Inserta el número de placa:</label>
            <input
              type="text"
              placeholder="Ej: ABC123"
              value={numeroPlaca}
              onChange={(e) => setNumeroPlaca(e.target.value)}
            />

            <label>Selecciona el modelo de tu motocicleta:</label>
            <select
              value={motocicletaId}
              onChange={(e) => setMotocicletaId(e.target.value)}
            >
              <option value="">Selecciona...</option>
              {motocicletas.map((moto) => (
                <option key={moto._id} value={moto._id}>
                  {moto.nombre} {moto.marca}
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
