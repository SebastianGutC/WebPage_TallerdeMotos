// src/services/TecnicoService.js
import API from "./Api";

// ─── CITAS DEL TÉCNICO ────────────────────────────────────────────────────────
export const getCitasAsignadas = ()           => API.get("/citas/tecnico/asignadas");
export const getDetalleCita    = (id)         => API.get(`/citas/tecnico/detalle/${id}`);

// FIX: el controller lee req.body.estado, NO nuevoEstado
export const cambiarEstadoCita = (id, estado) => API.put(`/citas/${id}/cambiar-estado`, { estado });

// ─── SERVICIOS EN CITA ────────────────────────────────────────────────────────
export const agregarServicio  = (citaId, servicioId)              => API.post(`/citas/${citaId}/servicios`, { servicioId });
// FIX: el controller usa splice(index,1) — se pasa el índice del array, no el _id
export const eliminarServicio = (citaId, index)                   => API.delete(`/citas/${citaId}/servicios/${index}`);

// ─── PRODUCTOS EN CITA ────────────────────────────────────────────────────────
export const agregarProducto  = (citaId, productoId, cantidad = 1) => API.post(`/citas/${citaId}/productos`, { productoId, cantidad });
// FIX: ídem — índice del array
export const eliminarProducto = (citaId, index)                   => API.delete(`/citas/${citaId}/productos/${index}`);

// ─── CATÁLOGOS ────────────────────────────────────────────────────────────────
export const getServicios = () => API.get("/servicios");
export const getProductos = () => API.get("/productos");