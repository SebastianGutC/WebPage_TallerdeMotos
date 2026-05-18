// src/pages/Admin/tabs/CitasTab.jsx
import React, { useEffect, useState } from "react";
import {
  getAllCitas,
  updateCitaEstado,
  asignarTecnicoCita,
  deleteCita,
  getAllUsers,
} from "../../../services/AdminService.js";
import API from "../../../services/Api.js";
import { ESTADO_COLORS, ESTADO_LABEL } from "../citasConstants.jsx";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-unused-vars
import {
  faCalendarPlus,
  faAngleDown,
  faClock,
  faCalendarDay,
  faFileLines,
  faCheck,
  faXmark,
  faEye,
  faEyeSlash,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faMoneyBillWave,
  faMotorcycle,
  faCreditCard,
} from "@fortawesome/free-solid-svg-icons";

const ESTADOS_ASIGNADA = ["pendiente", "en_proceso"];
const ESTADOS_REALIZADA = ["lista", "entregada", "cancelada", "no_asistio"];
const ESTADOS_EDIT = [
  "disponible",
  "pendiente",
  "en_proceso",
  "lista",
  "entregada",
  "cancelada",
  "no_asistio",
];
const CITA_INITIAL = { fecha: "", hora: "", tecnicoId: "" };

// ── Badge de estado ────────────────────────────────────────────────────────────
const EstadoBadge = ({ estado }) => (
  <span
    className="estado-badge"
    style={{ background: ESTADO_COLORS[estado] || "#888" }}
  >
    {ESTADO_LABEL[estado] || estado}
  </span>
);

// ── Acordeón reutilizable ──────────────────────────────────────────────────────
const Section = ({
  icon,
  title,
  count,
  open,
  onToggle,
  colorClass,
  children,
}) => (
  <div className="accordion-card">
    <button
      className={`accordion-header ${colorClass || ""}`}
      onClick={onToggle}
    >
      <span className="section-left">
        {icon && <span className="section-icon">{icon}</span>}
        <span className="section-title-text">{title}</span>
        {count !== "" && count !== undefined && (
          <span className="count-badge-inline">{count}</span>
        )}
      </span>
      <span className="accordion-arrow">
        <FontAwesomeIcon icon={faAngleDown} className={open ? "rotate" : ""} />
      </span>
    </button>
    {open && <div className="accordion-body">{children}</div>}
  </div>
);

// ── Utilidad: corrige el desfase de zona horaria en fechas ────────────────────
// Convierte "2025-01-15" → "2025-01-15T12:00:00" para evitar que UTC reste un día
const fixDate = (dateStr) => (dateStr ? `${dateStr}T12:00:00` : undefined);

// Para mostrar: recibe un string ISO y devuelve la fecha correcta en Colombia
const formatDate = (isoStr) => {
  if (!isoStr) return null;
  // Usamos split para no depender de timezone del navegador
  const [y, m, d] = isoStr.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
};

const CitasTab = () => {
  const [citas, setCitas] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Todos los acordeones cerrados por defecto
  const [showCrear, setShowCrear] = useState(false);
  const [showDisponibles, setShowDisponibles] = useState(false);
  const [showAsignadas, setShowAsignadas] = useState(false);
  const [showRealizadas, setShowRealizadas] = useState(false);

  const [citaForm, setCitaForm] = useState(CITA_INITIAL);
  const [citaError, setCitaError] = useState("");
  const [citaSuccess, setCitaSuccess] = useState("");
  const [creando, setCreando] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [expandedDetalle, setExpandedDetalle] = useState(null);

  const [entregandoId, setEntregandoId] = useState(null);
  const [showListasEntrega, setShowListasEntrega] = useState(false);

  const [pagoForm, setPagoForm] = useState({
    metodoPago: "efectivo",
  });

  // ── Carga ──────────────────────────────────────────────────────────────────
  const fetchCitas = async () => {
    setLoading(true);
    try {
      const r = await getAllCitas();
      setCitas(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTecnicos = async () => {
    try {
      const r = await getAllUsers();
      setTecnicos(r.data.filter((u) => u.rol === "TECNICO" && u.habilitado));
      // eslint-disable-next-line no-empty
    } catch {}
  };

  useEffect(() => {
    fetchCitas();
    fetchTecnicos();
  }, []);

  // ── Clasificación ──────────────────────────────────────────────────────────
  const disponibles = citas.filter((c) => c.estado === "disponible");
  const asignadas = citas.filter((c) => ESTADOS_ASIGNADA.includes(c.estado));
  const realizadas = citas.filter((c) => ESTADOS_REALIZADA.includes(c.estado));
  const listasEntrega = citas.filter((c) => c.estado === "lista");

  // ── Crear horario ──────────────────────────────────────────────────────────
  const handleCrear = async () => {
    setCitaError("");
    setCitaSuccess("");

    const { fecha, hora, tecnicoId } = citaForm;

    // ── Log para ver exactamente qué hay en el form ──
    console.log("Form values:", { fecha, hora, tecnicoId });

    if (!fecha || !hora || !tecnicoId) {
      setCitaError("Fecha, hora y técnico son obligatorios.");
      return;
    }

    setCreando(true);

    try {
      const data = {
        fecha: `${fecha}T12:00:00`, // ✅ fuerza mediodía, evita desfase UTC
        hora,
        tecnicoId,
        estado: "disponible",
      };

      console.log("Enviando:", data);

      const res = await API.post("/citas", data);

      console.log("Respuesta:", res.data);

      setCitaSuccess("Horario creado correctamente");
      setCitaForm(CITA_INITIAL);
      fetchCitas();
    } catch (e) {
      console.error("Error completo:", e);
      console.error("Response data:", e.response?.data);
      console.error("Status:", e.response?.status);

      setCitaError(
        e.response?.data?.message ||
          e.response?.data?.error ||
          e.message ||
          "Error al crear horario.",
      );
    } finally {
      setCreando(false);
    }
  };

  // ── Edición inline ─────────────────────────────────────────────────────────
  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({
      fecha: c.fecha ? c.fecha.slice(0, 10) : "",
      hora: c.hora || "",
      estado: c.estado,
      tecnicoId: c.tecnicoId?._id || c.tecnicoId || "",
      fechaEntrega: c.fechaEntrega ? c.fechaEntrega.slice(0, 10) : "",
    });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    if (
      editForm.estado === "lista" &&
      !window.confirm("Cambiar a 'lista' descontará stock. ¿Continuar?")
    )
      return;
    setSaving(true);
    try {
      const orig = citas.find((c) => c._id === id);
      if (orig.estado !== editForm.estado)
        await updateCitaEstado(id, editForm.estado);
      const tecOrig = orig.tecnicoId?._id || orig.tecnicoId || "";
      if (tecOrig !== editForm.tecnicoId && editForm.tecnicoId)
        await asignarTecnicoCita(id, editForm.tecnicoId);
      await API.put(`/citas/${id}`, {
        fecha: fixDate(editForm.fecha),
        hora: editForm.hora,
        fechaEntrega: fixDate(editForm.fechaEntrega),
      });
      setEditingId(null);
      setEditForm({});
      fetchCitas();
    } catch (e) {
      alert(e.response?.data?.message || "Error al guardar.");
    } finally {
      setSaving(false);
    }
  };

const handleDelete = async (id) => {

  const result = await Swal.fire({
    title: "¿Eliminar cita?",
    text: "La cita será eliminada permanentemente.",
    icon: "warning",

    showCancelButton: true,

    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",

    customClass: {
      popup: "swal-popup",
      title: "swal-title",
      htmlContainer: "swal-text",
      confirmButton: "swal-confirm",
      cancelButton: "swal-cancel",
    },

    buttonsStyling: false,
    reverseButtons: true,
  });

  // SI CANCELA
  if (!result.isConfirmed) return;

  try {

    await deleteCita(id);

    setCitas((prev) =>
      prev.filter((c) => c._id !== id)
    );

    Swal.fire({
      title: "Cita eliminada",
      text: "La cita fue eliminada correctamente.",
      icon: "success",

      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
      },

      buttonsStyling: false,
      timer: 1800,
      showConfirmButton: false,
    });

  } catch (error) {

    console.error(error);

    Swal.fire({
      title: "Error",
      text: "No se pudo eliminar la cita.",
      icon: "error",

      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-text",
        confirmButton: "swal-confirm",
      },

      buttonsStyling: false,
    });

  }
};

  // ── Subcomponentes de filas ────────────────────────────────────────────────
  const TecnicoSelect = ({ value, onChange }) => (
    <select className="inline-input" value={value} onChange={onChange}>
      <option value="">Sin asignar</option>
      {tecnicos.map((t) => (
        <option key={t._id} value={t._id}>
          {t.nombre} {t.apellido}
        </option>
      ))}
    </select>
  );

  const SaveCancelBtns = ({ id }) => (
    <td className="actions-cell">
      <div className="actions-wrapper">
        <button
          className="btn-icon save"
          onClick={() => saveEdit(id)}
          disabled={saving}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>

        <button className="btn-icon cancel" onClick={cancelEdit}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </td>
  );
  // ══ DASHBOARD DEL DÍA ════════════════════════════════════════════════════

  const hoy = new Date().toISOString().slice(0, 10);

  const entregadasHoy = citas.filter((c) => {
    if (c.estado !== "entregada") return false;

    const fechaPago = c.fechaPago?.slice(0, 10);

    return fechaPago === hoy;
  });

  // ════════════════════════════════════════════════════════════════════════
  // EFECTIVO
  // ════════════════════════════════════════════════════════════════════════

  const pagosEfectivoHoy = entregadasHoy.filter(
    (c) => c.metodoPago === "efectivo",
  );

  const cantidadEfectivoHoy = pagosEfectivoHoy.length;

  const totalEfectivoHoy = pagosEfectivoHoy.reduce((acc, c) => {
    const totalServicios = (c.servicios || []).reduce(
      (a, s) => a + Number(s.costo || 0),
      0,
    );

    const totalProductos = (c.productos || []).reduce(
      (a, p) => a + Number(p.costo || 0) * Number(p.cantidad || 0),
      0,
    );

    return acc + totalServicios + totalProductos;
  }, 0);

  // ════════════════════════════════════════════════════════════════════════
  // TRANSFERENCIA
  // ════════════════════════════════════════════════════════════════════════

  const pagosTransferenciaHoy = entregadasHoy.filter(
    (c) => c.metodoPago === "transferencia",
  );

  const cantidadTransferenciaHoy = pagosTransferenciaHoy.length;

  const totalTransferenciaHoy = pagosTransferenciaHoy.reduce((acc, c) => {
    const totalServicios = (c.servicios || []).reduce(
      (a, s) => a + Number(s.costo || 0),
      0,
    );

    const totalProductos = (c.productos || []).reduce(
      (a, p) => a + Number(p.costo || 0) * Number(p.cantidad || 0),
      0,
    );

    return acc + totalServicios + totalProductos;
  }, 0);

  // ════════════════════════════════════════════════════════════════════════
  // TARJETA
  // ════════════════════════════════════════════════════════════════════════

  const pagosTarjetaHoy = entregadasHoy.filter(
    (c) => c.metodoPago === "tarjeta",
  );

  const cantidadTarjetaHoy = pagosTarjetaHoy.length;

  const totalTarjetaHoy = pagosTarjetaHoy.reduce((acc, c) => {
    const totalServicios = (c.servicios || []).reduce(
      (a, s) => a + Number(s.costo || 0),
      0,
    );

    const totalProductos = (c.productos || []).reduce(
      (a, p) => a + Number(p.costo || 0) * Number(p.cantidad || 0),
      0,
    );

    return acc + totalServicios + totalProductos;
  }, 0);

  // ════════════════════════════════════════════════════════════════════════
  // TOTAL GENERAL
  // ════════════════════════════════════════════════════════════════════════

  const totalRecibidoHoy = entregadasHoy.reduce((acc, c) => {
    const totalServicios = (c.servicios || []).reduce(
      (a, s) => a + Number(s.costo || 0),
      0,
    );

    const totalProductos = (c.productos || []).reduce(
      (a, p) => a + Number(p.costo || 0) * Number(p.cantidad || 0),
      0,
    );

    return acc + totalServicios + totalProductos;
  }, 0);

  // ══ FUNCIÓN ENTREGAR MOTO ════════════════════════════════════════════════
  const handleEntregarMoto = async (cita) => {
    try {
      const metodoPago = pagoForm.metodoPago;

      await API.put(`/citas/${cita._id}`, {
        estado: "entregada",

        metodoPago,

        fechaPago: new Date(),

        fechaEntrega: new Date(),
      });

      setEntregandoId(null);

      fetchCitas();
    } catch (error) {
      console.error(error);

      alert("Error al entregar motocicleta");
    }
  };

  if (loading) return <p className="loading-text">Cargando citas...</p>;

  return (
    <div className="tab-content">
      {/* ══ 1. CREAR HORARIO ════════════════════════════════════════════════ */}
      <Section
        icon={<FontAwesomeIcon icon={faCalendarPlus} />}
        title="Crear nuevo horario"
        open={showCrear}
        onToggle={() => setShowCrear((v) => !v)}
      >
        <p className="accordion-hint">
          Define fecha, hora y técnico disponible. El horario se creará
          automáticamente como <strong>Disponible</strong> para que un usuario
          cliente lo agende.
        </p>
        {citaError && <p className="form-error">{citaError}</p>}
        {citaSuccess && <p className="form-success">{citaSuccess}</p>}
        <div
          className="form-grid"
          style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          <div className="form-group">
            <label>Fecha *</label>
            <input
              type="date"
              value={citaForm.fecha}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => {
                setCitaForm({ ...citaForm, fecha: e.target.value });
                setCitaError("");
              }}
            />
          </div>
          <div className="form-group">
            <label>Hora (12h) *</label>
            <input
              type="time"
              value={citaForm.hora}
              onChange={(e) => {
                setCitaForm({ ...citaForm, hora: e.target.value });
                setCitaError("");
              }}
            />
          </div>
          <div className="form-group">
            <label>Elegir técnico *</label>
            <select
              value={citaForm.tecnicoId}
              onChange={(e) => {
                setCitaForm({ ...citaForm, tecnicoId: e.target.value });
                setCitaError("");
              }}
            >
              <option value="">Selecciona un técnico</option>
              {tecnicos.length === 0 ? (
                <option disabled>No hay técnicos activos</option>
              ) : (
                tecnicos.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.nombre} {t.apellido}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={handleCrear}
          disabled={creando}
        >
          {creando ? "Creando ..." : "Crear horario"}
        </button>
      </Section>

      {/* ══ 2. HORARIOS DISPONIBLES ═════════════════════════════════════════ */}
      <Section
        icon={<FontAwesomeIcon icon={faClock} />}
        title="Horarios disponibles"
        count={disponibles.length}
        open={showDisponibles}
        onToggle={() => setShowDisponibles((v) => !v)}
        colorClass="header-disponible"
      >
        {disponibles.length === 0 ? (
          <p className="empty-text">No hay horarios disponibles creados.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Técnico asignado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {disponibles.map((c) => (
                  <React.Fragment key={c._id}>
                    {editingId === c._id ? (
                      <tr className="row-editing">
                        <td>
                          <input
                            type="date"
                            className="inline-input"
                            value={editForm.fecha}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fecha: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="inline-input"
                            value={editForm.hora}
                            onChange={(e) =>
                              setEditForm({ ...editForm, hora: e.target.value })
                            }
                          />
                        </td>
                        <td>
                          <TecnicoSelect
                            value={editForm.tecnicoId}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                tecnicoId: e.target.value,
                              })
                            }
                          />
                        </td>
                        <SaveCancelBtns id={c._id} />
                      </tr>
                    ) : (
                      <tr>
                        <td>{formatDate(c.fecha)}</td>
                        <td>{c.hora}</td>
                        <td>
                          {c.tecnicoId ? (
                            `${c.tecnicoId.nombre} ${c.tecnicoId.apellido}`
                          ) : (
                            <span className="text-muted">Sin asignar</span>
                          )}
                        </td>
                        <td className="actions-cell">
                          <div className="actions-wrapper">
                            <button
                              className="btn-edit"
                              onClick={() => startEdit(c)}
                            >
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="btn-icon-mobile"
                              />
                              <span className="btn-text">Editar</span>
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(c._id)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="btn-icon-mobile"
                              />
                              <span className="btn-text">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ══ 3. CITAS ASIGNADAS ══════════════════════════════════════════════ */}
      <Section
        icon={<FontAwesomeIcon icon={faCalendarDay} />}
        title="Citas asignadas"
        count={asignadas.length}
        open={showAsignadas}
        onToggle={() => setShowAsignadas((v) => !v)}
        colorClass="header-asignada"
      >
        {asignadas.length === 0 ? (
          <p className="empty-text">No hay citas en proceso actualmente.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Moto / Placa</th>
                  <th>Estado</th>
                  <th>Técnico</th>
                  <th>F. Entrega</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignadas.map((c) => (
                  <React.Fragment key={c._id}>
                    {editingId === c._id ? (
                      <tr className="row-editing">
                        <td>
                          <input
                            type="date"
                            className="inline-input"
                            value={editForm.fecha}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fecha: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="inline-input"
                            value={editForm.hora}
                            onChange={(e) =>
                              setEditForm({ ...editForm, hora: e.target.value })
                            }
                          />
                        </td>
                        <td className="text-muted">
                          {c.usuarioId
                            ? `${c.usuarioId.nombre} ${c.usuarioId.apellido}`
                            : "—"}
                        </td>
                        <td className="text-muted">
                          {c.motocicletaId
                            ? `${c.motocicletaId.marca} ${c.motocicletaId.nombre}`
                            : c.placaMoto || "—"}
                        </td>
                        <td>
                          <select
                            className="inline-input"
                            value={editForm.estado}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                estado: e.target.value,
                              })
                            }
                          >
                            {ESTADOS_EDIT.map((e) => (
                              <option key={e} value={e}>
                                {ESTADO_LABEL[e]}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <TecnicoSelect
                            value={editForm.tecnicoId}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                tecnicoId: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            className="inline-input"
                            value={editForm.fechaEntrega}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fechaEntrega: e.target.value,
                              })
                            }
                          />
                        </td>
                        <SaveCancelBtns id={c._id} />
                      </tr>
                    ) : (
                      <tr>
                        <td>{formatDate(c.fecha)}</td>
                        <td>{c.hora}</td>
                        <td>
                          {c.usuarioId ? (
                            `${c.usuarioId.nombre} ${c.usuarioId.apellido}`
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          {c.motocicletaId
                            ? `${c.motocicletaId.marca} ${c.motocicletaId.nombre}`
                            : c.placaMoto || (
                                <span className="text-muted">—</span>
                              )}
                        </td>
                        <td>
                          <EstadoBadge estado={c.estado} />
                        </td>
                        <td>
                          {c.tecnicoId ? (
                            `${c.tecnicoId.nombre} ${c.tecnicoId.apellido}`
                          ) : (
                            <span className="text-muted">Sin asignar</span>
                          )}
                        </td>
                        <td>
                          {formatDate(c.fechaEntrega) || (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="actions-cell">
                          <div className="actions-wrapper">
                            <button
                              className="btn-edit"
                              onClick={() => startEdit(c)}
                            >
                              <FontAwesomeIcon
                                icon={faPencil}
                                className="btn-icon-mobile"
                              />
                              <span className="btn-text">Editar</span>
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(c._id)}
                            >
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="btn-icon-mobile"
                              />
                              <span className="btn-text">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
      {/* ══ 4. MOTOS LISTAS PARA RECOGER ═══════════════════════════════════ */}
      <Section
        icon={<FontAwesomeIcon icon={faMotorcycle} />}
        title="Motos listas para recoger"
        count={listasEntrega.length}
        open={showListasEntrega}
        onToggle={() => setShowListasEntrega((v) => !v)}
        colorClass="header-lista"
      >
        {/* DASHBOARD */}
        <div className="mini-dashboard">
          {/* EFECTIVO */}
          <div className="dashboard-card">
            <FontAwesomeIcon icon={faMoneyBillWave} />

            <div>
              <span>Efectivo</span>

              <strong>
                {cantidadEfectivoHoy} | ${totalEfectivoHoy.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* TRANSFERENCIA */}
          <div className="dashboard-card">
            <FontAwesomeIcon icon={faCreditCard} />

            <div>
              <span>Transferencia</span>

              <strong>
                {cantidadTransferenciaHoy} | $
                {totalTransferenciaHoy.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* TARJETA */}
          <div className="dashboard-card">
            <FontAwesomeIcon icon={faCreditCard} />

            <div>
              <span>Tarjeta</span>

              <strong>
                {cantidadTarjetaHoy} | ${totalTarjetaHoy.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* TOTAL */}
          <div className="dashboard-card total">
            <div>
              <span>Total recibido hoy</span>

              <strong>${totalRecibidoHoy.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {listasEntrega.length === 0 ? (
          <p className="empty-text">
            No hay motocicletas pendientes por entregar.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Moto</th>
                  <th>Placa</th>
                  <th>Total</th>
                  <th>Método pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {listasEntrega.map((c) => {
                  const totalServicios = (c.servicios || []).reduce(
                    (a, s) => a + Number(s.costo || 0),
                    0,
                  );

                  const totalProductos = (c.productos || []).reduce(
                    (a, p) =>
                      a + Number(p.costo || 0) * Number(p.cantidad || 0),
                    0,
                  );

                  const total = totalServicios + totalProductos;

                  return (
                    <tr key={c._id}>
                      <td>
                        {c.usuarioId
                          ? `${c.usuarioId.nombre} ${c.usuarioId.apellido}`
                          : "—"}
                      </td>

                      <td>
                        {c.motocicletaId
                          ? `${c.motocicletaId.marca} ${c.motocicletaId.nombre}`
                          : "—"}
                      </td>

                      <td>{c.placaMoto || "—"}</td>

                      <td>
                        <strong>${total.toLocaleString()}</strong>
                      </td>

                      <td>
                        {entregandoId === c._id ? (
                          <select
                            className="inline-input"
                            value={pagoForm.metodoPago}
                            onChange={(e) =>
                              setPagoForm({
                                ...pagoForm,
                                metodoPago: e.target.value,
                              })
                            }
                          >
                            <option value="efectivo">Efectivo</option>

                            <option value="transferencia">Transferencia</option>

                            <option value="tarjeta">Tarjeta</option>

                          </select>
                        ) : (
                          <span className="text-muted">
                            Seleccionar al entregar
                          </span>
                        )}
                      </td>

                      <td>
                        {entregandoId === c._id ? (
                          <div className="actions-wrapper">
                            <button
                              className="btn-save"
                              onClick={() => handleEntregarMoto(c)}
                            >
                              Confirmar entrega
                            </button>

                            <button
                              className="btn-cancel"
                              onClick={() => setEntregandoId(null)}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn-primary"
                            onClick={() => {
                              setEntregandoId(c._id);

                              setPagoForm({
                                metodoPago: "efectivo",
                              });
                            }}
                          >
                            Entregar moto
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* ══ 4. HISTORIAL DE CITAS REALIZADAS ════════════════════════════════ */}
      <Section
        icon={<FontAwesomeIcon icon={faFileLines} />}
        title="Historial de citas realizadas"
        count={realizadas.length}
        open={showRealizadas}
        onToggle={() => setShowRealizadas((v) => !v)}
        colorClass="header-realizada"
      >
        {realizadas.length === 0 ? (
          <p className="empty-text">No hay citas finalizadas aún.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Cliente</th>
                  <th>Moto / Placa</th>
                  <th>Estado</th>
                  <th>Técnico</th>
                  <th>F. Entrega</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {realizadas.map((c) => (
                  <React.Fragment key={c._id}>
                    <tr>
                      <td>{formatDate(c.fecha)}</td>
                      <td>{c.hora}</td>
                      <td>
                        {c.usuarioId ? (
                          `${c.usuarioId.nombre} ${c.usuarioId.apellido}`
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {c.motocicletaId
                          ? `${c.motocicletaId.marca} ${c.motocicletaId.nombre}`
                          : c.placaMoto || (
                              <span className="text-muted">—</span>
                            )}
                      </td>
                      <td>
                        <EstadoBadge estado={c.estado} />
                      </td>
                      <td>
                        {c.tecnicoId ? (
                          `${c.tecnicoId.nombre} ${c.tecnicoId.apellido}`
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        {formatDate(c.fechaEntrega) || (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn-expand"
                          onClick={() =>
                            setExpandedDetalle(
                              expandedDetalle === c._id ? null : c._id,
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={
                              expandedDetalle === c._id ? faEyeSlash : faEye
                            }
                          />
                        </button>
                      </td>
                    </tr>

                    {expandedDetalle === c._id && (
                      <tr className="expanded-row">
                        <td colSpan={8}>
                          <div className="expanded-content cita-detail">
                            {/* Servicios */}
                            <div className="detail-section">
                              <h4>Servicios realizados</h4>
                              {!c.servicios?.length ? (
                                <p className="empty-text">
                                  Sin servicios registrados.
                                </p>
                              ) : (
                                <>
                                  <ul className="detail-list">
                                    {c.servicios.map((s, i) => (
                                      <li key={i}>
                                        <span>{s.nombre}</span>
                                        <span className="detail-cost">
                                          ${Number(s.costo).toLocaleString()}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                  <p className="detail-total">
                                    Subtotal:{" "}
                                    <strong>
                                      $
                                      {c.servicios
                                        .reduce(
                                          (a, s) => a + Number(s.costo),
                                          0,
                                        )
                                        .toLocaleString()}
                                    </strong>
                                  </p>
                                </>
                              )}
                            </div>

                            {/* Productos */}
                            <div className="detail-section">
                              <h4>Repuestos / Productos</h4>
                              {!c.productos?.length ? (
                                <p className="empty-text">
                                  Sin productos registrados.
                                </p>
                              ) : (
                                <>
                                  <ul className="detail-list">
                                    {c.productos.map((p, i) => (
                                      <li key={i}>
                                        <span>
                                          {p.nombre} × {p.cantidad}
                                        </span>
                                        <span className="detail-cost">
                                          ${Number(p.costo).toLocaleString()}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                  <p className="detail-total">
                                    Subtotal:{" "}
                                    <strong>
                                      $
                                      {c.productos
                                        .reduce(
                                          (a, p) =>
                                            a +
                                            Number(p.costo) *
                                              Number(p.cantidad),
                                          0,
                                        )
                                        .toLocaleString()}
                                    </strong>
                                  </p>
                                </>
                              )}
                            </div>

                            {/* Total general */}
                            {(c.servicios?.length > 0 ||
                              c.productos?.length > 0) && (
                              <div className="detail-total-general">
                                Total de la cita:{" "}
                                <strong>
                                  $
                                  {(
                                    (c.servicios || []).reduce(
                                      (a, s) => a + Number(s.costo),
                                      0,
                                    ) +
                                    (c.productos || []).reduce(
                                      (a, p) =>
                                        a +
                                        Number(p.costo) * Number(p.cantidad),
                                      0,
                                    )
                                  ).toLocaleString()}
                                </strong>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
};

export default CitasTab;
