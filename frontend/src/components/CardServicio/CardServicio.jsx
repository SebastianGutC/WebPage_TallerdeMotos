import React, { useEffect, useState } from "react";
import "foundation-sites/dist/css/foundation.min.css";
import "./cardServicio.css";
import { getCitasPorEstado, agendarCita } from "../../services/CitasService";
import { guardarMotocicletaSeleccionada } from "../../services/motocicletasService";
import { buscarMotocicleta } from "../../services/motocicletasService";
import { useAuth } from "../../context/UseAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const formatearHora = (hora24) => {
  if (!hora24) return "";
  const [hora, minutos] = hora24.split(":");
  let h = parseInt(hora, 10);
  const periodo = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h === 0 ? 12 : h;
  return `${h}:${minutos} ${periodo}`;
};

const CardServicio = ({ nombre, descripcion, icono, precio }) => {
  // ── Citas ──
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citasDisponibles, setCitasDisponibles] = useState([]);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [numeroPlaca, setNumeroPlaca] = useState("");
  const [errorPlaca, setErrorPlaca] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ── Búsqueda de moto ──
  const [busquedaMarca, setBusquedaMarca] = useState("");
  const [busquedaModelo, setBusquedaModelo] = useState("");
  const [busquedaAnio, setBusquedaAnio] = useState("");
  const [motoEncontrada, setMotoEncontrada] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [motocicletaId, setMotocicletaId] = useState("");
  const [guardandoMoto, setGuardandoMoto] = useState(false);
  const [seleccionMoto, setSeleccionMoto] = useState(""); // "encontrada" | "otra"

  // ── Formulario manual ──
  const [motoManual, setMotoManual] = useState({
    make: "",
    model: "",
    year: "",
    type: "",
    displacement: "",
    engine: "",
    front_brakes: "",
    rear_brakes: "",
    fuel_system: "",
    transmission: "",
  });
  // eslint-disable-next-line no-unused-vars
  const [guardandoManual, setGuardandoManual] = useState(false);

  const { usuario, isAuthenticated, openLoginModal } = useAuth();

  // ── Cargar citas disponibles ──
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await getCitasPorEstado("disponible");
        setCitasDisponibles(res.data);
        setFechasDisponibles(
          res.data.map((c) => new Date(c.fecha).toDateString()),
        );
      } catch (error) {
        console.error("Error fetching citas:", error);
      }
    };
    if (mostrarModal) fetchCitas();
  }, [mostrarModal]);

  // ── Filtrar horas por fecha ──
  useEffect(() => {
    if (!fechaSeleccionada) return;
    const fechaStr = fechaSeleccionada.toDateString();
    setHorasDisponibles(
      citasDisponibles.filter(
        (c) => new Date(c.fecha).toDateString() === fechaStr,
      ),
    );
    setCitaSeleccionada(null);
  }, [fechaSeleccionada, citasDisponibles]);

  const handleAgendar = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    abrirModal();
  };

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
    setNumeroPlaca("");
    setErrorPlaca("");
    setBusquedaMarca("");
    setBusquedaModelo("");
    setBusquedaAnio("");
    setMotoEncontrada(null);
    setSeleccionMoto("");
    setErrorBusqueda("");
    setMotocicletaId("");
    setMotoManual({
      make: "",
      model: "",
      year: "",
      type: "",
      displacement: "",
      engine: "",
      front_brakes: "",
      rear_brakes: "",
      fuel_system: "",
      transmission: "",
    });
  };

  const buscarMotos = async () => {
    if (!busquedaModelo.trim()) {
      setErrorBusqueda("El modelo de la moto es obligatorio.");
      return;
    }
    if (!busquedaAnio.trim()) {
      setErrorBusqueda("El año de la moto es obligatorio.");
      return;
    }
    if (busquedaAnio.length !== 4 || isNaN(busquedaAnio)) {
      setErrorBusqueda("Ingresa un año válido. Ej: 2020");
      return;
    }

    setBuscando(true);
    setMotoEncontrada(null);
    setSeleccionMoto("");
    setMotocicletaId("");
    setErrorBusqueda("Consultando, espera un momento...");

    try {
      const res = await buscarMotocicleta(
        busquedaMarca,
        busquedaModelo,
        busquedaAnio,
      );
      console.log("Respuesta buscarMotocicleta:", res.data);

      const moto = res.data;

      if (moto && moto !== null) {
        setMotoEncontrada(moto);
        setErrorBusqueda("");
      } else {
        setMotoEncontrada(null);
        setSeleccionMoto("otra");
        setMotoManual((prev) => ({
          ...prev,
          make: busquedaMarca,
          model: busquedaModelo,
          year: busquedaAnio,
        }));
        setErrorBusqueda("");
      }
    } catch (error) {
      // 404 = no encontrada → formulario manual
      if (error.response?.status === 404) {
        setMotoEncontrada(null);
        setSeleccionMoto("otra");
        setMotoManual((prev) => ({
          ...prev,
          make: busquedaMarca,
          model: busquedaModelo,
          year: busquedaAnio,
        }));
        setErrorBusqueda("");
      } else {
        setErrorBusqueda("Error al consultar. Intenta de nuevo.");
      }
    } finally {
      setBuscando(false);
    }
  };

  // ── Cuando el usuario elige en el select ──
  const handleSeleccionMoto = async (e) => {
    const valor = e.target.value;
    setSeleccionMoto(valor);
    setMotocicletaId("");

    if (valor === "encontrada" && motoEncontrada) {
      setGuardandoMoto(true);
      try {
        console.log("Guardando moto:", motoEncontrada); // ← log
        const res = await guardarMotocicletaSeleccionada(motoEncontrada);
        console.log("Respuesta guardar:", res.data); // ← log
        setMotocicletaId(res.data._id);
      } catch (error) {
        console.log("Error guardando:", error.response?.data); // ← log
        console.log("Status:", error.response?.status);
      } finally {
        setGuardandoMoto(false);
      }
    }

    if (valor === "otra") {
      setMotoManual((prev) => ({
        ...prev,
        make: busquedaMarca,
        model: busquedaModelo,
        year: busquedaAnio,
      }));
    }
  };

  // ── Guardar moto manual ──
  // eslint-disable-next-line no-unused-vars
  const handleGuardarManual = async () => {
    const { make, model, year, displacement } = motoManual;
    if (!make || !model || !year || !displacement) {
      setErrorBusqueda("Marca, modelo, año y cilindraje son obligatorios.");
      return;
    }
    setGuardandoManual(true);
    try {
      const res = await guardarMotocicletaSeleccionada(motoManual);
      setMotocicletaId(res.data._id);
    } catch {
      setErrorBusqueda("Error al guardar la motocicleta.");
    } finally {
      setGuardandoManual(false);
    }
  };

  // ── Confirmar cita ──
  const confirmarCita = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!fechaSeleccionada || !citaSeleccionada) {
      setErrorMsg("Debes seleccionar fecha y hora.");
      return;
    }
    if (!motocicletaId) {
      setErrorMsg("Debes seleccionar y confirmar tu motocicleta.");
      return;
    }
    if (!numeroPlaca.trim() || errorPlaca) {
      setErrorMsg("Debes ingresar un número de placa válido.");
      return;
    }

    try {
      await agendarCita(citaSeleccionada._id.toString(), {
        horaSeleccionada: citaSeleccionada.hora,
        usuarioId: usuario.id,
        estado: "pendiente",
        servicios: [{ nombre, costo: precio }],
        placaMoto: numeroPlaca,
        motocicletaId,
      });

      setSuccessMsg("¡Cita agendada correctamente!");
      setTimeout(() => cerrarModal(), 2000);
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Error al agendar la cita.");
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
              <div className="alert-error error-agendar">
                {" "}
                <p>{errorMsg}</p>
                <button className="alert-close" onClick={() => setErrorMsg("")}>
                  &times;
                </button>
              </div>
            )}
            {successMsg && (
              <div className="alert-success">
                <p>{successMsg}</p>
                <button
                  className="close-button-custom"
                  onClick={() => setSuccessMsg("")}
                >
                  &times;
                </button>
              </div>
            )}
            <div className="agendar-row">
              <div className="contenedor-fecha">
                {/* ── Fecha ── */}
                <label>Selecciona la fecha:</label>
                <DatePicker
                  selected={fechaSeleccionada}
                  onChange={(date) => setFechaSeleccionada(date)}
                  filterDate={(date) =>
                    fechasDisponibles.includes(date.toDateString())
                  }
                  placeholderText="Selecciona una fecha"
                  dateFormat="dd/MM/yyyy"
                  className="date-picker-custom"
                />
              </div>

              <div className="contenedor-hora">
                {/* ── Hora ── */}
                <label>Selecciona la hora:</label>
                <select
                  value={citaSeleccionada?._id?.toString() || ""}
                  onChange={(e) => {
                    const cita = horasDisponibles.find(
                      (c) => c._id.toString() === e.target.value,
                    );
                    setCitaSeleccionada(cita || null);
                  }}
                  disabled={!fechaSeleccionada}
                >
                  <option value="">Selecciona...</option>
                  {horasDisponibles.map((cita) => (
                    <option
                      key={cita._id.toString()}
                      value={cita._id.toString()}
                    >
                      {formatearHora(cita.hora)}
                    </option>
                  ))}
                </select>{" "}
              </div>
              <div className="contenedor-placa">
                {/* ── Placa ── */}
                <label>Número de placa:</label>
                <input
                  type="text"
                  placeholder="Ej: ABC123"
                  maxLength={6}
                  value={numeroPlaca}
                  onChange={(e) => {
                    const valor = e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "");
                    setNumeroPlaca(valor);
                    if (valor.length === 0) {
                      setErrorPlaca("");
                    } else if (valor.length <= 3 && /^[A-Z]*$/.test(valor)) {
                      setErrorPlaca("");
                    } else if (
                      valor.length > 3 &&
                      valor.length <= 5 &&
                      /^[A-Z]{3}[0-9]*$/.test(valor)
                    ) {
                      setErrorPlaca("");
                    } else if (
                      valor.length === 6 &&
                      /^[A-Z]{3}[0-9]{2}[A-Z0-9]$/.test(valor)
                    ) {
                      setErrorPlaca("");
                    } else {
                      setErrorPlaca("Formato inválido. Ej: ABC123");
                    }
                  }}
                />
                {errorPlaca && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "0.75rem",
                      marginTop: "2px",
                      display: "block",
                    }}
                  >
                    {errorPlaca}
                  </span>
                )}
              </div>
            </div>

            {/* ── Búsqueda de moto ── */}
            <label>Busca tu motocicleta:</label>
            <div className="moto-search-row">
              <input
                type="text"
                placeholder="Marca (ej: Yamaha) — opcional"
                value={busquedaMarca}
                onChange={(e) => {
                  setBusquedaMarca(e.target.value);
                  setErrorBusqueda("");
                }}
                onKeyDown={(e) => e.key === "Enter" && buscarMotos()}
              />
              <input
                type="text"
                placeholder="Modelo * (ej: XTZ 150)"
                value={busquedaModelo}
                onChange={(e) => {
                  setBusquedaModelo(e.target.value);
                  setErrorBusqueda("");
                }}
                onKeyDown={(e) => e.key === "Enter" && buscarMotos()}
              />
              <input
                type="number"
                placeholder="Año (ej: 2020)"
                value={busquedaAnio}
                onChange={(e) => {
                  setBusquedaAnio(e.target.value);
                  setErrorBusqueda("");
                }}
                onKeyDown={(e) => e.key === "Enter" && buscarMotos()}
              />
              <button
                type="button"
                className="button secondary"
                onClick={buscarMotos}
                disabled={buscando}
              >
                {buscando ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {errorBusqueda && <p className="form-error">{errorBusqueda}</p>}

            {/* ── Select: moto encontrada u otra ── */}
            {motoEncontrada && (
              <>
                <label>¿Es tu motocicleta?</label>
                <select
                  value={seleccionMoto}
                  onChange={handleSeleccionMoto}
                  disabled={guardandoMoto}
                >
                  <option value="">Selecciona...</option>
                  <option value="encontrada">
                    {motoEncontrada.year} — {motoEncontrada.make}{" "}
                    {motoEncontrada.model} ({motoEncontrada.type})
                  </option>
                  <option value="otra">
                    Otra (ingresar datos manualmente)
                  </option>
                </select>
              </>
            )}

            {!motoEncontrada &&
              !buscando &&
              busquedaModelo &&
              errorBusqueda && (
                <>
                  <label>¿Es tu motocicleta?</label>
                  <select value={seleccionMoto} onChange={handleSeleccionMoto}>
                    <option value="">Selecciona...</option>
                    <option value="otra">
                      Otra (ingresar datos manualmente)
                    </option>
                  </select>
                </>
              )}

            {/* ── Confirmación moto guardada ── */}
            {motocicletaId && seleccionMoto === "encontrada" && (
              <p className="moto-confirmada" display="none">
                Motocicleta registrada correctamente
              </p>
            )}

            {/* ── Formulario manual ── */}
            {seleccionMoto === "otra" && (
              <div className="form-manual-moto">
                <p className="form-info">
                  Ingresa los datos de tu motocicleta:
                </p>

                <div className="form-manual-grid">
                  <div className="modal-field">
                    <label>Marca *</label>
                    <input
                      placeholder="Ej: Yamaha"
                      value={motoManual.make}
                      onChange={(e) =>
                        setMotoManual({ ...motoManual, make: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Modelo *</label>
                    <input
                      placeholder="Ej: XTZ 150"
                      value={motoManual.model}
                      onChange={(e) =>
                        setMotoManual({ ...motoManual, model: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Año *</label>
                    <input
                      type="number"
                      placeholder="Ej: 2020"
                      value={motoManual.year}
                      onChange={(e) =>
                        setMotoManual({ ...motoManual, year: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Cilindraje (cc) *</label>
                    <input
                      type="number"
                      placeholder="Ej: 150"
                      value={motoManual.displacement}
                      onChange={(e) =>
                        setMotoManual({
                          ...motoManual,
                          displacement: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Tipo de motor</label>
                    <input
                      placeholder="Ej: Monocilíndrico"
                      value={motoManual.engine}
                      onChange={(e) =>
                        setMotoManual({ ...motoManual, engine: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Tipo de moto</label>
                    <input
                      placeholder="Ej: Trail, Deportiva"
                      value={motoManual.type}
                      onChange={(e) =>
                        setMotoManual({ ...motoManual, type: e.target.value })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Freno delantero</label>
                    <input
                      placeholder="Ej: Disco simple"
                      value={motoManual.front_brakes}
                      onChange={(e) =>
                        setMotoManual({
                          ...motoManual,
                          front_brakes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Freno trasero</label>
                    <input
                      placeholder="Ej: Tambor"
                      value={motoManual.rear_brakes}
                      onChange={(e) =>
                        setMotoManual({
                          ...motoManual,
                          rear_brakes: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Combustible</label>
                    <input
                      placeholder="Ej: Carburador"
                      value={motoManual.fuel_system}
                      onChange={(e) =>
                        setMotoManual({
                          ...motoManual,
                          fuel_system: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="modal-field">
                    <label>Transmisión</label>
                    <input
                      placeholder="Ej: 5 velocidades"
                      value={motoManual.transmission}
                      onChange={(e) =>
                        setMotoManual({
                          ...motoManual,
                          transmission: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {errorBusqueda && <p className="form-error">{errorBusqueda}</p>}
              </div>
            )}

            {/* ── Botones finales ── */}
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
