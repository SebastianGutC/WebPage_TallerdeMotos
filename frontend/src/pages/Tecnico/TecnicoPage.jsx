// src/pages/Tecnico/TecnicoPage.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./TecnicoPage.css";
import CitaCard from "./components/CitaCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotate, faTriangleExclamation,
  faCalendarDay, faCalendarCheck, faClipboardList,
  faCircleCheck, faCirclePlay, faXmark,
  faScrewdriverWrench
} from "@fortawesome/free-solid-svg-icons";
import {
  getCitasAsignadas,
  getServicios,
  getProductos,
} from "../../services/TecnicoService";
import { useAuth } from "../../context/UseAuth";

/* ─────────────────────────────────────────────────────────
   DATE HELPERS
   IMPORTANTE: usar métodos locales (getFullYear/getMonth/getDate)
   en vez de toISOString() para evitar el desfase UTC.

   toISOString() convierte a UTC — a las 7pm Colombia (UTC-5)
   ya son las 00:00 del día siguiente en UTC, por eso aparecía
   el 17 cuando aquí era todavía el 16.
───────────────────────────────────────────────────────── */

/**
 * Devuelve "YYYY-MM-DD" usando la hora LOCAL del dispositivo,
 * no UTC. Acepta un Date, un string ISO o nada (= ahora).
 */
const toLocalDateStr = (value) => {
  const d = value ? new Date(value) : new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const todayStr = () => toLocalDateStr();

const tomorrowStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toLocalDateStr(d);
};

const formatFullDate = (dateStr) =>
  // dateStr es "YYYY-MM-DD" local; agregamos T12:00 para evitar
  // que el constructor lo interprete en UTC y retroceda un día.
  new Date(dateStr + "T12:00:00").toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

/* ─── stat counts ─── */
const countByEstado = (list, estado) =>
  list.filter(c => (c.estado ?? "") === estado).length;   // BD usa minúscula

/* ═══════════════════════════════════════════════════════════ */
const TecnicoPage = () => {
  const { usuario } = useAuth();

  const [citas,      setCitas]      = useState([]);
  const [servicios,  setServicios]  = useState([]);
  const [productos,  setProductos]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [filterHoy,    setFilterHoy]    = useState("all");
  const [filterMañana, setFilterMañana] = useState("all");

  /* ── fetch ── */
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else { setLoading(true); setError(null); }

    try {
      const [citasRes, svcRes, prodRes] = await Promise.all([
        getCitasAsignadas(),
        getServicios(),
        getProductos(),
      ]);
      setCitas(citasRes.data    ?? citasRes    ?? []);
      setServicios(svcRes.data  ?? svcRes      ?? []);
      setProductos(prodRes.data ?? prodRes     ?? []);
    } catch (err) {
      console.error("Error cargando datos del técnico:", err);
      setError("No se pudieron cargar las citas. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── derived: usar la fecha local, no UTC ── */
  const hoy    = todayStr();
  const mañana = tomorrowStr();

  const citasHoy = useMemo(() =>
    // cita.fecha viene como ISO del servidor; toLocalDateStr lo convierte
    // con la zona horaria del navegador (Colombia, UTC-5).
    citas.filter(c => toLocalDateStr(c.fecha) === hoy),
  [citas, hoy]);

  const citasMañana = useMemo(() =>
    citas.filter(c => toLocalDateStr(c.fecha) === mañana),
  [citas, mañana]);

  // Filtros por estado (minúscula para coincidir con el enum de BD)
  const FILTERS = [
    { val: "all",        label: "Todas"       },
    { val: "disponible", label: "Disponibles" },
    { val: "pendiente",  label: "Pendientes"  },
    { val: "en_proceso", label: "En proceso"  },
    { val: "lista",      label: "Listas"      },
    { val: "cancelada",  label: "Canceladas"  },
  ];

  const applyFilter = (list, filter) =>
    filter === "all" ? list : list.filter(c => (c.estado ?? "") === filter);

  const filteredHoy    = applyFilter(citasHoy,    filterHoy);
  const filteredMañana = applyFilter(citasMañana, filterMañana);

  /* ── stats (hoy, estados en minúscula) ── */
  const totalHoy    = citasHoy.length;
  const enProceso   = countByEstado(citasHoy, "en_proceso");
  const completadas = countByEstado(citasHoy, "lista") +
                      countByEstado(citasHoy, "entregada");
  const canceladas  = countByEstado(citasHoy, "cancelada");

  /* ─── loading / error ─── */
  if (loading) {
    return (
      <div className="tecnico-loading">
        <div className="spinner" />
        <p>Cargando tu panel de trabajo…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tecnico-error">
        <FontAwesomeIcon icon={faTriangleExclamation} className="error-icon" />
        <p>{error}</p>
        <button className="retry-btn" onClick={() => fetchData()}>Reintentar</button>
      </div>
    );
  }

  /* ─── render ─── */
  return (
    <div className="tecnico-page">

      {/* ── HEADER ── */}
      <div className="tecnico-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon-wrap">
              <FontAwesomeIcon icon={faScrewdriverWrench} />
            </div>
            <div>
              <h1 className="tecnico-title">Panel de Técnico</h1>
              <p className="tecnico-subtitle">
                Tus citas asignadas
                <FontAwesomeIcon className="sub-icon" icon={faClipboardList} />
                {usuario?.nombre && (
                  <span className="tecnico-name-badge">{usuario.nombre}</span>
                )}
              </p>
            </div>
          </div>

          <div className="header-stats">
            <div className="stat-pill">
              <span className="stat-number">{totalHoy}</span>
              <span className="stat-label">Citas hoy</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number" style={{ color: "var(--blue)" }}>{enProceso}</span>
              <span className="stat-label">En proceso</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number" style={{ color: "var(--green)" }}>{completadas}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number" style={{ color: "var(--red)" }}>{canceladas}</span>
              <span className="stat-label">Canceladas</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number" style={{ color: "var(--purple)" }}>{citasMañana.length}</span>
              <span className="stat-label">Mañana</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DATE STRIP ── */}
      <div className="date-strip">
        <span className="today-chip">Hoy</span>
        <span className="full-date">{formatFullDate(hoy)}</span>
        <button
          className={`refresh-btn ${refreshing ? "spinning" : ""}`}
          onClick={() => fetchData(true)}
          style={{ marginLeft: "auto" }}
        >
          <FontAwesomeIcon icon={faRotate} />
          {refreshing ? "Actualizando…" : "Actualizar"}
        </button>
      </div>

      {/* ── BODY ── */}
      <div className="tecnico-body">

        {/* ── HOY ── */}
        <section className="day-section">
          <div className="day-section-header">
            <h2 className="day-section-title">
              <FontAwesomeIcon icon={faCalendarDay} />
              Citas de hoy
              <span className="day-count-badge">{citasHoy.length}</span>
            </h2>
            <div className="section-toolbar">
              {FILTERS.map(f => (
                <button
                  key={f.val}
                  className={`filter-btn ${filterHoy === f.val ? "active" : ""}`}
                  onClick={() => setFilterHoy(f.val)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredHoy.length === 0 ? (
            <div className="empty-day">
              <FontAwesomeIcon icon={faCalendarDay} />
              <p>
                {filterHoy === "all"
                  ? "No tienes citas asignadas para hoy."
                  : `No hay citas con estado "${FILTERS.find(f => f.val === filterHoy)?.label}".`}
              </p>
            </div>
          ) : (
            filteredHoy.map(cita => (
              <CitaCard
                key={cita._id ?? cita.id}
                cita={cita}
                serviciosCatalogo={servicios}
                productosCatalogo={productos}
                onRefresh={() => fetchData(true)}
              />
            ))
          )}
        </section>

        {/* ── MAÑANA ── */}
        <section className="day-section">
          <div className="day-section-header">
            <h2 className="day-section-title">
              <FontAwesomeIcon icon={faCalendarCheck} />
              Citas de mañana
              <span className="day-count-badge">{citasMañana.length}</span>
            </h2>
            <div className="section-toolbar">
              {FILTERS.map(f => (
                <button
                  key={f.val}
                  className={`filter-btn ${filterMañana === f.val ? "active" : ""}`}
                  onClick={() => setFilterMañana(f.val)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filteredMañana.length === 0 ? (
            <div className="empty-day">
              <FontAwesomeIcon icon={faCalendarCheck} />
              <p>
                {filterMañana === "all"
                  ? "No tienes citas asignadas para mañana."
                  : `No hay citas con estado "${FILTERS.find(f => f.val === filterMañana)?.label}".`}
              </p>
            </div>
          ) : (
            filteredMañana.map(cita => (
              <CitaCard
                key={cita._id ?? cita.id}
                cita={cita}
                serviciosCatalogo={servicios}
                productosCatalogo={productos}
                onRefresh={() => fetchData(true)}
              />
            ))
          )}
        </section>

      </div>
    </div>
  );
};

export default TecnicoPage;