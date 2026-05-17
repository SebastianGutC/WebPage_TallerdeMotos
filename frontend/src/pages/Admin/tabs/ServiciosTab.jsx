// src/pages/Admin/tabs/ServiciosTab.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  getAllServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../../../services/AdminService";

const INITIAL = { nombre: "", descripcion: "", precio: "", icono: "" };

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileCirclePlus,
  faPenToSquare,
  faFileCircleCheck,
  faAngleDown,
  faTrash,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";

const ICONOS = [
  // Mecánica / taller
  { label: "Escudo / protección",  value: "fi-shield" },
  { label: "Asterisco",            value: "fi-asterisk" },
  { label: "Mezclar / ruedas",     value: "fi-shuffle" },
  { label: "Alerta / frenos",      value: "fi-alert" },
  { label: "Estrella",             value: "fi-star" },
  { label: "Batería",              value: "fi-battery-full" },
  { label: "Monitor / diagnóstico",value: "fi-monitor" },
  { label: "Engranaje / suspensión",value: "fi-widget" },
  { label: "Balde de pintura",     value: "fi-paint-bucket" },
  { label: "Llave inglesa",    value: "fi-wrench" },
  { label: "Ensamblaje",         value: "fi-puzzle" },         
  { label: "Checklist",        value: "fi-clipboard-notes" },
  { label: "Alerta",           value: "fi-alert" },
  { label: "Batería",          value: "fi-battery-full" },
  { label: "Batería baja",     value: "fi-battery-empty" },
  { label: "Batería media",    value: "fi-battery-half" },
  { label: "Rayo / eléctrico", value: "fi-power" },
  { label: "Contrato / lista", value: "fi-list" },
  { label: "Lupa / búsqueda",  value: "fi-magnifying-glass" },
  { label: "Teléfono",         value: "fi-telephone" },
  { label: "Correo",           value: "fi-mail" },
  { label: "Calendario",       value: "fi-calendar" },
  { label: "Reloj",            value: "fi-clock" },
  { label: "Visto bueno",      value: "fi-check" },
  { label: "Estrella",         value: "fi-star" },
  { label: "Información",      value: "fi-info" },
  { label: "Precio / etiqueta",value: "fi-price-tag" },
  { label: "Moneda",           value: "fi-dollar-bill" },
];


// ─── Picker de ícono personalizado ──────────────────────────────────────────
const IconPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = ICONOS.find((i) => i.value === value);

  return (
    <div className="icon-picker" ref={ref}>
      {/* Botón disparador */}
      <button
        type="button"
        className="icon-picker-trigger"
        onClick={() => setOpen((v) => !v)}
      >
        {selected ? (
          <>
            <i className={selected.value} aria-hidden="true" />
            <span>{selected.label}</span>
          </>
        ) : (
          <span className="icon-picker-placeholder">Selecciona un ícono</span>
        )}
        <span className="icon-picker-arrow">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="icon-picker-dropdown">
          {ICONOS.map((icono) => (
            <button
              key={icono.value}
              type="button"
              className={`icon-picker-option${value === icono.value ? " selected" : ""}`}
              onClick={() => {
                onChange(icono.value);
                setOpen(false);
              }}
            >
              <i className={icono.value} aria-hidden="true" />
              <span>{icono.label}</span>
              <code className="icon-picker-code">{icono.value}</code>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Componente principal ────────────────────────────────────────────────────
const ServiciosTab = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(INITIAL);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(true);

  const fetchServicios = async () => {
    setLoading(true);
    try {
      const res = await getAllServicios();
      setServicios(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServicios(); }, []);

  const filtered = servicios.filter((s) =>
    `${s.nombre} ${s.descripcion || ""} ${s.icono || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Manejador específico para el IconPicker
  const handleIconChange = (iconValue) => {
    setForm((prev) => ({ ...prev, icono: iconValue }));
    setError("");
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.descripcion || !form.precio || !form.icono) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    try {
      setSubmitting(true);
      const data = { ...form, precio: Number(form.precio) };
      if (editingId) {
        await updateServicio(editingId, data);
        setSuccess("Servicio actualizado correctamente.");
      } else {
        await createServicio(data);
        setSuccess("Servicio creado correctamente.");
      }
      setForm(INITIAL);
      setEditingId(null);
      fetchServicios();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar servicio.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s) => {
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion,
      precio: s.precio,
      icono: s.icono,
    });
    setEditingId(s._id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar el servicio "${nombre}"?`)) return;
    try {
      await deleteServicio(id);
      setServicios((prev) => prev.filter((s) => s._id !== id));
    } catch {
      alert("Error al eliminar servicio.");
    }
  };

  const handleCancel = () => {
    setForm(INITIAL);
    setEditingId(null);
    setError("");
  };

  return (
    <div className="tab-content">
      {/* ══ ACORDEÓN: Crear / Editar servicio ══ */}
      <div className="accordion-card">
        <button
          className="accordion-header"
          onClick={() => setShowForm((v) => !v)}
        >
          <span className="section-left">
            <span className="section-icon">
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faFileCirclePlus} />
            </span>
            <span className="section-title-text">
              {editingId ? "Editar servicio" : "Nuevo servicio"}
            </span>
          </span>
          <span className="accordion-arrow">
            <FontAwesomeIcon icon={faAngleDown} className={showForm ? "rotate" : ""} />
          </span>
        </button>

        {showForm && (
          <div className="accordion-body">
            {error   && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}

            <div className="form-grid">
              <div className="form-group">
                <label>Nombre *</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Cambio de aceite"
                />
              </div>

              <div className="form-group">
                <label>Precio *</label>
                <input
                  name="precio"
                  type="number"
                  value={form.precio}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group form-full">
                <label>Descripción *</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe el servicio..."
                />
              </div>

              <div className="form-group">
                <label>Ícono *</label>
                <IconPicker value={form.icono} onChange={handleIconChange} />
              </div>
            </div>

            <div className="form-actions">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting
                  ? "Guardando..."
                  : editingId
                    ? "Guardar cambios"
                    : "Crear servicio"}
              </button>
              {editingId && (
                <button className="btn-secondary" onClick={handleCancel}>
                  Cancelar edición
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══ ACORDEÓN: Servicios registrados ══ */}
      <div className="accordion-card">
        <button
          className="accordion-header"
          onClick={() => setShowList((v) => !v)}
        >
          <span className="section-left">
            <span className="section-icon">
              <FontAwesomeIcon icon={faFileCircleCheck} />
            </span>
            <span className="section-title-text">Servicios registrados</span>
            <span className="count-badge-inline">{servicios.length}</span>
          </span>
          <span className="accordion-arrow">
            <FontAwesomeIcon icon={faAngleDown} className={showList ? "rotate" : ""} />
          </span>
        </button>

        {showList && (
          <div className="accordion-body">
            <input
              className="search-input"
              placeholder="Buscar por nombre, descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading ? (
              <p className="loading-text">Cargando servicios...</p>
            ) : filtered.length === 0 ? (
              <p className="empty-text">No hay servicios que coincidan.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Ícono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s) => (
                      <tr key={s._id}>
                        <td><strong>{s.nombre}</strong></td>
                        <td className="desc-cell">{s.descripcion}</td>
                        <td>${Number(s.precio).toLocaleString()}</td>
                        <td>
                          <div className="icon-table-preview">
                            <i className={s.icono} aria-hidden="true" />
                            <code className="icon-code">{s.icono}</code>
                          </div>
                        </td>
                        <td className="actions-cell">
                          <div className="actions-wrapper">
                            <button className="btn-edit" onClick={() => handleEdit(s)}>
                              <FontAwesomeIcon icon={faPencil} className="btn-icon-mobile" />
                              <span className="btn-text">Editar</span>
                            </button>
                            <button className="btn-delete" onClick={() => handleDelete(s._id, s.nombre)}>
                              <FontAwesomeIcon icon={faTrash} className="btn-icon-mobile" />
                              <span className="btn-text">Eliminar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiciosTab;
