import React, { useEffect, useState } from "react";
import "foundation-sites/dist/css/foundation.min.css";
import "./cardServicio.css";
import { getCitasPorEstado, agendarCita } from "../../services/CitasService";
import { useAuth } from "../../context/UseAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {buscarMotoConGemini} from "../../services/GeminiService";

const traducirTipo = (type) => {
  const tipos = {
    sport: "Deportiva",
    naked: "Naked",
    cruiser: "Crucero",
    touring: "Turismo",
    enduro: "Enduro",
    motocross: "Motocross",
    scooter: "Scooter",
    trail: "Trail",
    adventure: "Aventura",
    supermoto: "Supermoto",
    classic: "Clásica",
    chopper: "Chopper",
    "dual sport": "Doble propósito",
    standard: "Estándar",
    "off-road": "Fuera de carretera",
    "sport touring": "Sport Touring",
  };
  return tipos[type?.toLowerCase()] || type || "No especificado";
};

const buscarMotocicletasAPI = (make, model) =>
  axios.get("/api/motocicletas/buscar", { params: { make, model } });

const guardarMotocicletaSeleccionada = (moto) =>
  axios.post("/api/motocicletas/guardar", moto);

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

  const [busquedaMarca, setBusquedaMarca] = useState("");
  const [busquedaModelo, setBusquedaModelo] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [motocicletaId, setMotocicletaId] = useState("");
  const [guardandoMoto, setGuardandoMoto] = useState(false);

  const [mostrarFormManual, setMostrarFormManual] = useState(false);
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
  const [guardandoManual, setGuardandoManual] = useState(false);

  const { usuario, isAuthenticated, openLoginModal } = useAuth();

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
    setResultadosBusqueda([]);
    setErrorBusqueda("");
    setMotocicletaId("");
    setMostrarFormManual(false);
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
  if (!busquedaMarca && !busquedaModelo) {
    setErrorBusqueda("Escribe al menos la marca o el modelo.");
    return;
  }

  setBuscando(true);
  setErrorBusqueda("");
  setResultadosBusqueda([]);
  setMotocicletaId("");
  setMostrarFormManual(false);

  let encontradaEnAPI = false;

  // ── 1. Buscar en API externa ──
  try {
    const res = await buscarMotocicletasAPI(busquedaMarca, busquedaModelo);
    const datos = Array.isArray(res.data) ? res.data : [];

    if (datos.length > 0) {
      setResultadosBusqueda(datos);
      encontradaEnAPI = true;
    }
  // eslint-disable-next-line no-unused-vars
  } catch (err) {
    // 404 u otro error → seguimos al siguiente paso
  }

  // ── 2. Si no se encontró en API → consultar Gemini ──
  if (!encontradaEnAPI) {
    setErrorBusqueda("Consultando IA, espera un momento...");
    try {
      const motoGemini = await buscarMotoConGemini(busquedaMarca, busquedaModelo);

      if (motoGemini) {
        setResultadosBusqueda([motoGemini]);
        setErrorBusqueda("");
      } else {
        // Gemini no encontró nada → formulario manual
        setMostrarFormManual(true);
        setMotoManual((prev) => ({
          ...prev,
          make: busquedaMarca,
          model: busquedaModelo,
        }));
        setErrorBusqueda("");
      }
    } catch {
      // Gemini falló → formulario manual
      setMostrarFormManual(true);
      setMotoManual((prev) => ({
        ...prev,
        make: busquedaMarca,
        model: busquedaModelo,
      }));
      setErrorBusqueda("");
    }
  }

  setBuscando(false);
};

  const handleSeleccionarMoto = async (e) => {
    const index = parseInt(e.target.value);
    if (isNaN(index)) {
      setMotocicletaId("");
      return;
    }
    const moto = resultadosBusqueda[index];
    if (!moto) return;

    setGuardandoMoto(true);
    setErrorBusqueda("");

    try {
      const res = await guardarMotocicletaSeleccionada(moto);
      setMotocicletaId(res.data._id);
    } catch {
      setErrorBusqueda("Error al guardar la motocicleta seleccionada.");
      setMotocicletaId("");
    } finally {
      setGuardandoMoto(false);
    }
  };

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
      setMostrarFormManual(false);
    } catch {
      setErrorBusqueda("Error al guardar la motocicleta.");
    } finally {
      setGuardandoManual(false);
    }
  };

  const confirmarCita = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!fechaSeleccionada || !citaSeleccionada) {
      setErrorMsg("Debes seleccionar fecha y hora.");
      return;
    }
    if (!motocicletaId) {
      setErrorMsg("Debes seleccionar tu motocicleta.");
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
        motocicletaId: motocicletaId,
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
              <div className="alert-error">
                <p>{errorMsg}</p>
                <button
                  className="close-button-custom"
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
                  onClick={() => setSuccessMsg("")}
                >
                  &times;
                </button>
              </div>
            )}

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
            />

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
                <option key={cita._id.toString()} value={cita._id.toString()}>
                  {formatearHora(cita.hora)}
                </option>
              ))}
            </select>

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

            {/* ── Búsqueda de moto ── */}
            <label>Busca tu motocicleta:</label>
            <div className="moto-search-row">
              <input
                type="text"
                placeholder="Marca (ej: Yamaha)"
                value={busquedaMarca}
                onChange={(e) => {
                  setBusquedaMarca(e.target.value);
                  setErrorBusqueda("");
                }}
                onKeyDown={(e) => e.key === "Enter" && buscarMotos()}
              />
              <input
                type="text"
                placeholder="Modelo (ej: MT-07)"
                value={busquedaModelo}
                onChange={(e) => {
                  setBusquedaModelo(e.target.value);
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

            {/* ── Select de resultados ── */}
            {resultadosBusqueda.length > 0 && !mostrarFormManual && (
              <>
                <label>Selecciona el año exacto:</label>
                <select
                  defaultValue=""
                  onChange={handleSeleccionarMoto}
                  disabled={guardandoMoto}
                >
                  <option value="">
                    {guardandoMoto ? "Guardando..." : "Selecciona el año..."}
                  </option>
                  {resultadosBusqueda.map((moto, index) => (
                    <option key={index} value={index}>
                      {moto.year} — {moto.make} {moto.model} (
                      {traducirTipo(moto.type)})
                    </option>
                  ))}
                </select>
              </>
            )}

            {motocicletaId && !mostrarFormManual && (
              <p className="moto-confirmada">
                ✓ Motocicleta registrada correctamente
              </p>
            )}

            {/* ── Formulario manual ── */}
            {mostrarFormManual && (
              <div className="form-manual-moto">
                <p className="form-info">
                  Tu moto no está en nuestra base de datos. Ingresa los datos
                  manualmente:
                </p>

                <div className="moto-search-row">
                  <input
                    placeholder="Marca *"
                    value={motoManual.make}
                    onChange={(e) =>
                      setMotoManual({ ...motoManual, make: e.target.value })
                    }
                  />
                  <input
                    placeholder="Modelo *"
                    value={motoManual.model}
                    onChange={(e) =>
                      setMotoManual({ ...motoManual, model: e.target.value })
                    }
                  />
                  <input
                    placeholder="Año *"
                    type="number"
                    value={motoManual.year}
                    onChange={(e) =>
                      setMotoManual({ ...motoManual, year: e.target.value })
                    }
                  />
                </div>

                <div className="moto-search-row">
                  <input
                    placeholder="Cilindraje en cc * (ej: 150)"
                    type="number"
                    value={motoManual.displacement}
                    onChange={(e) =>
                      setMotoManual({
                        ...motoManual,
                        displacement: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Tipo de motor (ej: Monocilíndrico)"
                    value={motoManual.engine}
                    onChange={(e) =>
                      setMotoManual({ ...motoManual, engine: e.target.value })
                    }
                  />
                  <input
                    placeholder="Tipo (ej: Trail, Deportiva)"
                    value={motoManual.type}
                    onChange={(e) =>
                      setMotoManual({ ...motoManual, type: e.target.value })
                    }
                  />
                </div>

                <div className="moto-search-row">
                  <input
                    placeholder="Freno delantero (ej: Disco simple)"
                    value={motoManual.front_brakes}
                    onChange={(e) =>
                      setMotoManual({
                        ...motoManual,
                        front_brakes: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Freno trasero (ej: Tambor)"
                    value={motoManual.rear_brakes}
                    onChange={(e) =>
                      setMotoManual({
                        ...motoManual,
                        rear_brakes: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="moto-search-row">
                  <input
                    placeholder="Combustible (ej: Carburador)"
                    value={motoManual.fuel_system}
                    onChange={(e) =>
                      setMotoManual({
                        ...motoManual,
                        fuel_system: e.target.value,
                      })
                    }
                  />
                  <input
                    placeholder="Transmisión (ej: 5 velocidades)"
                    value={motoManual.transmission}
                    onChange={(e) =>
                      setMotoManual({
                        ...motoManual,
                        transmission: e.target.value,
                      })
                    }
                  />
                </div>

                {errorBusqueda && <p className="form-error">{errorBusqueda}</p>}

                {motocicletaId ? (
                  <p className="moto-confirmada">
                    ✓ Motocicleta registrada correctamente
                  </p>
                ) : (
                  <button
                    type="button"
                    className="button primary"
                    onClick={handleGuardarManual}
                    disabled={guardandoManual}
                  >
                    {guardandoManual ? "Guardando..." : "Confirmar motocicleta"}
                  </button>
                )}
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
