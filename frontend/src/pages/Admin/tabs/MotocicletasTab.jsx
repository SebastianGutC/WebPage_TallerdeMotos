// src/pages/Admin/tabs/MotocicletasTab.jsx
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMotorcycle, faCirclePlus ,faAngleDown, faPenToSquare, faListUl, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getAllMotocicletas, createMotocicleta, updateMotocicleta, deleteMotocicleta } from "../../../services/AdminService";

const INITIAL = {
  nombre:  "",
  marca:   "",
  tipo:    "",
  modelo:  "",
  detalles: {
    cilindraje:       "",
    tipo_motor:       "",
    sistema_frenos:   "",
    tipo_combustible: "",
    capacidad_aceite: "",
    tipo_transmision: "",
  },
};

const MotocicletasTab = () => {
  const [motos, setMotos]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState("");
  const [form, setForm]             = useState(INITIAL);
  const [editingId, setEditingId]   = useState(null);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [showList, setShowList]     = useState(true);
  const [expandedId, setExpandedId] = useState(null); // para ver detalles en tabla

  const fetchMotos = async () => {
    setLoading(true);
    try { const res = await getAllMotocicletas(); setMotos(res.data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMotos(); }, []);

  const filtered = motos.filter(m =>
    `${m.nombre} ${m.marca} ${m.tipo} ${m.modelo}`
      .toLowerCase().includes(search.toLowerCase())
  );

  // ── Cambios en campos simples ──────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ── Cambios en campos anidados de detalles ─────────────────────────────────
  const handleDetallesChange = (e) => {
    setForm({
      ...form,
      detalles: { ...form.detalles, [e.target.name]: e.target.value },
    });
    setError("");
  };

  // ── Validar y enviar ───────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const { nombre, marca, tipo, modelo, detalles } = form;
    const {
      cilindraje, tipo_motor, sistema_frenos,
      tipo_combustible, capacidad_aceite, tipo_transmision,
    } = detalles;

    if (!nombre || !marca || !tipo || !modelo ||
        !cilindraje || !tipo_motor || !sistema_frenos ||
        !tipo_combustible || !capacidad_aceite || !tipo_transmision) {
      setError("Todos los campos son obligatorios."); return;
    }

    try {
      setSubmitting(true);
      const data = {
        nombre, marca, tipo, modelo,
        detalles: {
          cilindraje:       Number(cilindraje),
          tipo_motor,
          sistema_frenos,
          tipo_combustible,
          capacidad_aceite: Number(capacidad_aceite),
          tipo_transmision,
        },
      };

      if (editingId) {
        await updateMotocicleta(editingId, data);
        setSuccess("Motocicleta actualizada correctamente.");
      } else {
        await createMotocicleta(data);
        setSuccess("Motocicleta creada correctamente.");
      }

      setForm(INITIAL);
      setEditingId(null);
      fetchMotos();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar motocicleta.");
    } finally { setSubmitting(false); }
  };

  // ── Editar: rellena el form y abre el acordeón ─────────────────────────────
  const handleEdit = (m) => {
    setForm({
      nombre:  m.nombre  || "",
      marca:   m.marca   || "",
      tipo:    m.tipo    || "",
      modelo:  m.modelo  || "",
      detalles: {
        cilindraje:       m.detalles?.cilindraje       || "",
        tipo_motor:       m.detalles?.tipo_motor       || "",
        sistema_frenos:   m.detalles?.sistema_frenos   || "",
        tipo_combustible: m.detalles?.tipo_combustible || "",
        capacidad_aceite: m.detalles?.capacidad_aceite || "",
        tipo_transmision: m.detalles?.tipo_transmision || "",
      },
    });
    setEditingId(m._id);
    setShowForm(true);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => { setForm(INITIAL); setEditingId(null); setError(""); };

  // ── Eliminar ───────────────────────────────────────────────────────────────
  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar la motocicleta "${nombre}"?`)) return;
    try {
      await deleteMotocicleta(id);
      setMotos(prev => prev.filter(m => m._id !== id));
    } catch { alert("Error al eliminar motocicleta."); }
  };

  return (
    <div className="tab-content">

      {/* ══ ACORDEÓN: Crear / Editar ══════════════════════════════════════════ */}
      <div className="accordion-card">
        <button className="accordion-header" onClick={() => setShowForm(v => !v)}>
          <span className="section-left">
            <span className="section-icon">
              <FontAwesomeIcon icon={editingId ? faPenToSquare : faCirclePlus} />
            </span>
            <span className="section-title-text">
              {editingId ? "Editar Motocicleta" : "Nueva Motocicleta"}
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

            {/* ── Datos generales ── */}
            <p className="form-section-label">Datos generales</p>
            <div className="form-grid">
              <div className="form-group">
                <label>Nombre *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange}
                  placeholder="Ej: CB 190R" />
              </div>
              <div className="form-group">
                <label>Marca *</label>
                <input name="marca" value={form.marca} onChange={handleChange}
                  placeholder="Ej: Honda" />
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <input name="tipo" value={form.tipo} onChange={handleChange}
                  placeholder="Ej: Deportiva, Naked, Touring..." />
              </div>
              <div className="form-group">
                <label>Modelo (año) *</label>
                <input name="modelo" value={form.modelo} onChange={handleChange}
                  placeholder="Ej: 2023" />
              </div>
            </div>

            {/* ── Detalles técnicos ── */}
            <p className="form-section-label">Detalles técnicos</p>
            <div className="form-grid">
              <div className="form-group">
                <label>Cilindraje (cc) *</label>
                <input name="cilindraje" type="number" min="0"
                  value={form.detalles.cilindraje} onChange={handleDetallesChange}
                  placeholder="Ej: 190" />
              </div>
              <div className="form-group">
                <label>Tipo de motor *</label>
                <input name="tipo_motor" value={form.detalles.tipo_motor}
                  onChange={handleDetallesChange}
                  placeholder="Ej: Monocilíndrico 4T SOHC" />
              </div>
              <div className="form-group">
                <label>Sistema de frenos *</label>
                <input name="sistema_frenos" value={form.detalles.sistema_frenos}
                  onChange={handleDetallesChange}
                  placeholder="Ej: Disco delantero y trasero" />
              </div>
              <div className="form-group">
                <label>Tipo de combustible *</label>
                <input name="tipo_combustible" value={form.detalles.tipo_combustible}
                  onChange={handleDetallesChange}
                  placeholder="Ej: Gasolina 87 octanos" />
              </div>
              <div className="form-group">
                <label>Capacidad de aceite (L) *</label>
                <input name="capacidad_aceite" type="number" min="0" step="0.1"
                  value={form.detalles.capacidad_aceite} onChange={handleDetallesChange}
                  placeholder="Ej: 1.2" />
              </div>
              <div className="form-group">
                <label>Tipo de transmisión *</label>
                <input name="tipo_transmision" value={form.detalles.tipo_transmision}
                  onChange={handleDetallesChange}
                  placeholder="Ej: Manual 6 velocidades" />
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Guardando..." : editingId ? "Guardar cambios" : "Crear motocicleta"}
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

      {/* ══ ACORDEÓN: Lista de motocicletas ══════════════════════════════════ */}
      <div className="accordion-card">
        <button className="accordion-header" onClick={() => setShowList(v => !v)}>
          <span className="section-left">
            <span className="section-icon">
              <FontAwesomeIcon icon={faListUl} />
            </span>
            <span className="section-title-text">Motocicletas registradas</span>
            <span className="count-badge-inline">{motos.length}</span>
          </span>
          <span className="accordion-arrow">
            <FontAwesomeIcon icon={faAngleDown} className={showList ? "rotate" : ""} />
          </span>
        </button>

        {showList && (
          <div className="accordion-body">
            <input
              className="search-input"
              placeholder="Buscar por nombre, marca, tipo o modelo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            {loading ? (
              <p className="loading-text">Cargando motocicletas...</p>
            ) : filtered.length === 0 ? (
              <p className="empty-text">No hay motocicletas que coincidan.</p>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Marca</th>
                      <th>Tipo</th>
                      <th>Modelo</th>
                      <th>Cilindraje</th>
                      <th>Detalles</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(m => (
                      <React.Fragment key={m._id}>
                        <tr className={editingId === m._id ? "row-selected" : ""}>
                          <td><strong>{m.nombre}</strong></td>
                          <td>{m.marca}</td>
                          <td>{m.tipo}</td>
                          <td>{m.modelo}</td>
                          <td>{m.detalles?.cilindraje} cc</td>
                          <td>
                            <button
                              className="btn-expand"
                              onClick={() => setExpandedId(expandedId === m._id ? null : m._id)}
                            >
                              {expandedId === m._id ? "▲ Ocultar" : "▼ Ver"}
                            </button>
                          </td>
                          <td className="actions-cell">
                            <div className="actions-wrapper">
                              <button
                                className={`btn-edit ${editingId === m._id ? "btn-edit-active" : ""}`}
                                onClick={() => handleEdit(m)}
                              >
                                <FontAwesomeIcon icon={faPencil} className="btn-icon-mobile" />
                                <span className="btn-text">
                                  {editingId === m._id ? "Editando..." : "Editar"}
                                </span>
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => handleDelete(m._id, m.nombre)}
                                disabled={editingId === m._id}
                              >
                                <FontAwesomeIcon icon={faTrash} className="btn-icon-mobile" />
                                <span className="btn-text">Eliminar</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* ── Fila expandida con detalles técnicos ── */}
                        {expandedId === m._id && (
                          <tr className="expanded-row">
                            <td colSpan={7}>
                              <div className="moto-detalles-grid">
                                <div className="moto-detalle-item">
                                  <span className="moto-detalle-label">Motor</span>
                                  <span className="moto-detalle-valor">{m.detalles?.tipo_motor || "—"}</span>
                                </div>
                                <div className="moto-detalle-item">
                                  <span className="moto-detalle-label">Sistema de frenos</span>
                                  <span className="moto-detalle-valor">{m.detalles?.sistema_frenos || "—"}</span>
                                </div>
                                <div className="moto-detalle-item">
                                  <span className="moto-detalle-label">Combustible</span>
                                  <span className="moto-detalle-valor">{m.detalles?.tipo_combustible || "—"}</span>
                                </div>
                                <div className="moto-detalle-item">
                                  <span className="moto-detalle-label">Capacidad de aceite</span>
                                  <span className="moto-detalle-valor">{m.detalles?.capacidad_aceite} L</span>
                                </div>
                                <div className="moto-detalle-item">
                                  <span className="moto-detalle-label">Transmisión</span>
                                  <span className="moto-detalle-valor">{m.detalles?.tipo_transmision || "—"}</span>
                                </div>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MotocicletasTab;