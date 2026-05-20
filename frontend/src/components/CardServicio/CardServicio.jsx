import React, { useEffect, useState } from "react";
import "foundation-sites/dist/css/foundation.min.css";
import "./cardServicio.css";
import { getCitasPorEstado, agendarCita } from "../../services/CitasService";
import { guardarMotocicletaSeleccionada } from "../../services/motocicletasService";
import { buscarMotocicleta } from "../../services/motocicletasService";
import { useAuth } from "../../context/UseAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatearHora } from "../../utils/formatoHora";

// ── Helper: parsear fecha ISO sin zona horaria ──
const parsearFechaISO = (isoString) => {
  const soloFecha = isoString.substring(0, 10); // "2026-05-20"
  const [year, month, day] = soloFecha.split("-").map(Number);
  return new Date(year, month - 1, day);
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
  const [horasAgrupadas, setHorasAgrupadas] = useState({});

  // ── Búsqueda de moto ──
  const [busquedaMarca, setBusquedaMarca] = useState("");
  const [busquedaModelo, setBusquedaModelo] = useState("");
  const [busquedaAnio, setBusquedaAnio] = useState("");
  const [motoEncontrada, setMotoEncontrada] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [mensajeBusqueda, setMensajeBusqueda] = useState("");
  const [motocicletaId, setMotocicletaId] = useState("");
  const [seleccionMoto, setSeleccionMoto] = useState("");
  const [mostrarFormularioManual, setMostrarFormularioManual] = useState(false);

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

  const { usuario, isAuthenticated, openLoginModal } = useAuth();

  // ── Cargar citas disponibles ──
  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await getCitasPorEstado("disponible");
        setCitasDisponibles(res.data);
        setFechasDisponibles(
          res.data.map((c) => parsearFechaISO(c.fecha).toDateString()),
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

    const fechaStr = new Date(
      fechaSeleccionada.getFullYear(),
      fechaSeleccionada.getMonth(),
      fechaSeleccionada.getDate(),
    ).toDateString();

    const citasDelDia = citasDisponibles.filter(
      (c) => parsearFechaISO(c.fecha).toDateString() === fechaStr,
    );

    // Agrupar por hora → { "08:00 AM": [cita1, cita2, cita3], ... }
    const grupos = {};
    for (const cita of citasDelDia) {
      if (!grupos[cita.hora]) grupos[cita.hora] = [];
      grupos[cita.hora].push(cita);
    }

    // Guardar el grupo completo para poder elegir técnico al confirmar
    setHorasAgrupadas(grupos); // { hora: [citas] }

    // Para el select solo mostrar horas únicas (la primera de cada grupo)
    const unicas = Object.values(grupos).map((grupo) => grupo[0]);
    setHorasDisponibles(unicas);
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
    setMensajeBusqueda("");
    setMotocicletaId("");
    setMostrarFormularioManual(false);
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
    // ── Limpiar estado anterior SIEMPRE ──
    setMotoEncontrada(null);
    setSeleccionMoto("");
    setMotocicletaId("");
    setErrorBusqueda("");
    setMensajeBusqueda("");
    setMostrarFormularioManual(false);

    // ── Validaciones ──
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
    if (!busquedaMarca.trim()) {
      setErrorBusqueda("Ingresa la marca de la moto");
      return;
    }

    // ── Iniciar búsqueda ──
    setBuscando(true);
    setMensajeBusqueda("Consultando base de datos, espera un momento...");

    try {
      const res = await buscarMotocicleta(
        busquedaMarca,
        busquedaModelo,
        busquedaAnio,
      );
      const moto = res.data;
      setMensajeBusqueda("");

      if (moto && moto !== null) {
        if (moto._id) {
          // ── Ya existe en BD: usar _id directo, sin guardar ──
          setMotocicletaId(moto._id);
        } else {
          // ── Viene de API externa: guardar en BD y obtener _id ──
          try {
            const guardada = await guardarMotocicletaSeleccionada(moto);
            setMotocicletaId(guardada.data._id);
          } catch {
            setErrorBusqueda(
              "Error al registrar la motocicleta. Intenta de nuevo.",
            );
            setBuscando(false);
            return;
          }
        }
        setMotoEncontrada(moto);
        setSeleccionMoto("encontrada");
        setMostrarFormularioManual(false);
      } else {
        setMotoEncontrada(null);
        setSeleccionMoto("otra");
        setMostrarFormularioManual(true);
        setMotoManual((prev) => ({
          ...prev,
          make: busquedaMarca,
          model: busquedaModelo,
          year: busquedaAnio,
        }));
        setErrorBusqueda(
          "No tenemos registros de tu moto en nuestra base de datos. Por favor intenta digitándolo manualmente o verifica tu búsqueda.",
        );
      }
    } catch (error) {
      setMensajeBusqueda("");
      if (error.response?.status === 404) {
        setMotoEncontrada(null);
        setSeleccionMoto("otra");
        setMostrarFormularioManual(true);
        setMotoManual((prev) => ({
          ...prev,
          make: busquedaMarca,
          model: busquedaModelo,
          year: busquedaAnio,
        }));
        setErrorBusqueda(
          "No tenemos registros de tu moto en nuestra base de datos. Por favor intenta digitándolo manualmente o verifica tu búsqueda.",
        );
      } else {
        setErrorBusqueda("Error al consultar. Intenta de nuevo.");
      }
    } finally {
      setBuscando(false);
    }
  };

  const confirmarCita = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!fechaSeleccionada || !citaSeleccionada) {
      setErrorMsg("Debes seleccionar fecha y hora.");
      return;
    }
    if (!numeroPlaca.trim() || errorPlaca) {
      setErrorMsg("Debes ingresar un número de placa válido.");
      return;
    }

    let idMotoFinal = motocicletaId;

    if (seleccionMoto === "otra") {
      const { make, model, year, displacement } = motoManual;
      if (!make || !model || !year || !displacement) {
        setErrorMsg(
          "Completa los campos obligatorios de la motocicleta: Marca, Modelo, Año y Cilindraje.",
        );
        return;
      }
      try {
        const res = await guardarMotocicletaSeleccionada(motoManual);
        idMotoFinal = res.data._id;
        setMotocicletaId(idMotoFinal);
      } catch {
        setErrorMsg("Error al guardar la motocicleta. Intenta de nuevo.");
        return;
      }
    }

    if (!idMotoFinal) {
      setErrorMsg("Debes seleccionar y confirmar tu motocicleta.");
      return;
    }

    const grupoHora = horasAgrupadas[citaSeleccionada.hora] || [
      citaSeleccionada,
    ];
    const citaAsignada =
      grupoHora[Math.floor(Math.random() * grupoHora.length)];

    try {
      await agendarCita(citaAsignada._id.toString(), {
        horaSeleccionada: citaAsignada.hora,
        usuarioId: usuario.id,
        estado: "pendiente",
        servicios: [{ nombre, costo: precio }],
        placaMoto: numeroPlaca,
        motocicletaId: idMotoFinal,
      });

      setSuccessMsg("¡Cita agendada correctamente!");
      setErrorBusqueda("");
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
          <div
            className={`modal modal-dos-columnas ${mostrarFormularioManual ? "modal-expandido" : ""}`}
          >
            <h4>Agendar cita para {nombre}</h4>

            {errorMsg && (
              <div className="alert-error error-agendar">
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

            <div className="modal-columnas">
              {/* ── Columna izquierda ── */}
              <div className="modal-columna-izquierda">
                <div className="agendar-row">
                  <div className="contenedor-fecha">
                    <label>Selecciona la fecha:</label>
                    <DatePicker
                      selected={fechaSeleccionada}
                      onChange={(date) => setFechaSeleccionada(date)}
                      filterDate={(date) => {
                        const fechaLocal = new Date(
                          date.getFullYear(),
                          date.getMonth(),
                          date.getDate(),
                        ).toDateString();
                        console.log(
                          "filterDate comparando:",
                          fechaLocal,
                          "| disponibles:",
                          fechasDisponibles,
                        );

                        return fechasDisponibles.includes(fechaLocal);
                      }}
                      onChangeRaw={(e) => e.preventDefault()}
                      placeholderText="Selecciona una fecha"
                      dateFormat="dd/MM/yyyy"
                      className="date-picker-custom"
                    />
                  </div>

                  <div className="contenedor-hora">
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
                      {[...horasDisponibles]
                        .sort((a, b) => a.hora.localeCompare(b.hora))
                        .map((cita) => (
                          <option
                            key={cita._id.toString()}
                            value={cita._id.toString()}
                          >
                            {formatearHora(cita.hora)}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="contenedor-placa">
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
                        } else if (
                          valor.length <= 3 &&
                          /^[A-Z]*$/.test(valor)
                        ) {
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
                      <span className="placa-error-msg">{errorPlaca}</span>
                    )}
                  </div>
                </div>

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

                {mensajeBusqueda && (
                  <p className="mensaje-busqueda">{mensajeBusqueda}</p>
                )}

                {errorBusqueda && <p className="form-error">{errorBusqueda}</p>}

                {motoEncontrada && seleccionMoto === "encontrada" && (
                  <div className="moto-encontrada-info">
                    <p className="moto-confirmada">
                      Motocicleta encontrada en nuestro sistema:
                    </p>
                    <p className="moto-detalle">
                      {motoEncontrada.year ?? motoEncontrada.modelo} —{" "}
                      {motoEncontrada.make ?? motoEncontrada.marca}{" "}
                      {motoEncontrada.model ?? motoEncontrada.nombre} (
                      {motoEncontrada.type ?? motoEncontrada.tipo})
                    </p>
                    <button
                      type="button"
                      className="button secondary btn-cambiar-moto"
                      onClick={() => {
                        setSeleccionMoto("otra");
                        setMotoEncontrada(null);
                        setMotocicletaId("");
                        setMostrarFormularioManual(true);
                        setMotoManual((prev) => ({
                          ...prev,
                          make: busquedaMarca,
                          model: busquedaModelo,
                          year: busquedaAnio,
                        }));
                      }}
                    >
                      No es mi moto, ingresar manualmente
                    </button>
                  </div>
                )}
              </div>

              {/* ── Columna derecha: Formulario manual ── */}
              {mostrarFormularioManual && (
                <div className="modal-columna-derecha">
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
                            setMotoManual({
                              ...motoManual,
                              make: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="modal-field">
                        <label>Modelo *</label>
                        <input
                          placeholder="Ej: XTZ 150"
                          value={motoManual.model}
                          onChange={(e) =>
                            setMotoManual({
                              ...motoManual,
                              model: e.target.value,
                            })
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
                            setMotoManual({
                              ...motoManual,
                              year: e.target.value,
                            })
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
                            setMotoManual({
                              ...motoManual,
                              engine: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="modal-field">
                        <label>Tipo de moto</label>
                        <input
                          placeholder="Ej: Trail, Deportiva"
                          value={motoManual.type}
                          onChange={(e) =>
                            setMotoManual({
                              ...motoManual,
                              type: e.target.value,
                            })
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
                  </div>
                </div>
              )}
            </div>
            {/* fin modal-columnas */}

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
