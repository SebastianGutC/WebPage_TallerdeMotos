// src/pages/Tecnico/components/CitaCard.jsx
import React, { useState } from "react";
import "./CitaCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMotorcycle, faUser, faClock, faChevronDown, faChevronUp,
  faTriangleExclamation, faCircleCheck, faWrench, faBoxOpen,
  faPlus, faTrash, faCirclePlay, faGaugeHigh, faPalette,
  faTags, faCalendarCheck, faHashtag, faSpinner, faBan,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import {
  agregarServicio,
  eliminarServicio,
  agregarProducto,
  eliminarProducto,
  cambiarEstadoCita,
} from "../../../services/TecnicoService";

import {actualizarCita} from "../../../services/CitasService";
/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */

/**
 * La BD guarda fecha (Date) y hora (String "HH:MM") por separado.
 * Combinamos ambas para mostrar la hora de la cita.
 */
const formatHora = (hora) => {
  if (!hora) return "—";
  // hora ya viene como "08:00", "14:30", etc.
  return hora.trim();
};

const formatFechaLarga = (fechaISO) => {
  if (!fechaISO) return "—";
  try {
    return new Date(fechaISO).toLocaleDateString("es-CO", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return fechaISO;
  }
};

const ESTADO_META = {
  disponible: {
    label: "Disponible",
    css:   "status-available",
    icon:  faCalendarCheck,
  },
  pendiente: {
    label: "Pendiente",
    css:   "status-pending",
    icon:  faClock,
  },
  en_proceso: {
    label: "En proceso",
    css:   "status-inprogress",
    icon:  faCirclePlay,
  },
  lista: {
    label: "Lista para entrega",
    css:   "status-ready",
    icon:  faCircleCheck,
  },
  entregada: {
    label: "Entregada",
    css:   "status-done",
    icon:  faCircleCheck,
  },
  cancelada: {
    label: "Cancelada",
    css:   "status-cancelled",
    icon:  faBan,
  },
  no_asistio: {
    label: "No asistió",
    css:   "status-noshow",
    icon:  faTriangleExclamation,
  },
};

const getMeta = (estado) =>
  ESTADO_META[estado?.toLowerCase?.()] ?? {
    label: estado ?? "Desconocido",
    css:   "status-pending",
    icon:  faCircleQuestion,
  };

/* ─────────────────────────────────────────────────────────────────
   COMPONENTE
───────────────────────────────────────────────────────────────── */
const CitaCard = ({
  cita,
  serviciosCatalogo = [],
  productosCatalogo = [],
  onRefresh,
}) => {
  const [expanded,    setExpanded]    = useState(false);
  const [loadingAct,  setLoadingAct]  = useState(false);

  const [selServicio, setSelServicio] = useState("");
  const [addingSvc,   setAddingSvc]   = useState(false);

  const [selProducto, setSelProducto] = useState("");
  const [selQty,      setSelQty]      = useState(1);
  const [addingProd,  setAddingProd]  = useState(false);

  /* ── Datos de la cita desde el schema real ── */
  const estado      = cita.estado ?? "disponible";   // string en minúscula
  const meta        = getMeta(estado);

  // populated por el controller con populateCita()
  const motocicleta = cita.motocicletaId ?? {};       // ← nombre real del campo
  const cliente     = cita.usuarioId     ?? {};       // ← nombre real del campo

  // Arrays de subdocumentos: [{ _id, nombre, costo }]
  const servicios   = cita.servicios ?? [];
  const productos   = cita.productos ?? [];           // [{ _id, nombre, cantidad, costo }]

  // fecha (Date ISO) y hora (String "HH:MM") son campos separados en el schema
  const horaDisplay  = formatHora(cita.hora);
  const fechaDisplay = formatFechaLarga(cita.fecha);

  /* ── Flags de estado ── */
  const isDisponible  = estado === "disponible";   // sin cliente aún
  const isCancelled   = estado === "cancelada";
  const isCompleted   = ["lista", "entregada"].includes(estado);
  const isNoShow      = estado === "no_asistio";
  const isInProgress  = estado === "en_proceso";
  const canAct        = !isCancelled && !isCompleted && !isNoShow && !isDisponible;

  /* ── Handlers de estado ── */
const handleEstado = async (nuevoEstado) => {
  setLoadingAct(true);
  try {
    // Si pasa a en_proceso, primero guarda la fecha de ingreso
    if (nuevoEstado === "en_proceso") {
      await actualizarCita(cita._id ?? cita.id, { fechaIngreso: new Date() });
    }

    // Luego cambia el estado en cualquier caso
    await cambiarEstadoCita(cita._id ?? cita.id, nuevoEstado);
    onRefresh?.();
  } catch (e) {
    console.error("Error cambiando estado:", e);
  } finally {
    setLoadingAct(false);
  }
};

  /* ── Handlers servicios ── */
  const handleAddServicio = async () => {
    if (!selServicio) return;
    setAddingSvc(true);
    try {
      await agregarServicio(cita._id ?? cita.id, selServicio);
      setSelServicio("");
      onRefresh?.();
    } catch (e) {
      console.error("Error agregando servicio:", e);
    } finally {
      setAddingSvc(false);
    }
  };

  /**
   * El controller usa splice(index, 1), por lo que debemos pasar
   * el índice posicional del subdocumento en el array, NO su _id.
   */
  const handleRemoveServicio = async (index) => {
    try {
      await eliminarServicio(cita._id ?? cita.id, index);
      onRefresh?.();
    } catch (e) {
      console.error("Error eliminando servicio:", e);
    }
  };

  /* ── Handlers productos ── */
  const handleAddProducto = async () => {
    if (!selProducto) return;
    setAddingProd(true);
    try {
      await agregarProducto(cita._id ?? cita.id, selProducto, Number(selQty));
      setSelProducto("");
      setSelQty(1);
      onRefresh?.();
    } catch (e) {
      console.error("Error agregando producto:", e);
    } finally {
      setAddingProd(false);
    }
  };

  const handleRemoveProducto = async (index) => {
    try {
      await eliminarProducto(cita._id ?? cita.id, index);
      onRefresh?.();
    } catch (e) {
      console.error("Error eliminando producto:", e);
    }
  };

  /* ── CSS de la tarjeta ── */
  const cardClass = [
    "cita-card",
    isCancelled  ? "cita-cancelled"  : "",
    isCompleted  ? "cita-completed"  : "",
    isDisponible ? "cita-available"  : "",
    isNoShow     ? "cita-noshow"     : "",
  ].filter(Boolean).join(" ");

  /* ─── RENDER ─── */
  return (
    <div className={cardClass}>

      {/* ════════════════════ HEADER ════════════════════ */}
      <div className="cita-card-header" onClick={() => setExpanded(p => !p)}>

        <div className="cita-card-left">
          <div className="moto-icon-wrapper">
            <FontAwesomeIcon icon={faMotorcycle} className="moto-icon" />
          </div>

          <div className="cita-main-info">
            {isDisponible ? (
              /* Slot libre — no hay cliente ni moto todavía */
              <div className="moto-name disponible-label">
                Turno disponible
                <span className="moto-placa">{cita.placaMoto ?? "—"}</span>
              </div>
            ) : (
              <>
                <div className="moto-name">
                  {motocicleta.marca ?? "—"} {motocicleta.modelo ?? ""}
                  <span className="moto-placa">
                    {motocicleta.placa ?? cita.placaMoto ?? "SIN PLACA"}
                  </span>
                </div>
                <div className="cliente-name">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 11 }} />
                  {/* usuarioId fue populated: tiene .nombre, .apellido, etc. */}
                  {cliente.nombre
                    ? `${cliente.nombre}${cliente.apellido ? " " + cliente.apellido : ""}`
                    : "Cliente sin asignar"}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="cita-card-right">
          <div className="cita-time">
            <FontAwesomeIcon icon={faClock} />
            {horaDisplay}
          </div>
          <span className={`status-badge ${meta.css}`}>
            <FontAwesomeIcon icon={meta.icon} />
            {meta.label}
          </span>
          <div className="expand-btn">
            <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
          </div>
        </div>
      </div>

      {/* ════════════════════ BODY EXPANDIDO ════════════ */}
      {expanded && (
        <div className="cita-card-body">

          {/* ── Banner: slot disponible ── */}
          {isDisponible && (
            <div className="available-banner">
              <FontAwesomeIcon icon={faCalendarCheck} />
              Este turno aún no tiene cliente asignado.
            </div>
          )}

          {/* ── Banner: cancelada por cliente ── */}
          {isCancelled && (
            <div className="cancelled-banner">
              <FontAwesomeIcon icon={faBan} />
              Esta cita fue <strong>cancelada</strong> por el cliente.
            </div>
          )}

          {/* ── Banner: no asistió ── */}
          {isNoShow && (
            <div className="noshow-banner">
              <FontAwesomeIcon icon={faTriangleExclamation} />
              El cliente <strong>no asistió</strong> a esta cita.
            </div>
          )}

          {/* ── Banner: completada ── */}
          {isCompleted && (
            <div className="completed-banner">
              <FontAwesomeIcon icon={faCircleCheck} />
              Cita <strong>{meta.label}</strong> — el cliente puede pasar por su
              motocicleta.
            </div>
          )}

          {/* ── Fecha completa ── */}
          <div className="cita-fecha-row">
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>{fechaDisplay} · {horaDisplay}</span>
          </div>
          
          {/* ════════ INFO MOTOCICLETA ════════ */}
{!isDisponible && (
  <div className="detail-section">
    <h4 className="section-title">
      <FontAwesomeIcon icon={faMotorcycle} />
      Información de la Motocicleta
    </h4>

    {!motocicleta._id ? (
      <p className="empty-list">Sin motocicleta registrada.</p>
    ) : (
      <div className="moto-details-grid">

        {/* ── Datos principales ── */}
        <div className="detail-item">
          <span className="detail-label">Marca</span>
          <span className="detail-value">{motocicleta.marca ?? "—"}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Nombre</span>
          <span className="detail-value">{motocicleta.nombre ?? "—"}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Modelo</span>
          <span className="detail-value">{motocicleta.modelo ?? "—"}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Tipo</span>
          <span className="detail-value">{motocicleta.tipo ?? "—"}</span>
        </div>

        {/* ── Detalles técnicos (nested) ── */}
        {motocicleta.detalles && (
          <>
            <div className="detail-item">
              <span className="detail-label">
                <FontAwesomeIcon icon={faGaugeHigh} /> Cilindraje
              </span>
              <span className="detail-value">
                {motocicleta.detalles.cilindraje
                  ? `${motocicleta.detalles.cilindraje} cc`
                  : "—"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Tipo de motor</span>
              <span className="detail-value">
                {motocicleta.detalles.tipo_motor ?? "—"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Transmisión</span>
              <span className="detail-value">
                {motocicleta.detalles.tipo_transmision ?? "—"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Combustible</span>
              <span className="detail-value">
                {motocicleta.detalles.tipo_combustible ?? "—"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Sistema de frenos</span>
              <span className="detail-value">
                {motocicleta.detalles.sistema_frenos ?? "—"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Cap. aceite</span>
              <span className="detail-value">
                {motocicleta.detalles.capacidad_aceite != null
                  ? `${motocicleta.detalles.capacidad_aceite} L`
                  : "—"}
              </span>
            </div>
          </>
        )}
      </div>
    )}
  </div>
)}

          {/* ════════ NOTAS ════════ */}
          {(cita.notas || cita.descripcion || cita.observaciones) && (
            <div className="detail-section">
              <h4 className="section-title">
                <FontAwesomeIcon icon={faTags} />
                Notas / Motivo
              </h4>
              <p className="cita-notes">
                {cita.notas ?? cita.descripcion ?? cita.observaciones}
              </p>
            </div>
          )}

          {/* ════════ SERVICIOS ════════ */}
          <div className="detail-section">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faWrench} />
              Servicios
            </h4>

            <div className="items-list">
              {servicios.length === 0 ? (
                <p className="empty-list">No hay servicios registrados.</p>
              ) : (
                servicios.map((s, index) => (
                  /* key por _id del subdocumento; el handler usa el índice */
                  <div className="item-row" key={s._id ?? index}>
                    <span className="item-name">{s.nombre ?? "Servicio"}</span>
                    {/* BD guarda "costo", NO "precio" */}
                    {s.costo != null && (
                      <span className="item-price">
                        ${Number(s.costo).toLocaleString("es-CO")}
                      </span>
                    )}
                    {canAct && (
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveServicio(index)} // ← índice, no _id
                        title="Quitar servicio"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {canAct && (
              <div className="add-item-row">
                <select
                  className="item-select"
                  value={selServicio}
                  onChange={(e) => setSelServicio(e.target.value)}
                >
                  <option value="">— Seleccionar servicio —</option>
                  {serviciosCatalogo.map((sv) => (
                    <option key={sv._id ?? sv.id} value={sv._id ?? sv.id}>
                      {sv.nombre ?? sv.name}
                      {sv.precio != null
                        ? ` · $${Number(sv.precio).toLocaleString("es-CO")}`
                        : ""}
                    </option>
                  ))}
                </select>
                <button
                  className="add-btn"
                  onClick={handleAddServicio}
                  disabled={!selServicio || addingSvc}
                >
                  {addingSvc ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} />
                  )}
                  {addingSvc ? "Agregando…" : "Agregar"}
                </button>
              </div>
            )}
          </div>

          {/* ════════ PRODUCTOS ════════ */}
          <div className="detail-section">
            <h4 className="section-title">
              <FontAwesomeIcon icon={faBoxOpen} />
              Productos / Repuestos
            </h4>

            <div className="items-list">
              {productos.length === 0 ? (
                <p className="empty-list">No hay productos registrados.</p>
              ) : (
                productos.map((p, index) => (
                  <div className="item-row" key={p._id ?? index}>
                    <span className="item-name">{p.nombre ?? "Producto"}</span>
                    <span className="item-qty">×{p.cantidad ?? 1}</span>
                    {/* BD guarda "costo", NO "precio" */}
                    {p.costo != null && (
                      <span className="item-price">
                        $
                        {Number(p.costo * (p.cantidad ?? 1)).toLocaleString(
                          "es-CO"
                        )}
                      </span>
                    )}
                    {canAct && (
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveProducto(index)} // ← índice, no _id
                        title="Quitar producto"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {canAct && (
              <div className="add-item-row">
                <select
                  className="item-select"
                  value={selProducto}
                  onChange={(e) => setSelProducto(e.target.value)}
                >
                  <option value="">— Seleccionar producto —</option>
                  {productosCatalogo.map((pr) => (
                    <option key={pr._id ?? pr.id} value={pr._id ?? pr.id}>
                      {pr.nombre ?? pr.name}
                      {pr.precio != null
                        ? ` · $${Number(pr.precio).toLocaleString("es-CO")}`
                        : ""}
                    </option>
                  ))}
                </select>
                <input
                  className="qty-input"
                  type="number"
                  min={1}
                  value={selQty}
                  onChange={(e) => setSelQty(e.target.value)}
                />
                <button
                  className="add-btn"
                  onClick={handleAddProducto}
                  disabled={!selProducto || addingProd}
                >
                  {addingProd ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faPlus} />
                  )}
                  {addingProd ? "Agregando…" : "Agregar"}
                </button>
              </div>
            )}
          </div>

          {/* ════════ ACCIONES DE ESTADO ════════ */}
          {canAct && (
            <div className="cita-actions">
              {/* pendiente → en_proceso */}
              {estado === "pendiente" && (
                <button
                  className="action-btn btn-inprogress"
                  onClick={() => handleEstado("en_proceso")}
                  disabled={loadingAct}
                >
                  <FontAwesomeIcon icon={loadingAct ? faSpinner : faCirclePlay} spin={loadingAct} />
                  Iniciar trabajo
                </button>
              )}

              {/* en_proceso → lista (descuenta stock automáticamente en el backend) */}
              {isInProgress && (
                <button
                  className="action-btn btn-ready"
                  onClick={() => handleEstado("lista")}
                  disabled={loadingAct}
                >
                  <FontAwesomeIcon icon={loadingAct ? faSpinner : faCircleCheck} spin={loadingAct} />
                  Marcar lista para entrega
                </button>
              )}

              {/* lista → entregada */}
              {estado === "lista" && (
                <button
                  className="action-btn btn-complete"
                  onClick={() => handleEstado("entregada")}
                  disabled={loadingAct}
                >
                  <FontAwesomeIcon icon={loadingAct ? faSpinner : faCircleCheck} spin={loadingAct} />
                  Confirmar entrega
                </button>
              )}

              {/* Marcar no asistió (desde pendiente o en_proceso) */}
              {["pendiente", "en_proceso"].includes(estado) && (
                <button
                  className="action-btn btn-noshow"
                  onClick={() => handleEstado("no_asistio")}
                  disabled={loadingAct}
                >
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  No asistió
                </button>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default CitaCard;