// src/pages/Admin/citasConstants.js
// Fuente única de verdad para estados de citas — importar en todos los tabs

export const ESTADOS_EDIT = [
  "disponible", "pendiente", "en_proceso",
  "lista", "entregada", "cancelada", "no_asistio"
];

export const ESTADO_LABEL = {
  disponible: "Disponible",
  pendiente:  "Pendiente",
  en_proceso: "En proceso",
  lista:      "Lista",
  entregada:  "Entregada",
  cancelada:  "Cancelada",
  no_asistio: "No asistió",
};

export const ESTADO_COLORS = {
  disponible: "#69c1e7",
  pendiente:  "#fa931d",
  en_proceso: "#6599ed",
  lista:      "#16d93d",
  entregada:  "#1414a4",
  cancelada:  "#e01a1a",
  no_asistio: "#9ca3af",
};

/** Devuelve el badge de estado listo para usar en JSX */
export const EstadoBadge = ({ estado }) => (
  <span
    style={{
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: 600,
      color: "#fff",
      background: ESTADO_COLORS[estado] || "#888",
    }}
  >
    {ESTADO_LABEL[estado] || estado}
  </span>
);