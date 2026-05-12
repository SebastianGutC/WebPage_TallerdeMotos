import API from "./Api";

export const getCitas = async () => {
    return API.get("/citas");
}

export const getCitasByUsuario = async (usuarioId) => {
    return API.get(`/citas/usuario/${usuarioId}`);
}

export const getCitasPorEstado = async (estado) => {
    return API.get(`/citas/estado/${estado}`);
}

export const getCitasPorFecha = async (fecha) => {
    return API.get(`/citas/fecha/buscar?fecha=${fecha}`);
}

export const getCitasAsignadas = async () => {
    return API.get("/citas/tecnico/asignadas");
}

export const getDetalleCitaTecnico = async (id) => {
    return API.get(`/citas/tecnico/detalle/${id}`);
}

export const getCitaPorId = async (id) => {
    return API.get(`/citas/${id}`);
}

export const crearCita = async (citaData) => {
    return API.post("/citas", citaData);
}

export const actualizarCita = async (id, citaData) => {
    return API.put(`/citas/${id}`, citaData);
}

export const eliminarCita = async (id) => {
    return API.delete(`/citas/${id}`);
}

export const cancelarCita = async (id) => {
    return API.put(`/citas/${id}/cancelar`);
}

export const asignarTecnico = async (id, tecnicoId) => {
    return API.put(`/citas/${id}/asignar-tecnico`, { tecnicoId });
}

export const cambiarEstadoCita = async (id, nuevoEstado) => {
    return API.put(`/citas/${id}/cambiar-estado`, { nuevoEstado });
}

export const addServicioToCita = async (citaId, servicioId) => {
    return API.post(`/citas/${citaId}/servicios`, { servicioId });
}

export const removeServicioFromCita = async (citaId, servicioId) => {
    return API.delete(`/citas/${citaId}/servicios/${servicioId}`);
}

export const addProductoToCita = async (citaId, productoId) => {
    return API.post(`/citas/${citaId}/productos`, { productoId });
}

export const removeProductoFromCita = async (citaId, productoId) => {
    return API.delete(`/citas/${citaId}/productos/${productoId}`);
}

export const agendarCita = async (id, data) => {
    return API.put(`/citas/${id}/agendar`, data);
}