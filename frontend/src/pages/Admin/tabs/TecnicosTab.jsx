// src/pages/Admin/tabs/TecnicosTab.jsx
import React, { useEffect, useState } from "react";
import { getAllUsers, toggleUserStatus } from "../../../services/AdminService";
import API from "../../../services/Api";
import { ESTADO_COLORS, ESTADO_LABEL } from "../citasConstants.jsx";

const TecnicosTab = () => {
  const [tecnicos, setTecnicos]         = useState([]);
  const [loading, setLoading]           = useState(false);
  const [search, setSearch]             = useState("");
  const [expandedId, setExpandedId]     = useState(null);
  const [tecCitas, setTecCitas]         = useState({});
  const [loadingCitas, setLoadingCitas] = useState({});
  const [expandedCita, setExpandedCita] = useState(null);

  const fetchTecnicos = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setTecnicos(res.data.filter(u => u.rol === "TECNICO"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTecnicos(); }, []);

  const filtered = tecnicos.filter(t =>
    `${t.nombre} ${t.apellido} ${t.email} ${t.telefono || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleToggle = async (id, habilitado) => {
    try {
      await toggleUserStatus(id, habilitado);
      setTecnicos(prev => prev.map(t => t._id === id ? { ...t, habilitado } : t));
    } catch {
      alert("Error al cambiar estado del técnico.");
    }
  };

  const handleExpand = async (id) => {
    if (expandedId === id) { setExpandedId(null); return; }
    setExpandedId(id);
    if (tecCitas[id] !== undefined) return;
    setLoadingCitas(prev => ({ ...prev, [id]: true }));
    try {
      // Reutilizamos el endpoint de citas filtrando por tecnicoId en cliente
      const res = await API.get("/citas");
      const citasDelTecnico = res.data.filter(c => c.tecnicoId?._id === id || c.tecnicoId === id);
      setTecCitas(prev => ({ ...prev, [id]: citasDelTecnico }));
    } catch {
      setTecCitas(prev => ({ ...prev, [id]: [] }));
    } finally {
      setLoadingCitas(prev => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2 className="tab-title">Técnicos del sistema</h2>
        <span className="count-badge">{filtered.length} técnicos</span>
      </div>

      <input
        className="search-input"
        placeholder="Buscar por nombre, email o teléfono..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="loading-text">Cargando técnicos...</p>
      ) : filtered.length === 0 ? (
        <p className="empty-text">No hay técnicos que coincidan.</p>
      ) : (
        <>
          {/* ── Activos ── */}
          <div className="section-group-label">Técnicos activos</div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Citas asignadas</th>
                </tr>
              </thead>
              <tbody>
                {filtered.filter(t => t.habilitado).length === 0 ? (
                  <tr><td colSpan={5} className="empty-text">Sin técnicos activos.</td></tr>
                ) : filtered.filter(t => t.habilitado).map(t => (
                  <React.Fragment key={t._id}>
                    <tr>
                      <td><strong>{t.nombre} {t.apellido}</strong></td>
                      <td>{t.email}</td>
                      <td>{t.telefono || "—"}</td>
                      <td>
                        <button className="btn-status enabled" onClick={() => handleToggle(t._id, false)}>
                          Activo
                        </button>
                      </td>
                      <td>
                        <button className="btn-expand" onClick={() => handleExpand(t._id)}>
                          {expandedId === t._id ? "▲ Ocultar" : "▼ Ver citas"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === t._id && (
                      <tr className="expanded-row">
                        <td colSpan={5}>
                          <CitasDelTecnico
                            tecnico={t}
                            citas={tecCitas[t._id]}
                            loading={loadingCitas[t._id]}
                            expandedCita={expandedCita}
                            setExpandedCita={setExpandedCita}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Inactivos ── */}
          <div className="section-group-label inactive-label">Técnicos inactivos</div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Citas asignadas</th>
                </tr>
              </thead>
              <tbody>
                {filtered.filter(t => !t.habilitado).length === 0 ? (
                  <tr><td colSpan={5} className="empty-text">Sin técnicos inactivos.</td></tr>
                ) : filtered.filter(t => !t.habilitado).map(t => (
                  <React.Fragment key={t._id}>
                    <tr className="row-disabled">
                      <td><strong>{t.nombre} {t.apellido}</strong></td>
                      <td>{t.email}</td>
                      <td>{t.telefono || "—"}</td>
                      <td>
                        <button className="btn-status disabled" onClick={() => handleToggle(t._id, true)}>
                          Inactivo
                        </button>
                      </td>
                      <td>
                        <button className="btn-expand" onClick={() => handleExpand(t._id)}>
                          {expandedId === t._id ? "▲ Ocultar" : "▼ Ver citas"}
                        </button>
                      </td>
                    </tr>
                    {expandedId === t._id && (
                      <tr className="expanded-row">
                        <td colSpan={5}>
                          <CitasDelTecnico
                            tecnico={t}
                            citas={tecCitas[t._id]}
                            loading={loadingCitas[t._id]}
                            expandedCita={expandedCita}
                            setExpandedCita={setExpandedCita}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

/* ── Sub-componente: citas de un técnico con detalle expandible ── */
const CitasDelTecnico = ({ tecnico, citas, loading, expandedCita, setExpandedCita }) => {
  if (loading) return <div className="expanded-content"><p className="loading-text">Cargando citas...</p></div>;
  if (!citas || citas.length === 0) {
    return (
      <div className="expanded-content">
        <h4>Citas de {tecnico.nombre} {tecnico.apellido}</h4>
        <p className="empty-text">No tiene citas asignadas.</p>
      </div>
    );
  }

  return (
    <div className="expanded-content" style={{ flexDirection: "column", gap: "12px" }}>
      <h4>Citas de {tecnico.nombre} {tecnico.apellido} ({citas.length})</h4>
      <table className="inner-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Estado</th>
            <th>Cliente</th>
            <th>Moto</th>
            <th>Detalle</th>
          </tr>
        </thead>
        <tbody>
          {citas.map(c => (
            <React.Fragment key={c._id}>
              <tr>
                <td>{new Date(c.fecha).toLocaleDateString("es-CO")}</td>
                <td>{c.hora}</td>
                <td>
                  <span className="estado-badge" style={{ background: ESTADO_COLORS[c.estado] || "#888" }}>
                    {c.estado}
                  </span>
                </td>
                <td>
                  {c.usuarioId
                    ? `${c.usuarioId.nombre} ${c.usuarioId.apellido}`
                    : <span className="text-muted">—</span>}
                </td>
                <td>
                  {c.motocicletaId
                    ? `${c.motocicletaId.marca} ${c.motocicletaId.nombre}`
                    : c.placaMoto || "—"}
                </td>
                <td>
                  <button
                    className="btn-expand"
                    onClick={() => setExpandedCita(expandedCita === c._id ? null : c._id)}
                  >
                    {expandedCita === c._id ? "▲" : "▼"}
                  </button>
                </td>
              </tr>
              {expandedCita === c._id && (
                <tr className="expanded-row">
                  <td colSpan={6}>
                    <div className="cita-detail" style={{ padding: "12px 16px" }}>
                      <div className="detail-section">
                        <h4>Servicios</h4>
                        {!c.servicios?.length ? <p className="empty-text">Sin servicios.</p> : (
                          <ul className="detail-list">
                            {c.servicios.map((s, i) => (
                              <li key={i}>
                                <span>{s.nombre}</span>
                                <span className="detail-cost">${Number(s.costo).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="detail-section">
                        <h4>Productos</h4>
                        {!c.productos?.length ? <p className="empty-text">Sin productos.</p> : (
                          <ul className="detail-list">
                            {c.productos.map((p, i) => (
                              <li key={i}>
                                <span>{p.nombre} × {p.cantidad}</span>
                                <span className="detail-cost">${Number(p.costo).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      {c.fechaEntrega && (
                        <p className="detail-entrega">
                          📅 Entrega estimada: <strong>{new Date(c.fechaEntrega).toLocaleDateString("es-CO")}</strong>
                        </p>
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
  );
};

export default TecnicosTab;