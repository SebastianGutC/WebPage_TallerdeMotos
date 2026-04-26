import API from "./Api";

export const obtenerUsuarios = async () => {
  return API.get("/usuarios");
}

export const crearTecnico = async (data) => {
  return API.post("/usuarios/tecnico", data);
}

export const cambiarPassword = async (data) => {
  return API.put("/usuarios/cambiar-password", data);
}

export const cambiarRolUsuario = async (id, data) => {
  return API.put(`/usuarios/${id}/rol`, data);
}

export const obtenerUsuarioPorId = async (id) => {
  return API.get(`/usuarios/${id}`);
}

export const actualizarUsuario = async (id, data) => {
  return API.put(`/usuarios/${id}`, data);
}

export const eliminarUsuario = async (id) => {
  return API.delete(`/usuarios/${id}`);
}

export const obtenerHistorialCitasUsuario = async (id) => {
  return API.get(`/usuarios/${id}/citas`);
}
