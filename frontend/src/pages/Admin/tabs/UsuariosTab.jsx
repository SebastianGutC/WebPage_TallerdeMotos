// src/pages/Admin/tabs/UsuariosTab.jsx
import React, { useEffect, useState } from "react";
import {
  getAllUsers, toggleUserStatus, deleteUser, getUserCitas, changeUserRole,
} from "../../../services/AdminService";
import { ESTADO_COLORS, ESTADO_LABEL } from "../citasConstants.jsx";

const UsuariosTab = () => {
  const [users, setUsers]             = useState([]);
  const [loading, setLoading]         = useState(false);
  const [search, setSearch]           = useState("");
  const [expandedCitas, setExpandedCitas] = useState(null);
  const [userCitas, setUserCitas]     = useState({});
  const [loadingCitas, setLoadingCitas] = useState({});
  const [editingId, setEditingId]     = useState(null);
  const [editForm, setEditForm]       = useState({});
  const [savingId, setSavingId]       = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.filter(u => u.rol === "USUARIO"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  /* ── Búsqueda ── */
  const filtered = users.filter(u =>
    `${u.nombre} ${u.apellido} ${u.email} ${u.telefono || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ── Toggle activo/inactivo ── */
  const handleToggle = async (id, habilitado) => {
    try {
      await toggleUserStatus(id, habilitado);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, habilitado } : u));
    } catch {
      alert("Error al cambiar estado del usuario.");
    }
  };

  /* ── Eliminar ── */
  const handleDelete = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar a ${nombre}? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      alert("Error al eliminar usuario.");
    }
  };

  /* ── Convertir a técnico ── */
  const handleConvertToTecnico = async (id, nombre) => {
    if (!window.confirm(`¿Convertir a ${nombre} en técnico? Podrá recibir citas asignadas.`)) return;
    try {
      await changeUserRole(id, "TECNICO");
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch {
      alert("Error al cambiar rol.");
    }
  };

  /* ── Edición inline ── */
  const handleStartEdit = (u) => {
    setEditingId(u._id);
    setEditForm({
      nombre:   u.nombre   || "",
      apellido: u.apellido || "",
      email:    u.email    || "",
      telefono: u.telefono || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id) => {
    setSavingId(id);
    try {
      const API = (await import("../../../services/Api")).default;
      await API.put(`/usuarios/${id}`, editForm);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, ...editForm } : u));
      setEditingId(null);
      setEditForm({});
    } catch {
      alert("Error al guardar cambios.");
    } finally {
      setSavingId(null);
    }
  };

  /* ── Ver citas del usuario ── */
  const handleExpandCitas = async (id) => {
    if (expandedCitas === id) { setExpandedCitas(null); return; }
    setExpandedCitas(id);
    if (userCitas[id] !== undefined) return;
    setLoadingCitas(prev => ({ ...prev, [id]: true }));
    try {
      const res = await getUserCitas(id);
      setUserCitas(prev => ({ ...prev, [id]: res.data }));
    } catch {
      setUserCitas(prev => ({ ...prev, [id]: [] }));
    } finally {
      setLoadingCitas(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="tab-title">Usuarios registrados</h2>
        <span className="count-badge">{filtered.length} usuarios</span>
      </div>

      <input
        className="search-input"
        placeholder="Buscar por nombre, email o teléfono..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="loading-text">Cargando usuarios...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-text">No hay usuarios que coincidan.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <React.Fragment key={u._id}>
                  {/* ── Fila normal o en edición ── */}
                  {editingId === u._id ? (
                    <tr className="row-editing">
                      <td>
                        <div className="inline-edit-group">
                          <input
                            className="inline-input"
                            value={editForm.nombre}
                            onChange={e => setEditForm({ ...editForm, nombre: e.target.value })}
                            placeholder="Nombre"
                          />
                          <input
                            className="inline-input"
                            value={editForm.apellido}
                            onChange={e => setEditForm({ ...editForm, apellido: e.target.value })}
                            placeholder="Apellido"
                          />
                        </div>
                      </td>
                      <td>
                        <input
                          className="inline-input"
                          value={editForm.email}
                          onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Email"
                        />
                      </td>
                      <td>
                        <input
                          className="inline-input"
                          value={editForm.telefono}
                          onChange={e => setEditForm({ ...editForm, telefono: e.target.value })}
                          placeholder="Teléfono"
                        />
                      </td>
                      <td>—</td>
                      <td className="actions-cell">
                        <button
                          className="btn-save"
                          onClick={() => handleSaveEdit(u._id)}
                          disabled={savingId === u._id}
                        >
                          {savingId === u._id ? "Guardando..." : "✓ Guardar"}
                        </button>
                        <button className="btn-secondary-sm" onClick={handleCancelEdit}>
                          ✕ Cancelar
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr className={!u.habilitado ? "row-disabled" : ""}>
                      <td><strong>{u.nombre} {u.apellido}</strong></td>
                      <td>{u.email}</td>
                      <td>{u.telefono || "—"}</td>
                      <td>
                        <button
                          className={`btn-status ${u.habilitado ? "enabled" : "disabled"}`}
                          onClick={() => handleToggle(u._id, !u.habilitado)}
                        >
                          {u.habilitado ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                      <td className="actions-cell">
                        <button className="btn-expand" onClick={() => handleExpandCitas(u._id)}>
                          {expandedCitas === u._id ? "▲ Citas" : "▼ Citas"}
                        </button>
                        <button className="btn-edit" onClick={() => handleStartEdit(u)}>
                          Editar
                        </button>
                        <button
                          className="btn-convert"
                          onClick={() => handleConvertToTecnico(u._id, u.nombre)}
                          title="Convertir en técnico"
                        >
                          🔧 Técnico
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(u._id, u.nombre)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* ── Citas expandidas ── */}
                  {expandedCitas === u._id && editingId !== u._id && (
                    <tr className="expanded-row">
                      <td colSpan={5}>
                        <div className="expanded-content">
                          <h4>Historial de citas — {u.nombre} {u.apellido}</h4>
                          {loadingCitas[u._id] ? (
                            <p className="loading-text">Cargando citas...</p>
                          ) : !userCitas[u._id]?.length ? (
                            <p className="empty-text">No tiene citas registradas.</p>
                          ) : (
                            <table className="inner-table">
                              <thead>
                                <tr>
                                  <th>Fecha</th>
                                  <th>Hora</th>
                                  <th>Estado</th>
                                  <th>Técnico</th>
                                  <th>Moto / Placa</th>
                                </tr>
                              </thead>
                              <tbody>
                                {userCitas[u._id].map(c => (
                                  <tr key={c._id}>
                                    <td>{new Date(c.fecha).toLocaleDateString("es-CO")}</td>
                                    <td>{c.hora}</td>
                                    <td>
                                      <span className="estado-badge" style={{ background: ESTADO_COLORS[c.estado] || "#888" }}>
                                        {ESTADO_LABEL[c.estado] || c.estado}
                                      </span>
                                    </td>
                                    <td>
                                      {c.tecnicoId
                                        ? `${c.tecnicoId.nombre} ${c.tecnicoId.apellido}`
                                        : <span className="text-muted">Sin asignar</span>}
                                    </td>
                                    <td>
                                      {c.motocicletaId
                                        ? `${c.motocicletaId.marca} ${c.motocicletaId.nombre}`
                                        : c.placaMoto || "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
    </div>
  );
};

export default UsuariosTab;