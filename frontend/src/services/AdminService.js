// src/services/AdminService.js
import API from "./Api";

// ─── USUARIOS ─────────────────────────────────────────────────────────────────
export const getAllUsers        = ()          => API.get("/usuarios");
export const getUserById        = (id)        => API.get(`/usuarios/${id}`);
export const toggleUserStatus   = (id, hab)   => API.put(`/usuarios/${id}`, { habilitado: hab });
export const deleteUser         = (id)        => API.delete(`/usuarios/${id}`);
export const changeUserRole     = (id, rol)   => API.put(`/usuarios/${id}/rol`, { rol });
export const getUserCitas       = (id)        => API.get(`/usuarios/${id}/citas`);
export const createTecnico      = (data)      => API.post("/usuarios/tecnico", data);
export const changePassword     = (data)      => API.put("/usuarios/cambiar-password", data);

// ─── CITAS ────────────────────────────────────────────────────────────────────
export const getAllCitas         = ()          => API.get("/citas");
export const getCitaById        = (id)        => API.get(`/citas/${id}`);
export const getCitasByEstado   = (estado)    => API.get(`/citas/estado/${estado}`);
export const getCitasByFecha    = (fecha)     => API.get(`/citas/fecha/buscar?fecha=${fecha}`);
export const updateCitaEstado   = (id, est)   => API.put(`/citas/${id}/estado`, { estado: est });
export const asignarTecnicoCita = (id, tecId) => API.put(`/citas/${id}/asignar-tecnico`, { tecnicoId: tecId });
export const deleteCita         = (id)        => API.delete(`/citas/${id}`);
export const addServicioACita   = (id, sId)   => API.post(`/citas/${id}/servicios`, { servicioId: sId });
export const removeServicioDeCita = (id, idx) => API.delete(`/citas/${id}/servicios/${idx}`);
export const addProductoACita   = (id, pId, cantidad) => API.post(`/citas/${id}/productos`, { productoId: pId, cantidad });
export const removeProductoDeCita = (id, idx) => API.delete(`/citas/${id}/productos/${idx}`);

// ─── SERVICIOS ────────────────────────────────────────────────────────────────
export const getAllServicios     = ()          => API.get("/servicios");
export const createServicio     = (data)      => API.post("/servicios", data);
export const updateServicio     = (id, data)  => API.put(`/servicios/${id}`, data);
export const deleteServicio     = (id)        => API.delete(`/servicios/${id}`);

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────
export const getAllProductos     = ()          => API.get("/productos");
export const createProducto     = (data)      => API.post("/productos", data);
export const updateProducto     = (id, data)  => API.put(`/productos/${id}`, data);
export const deleteProducto     = (id)        => API.delete(`/productos/${id}`);