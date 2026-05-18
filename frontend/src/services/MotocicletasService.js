import API from "./Api";

export const obtenerMotocicletas = async () => {
  return API.get("/motocicletas");
}

export const obtenerMotocicletaPorId = async (id) => {
  return API.get(`/motocicletas/${id}`);
}

export const crearMotocicleta = async (data) => {
  return API.post("/motocicletas", data);
}

export const actualizarMotocicleta = async (id, data) => {
  return API.put(`/motocicletas/${id}`, data);
}

export const eliminarMotocicleta = async (id) => {
  return API.delete(`/motocicletas/${id}`);
}

export const obtenerDetallesTecnicos = async (id) => {
  return API.get(`/motocicletas/${id}/detalles-tecnicos`);
}

export const buscarMotocicleta = (make, model, year) =>{
   return API.get("/motocicletas/buscar", {
    params: { make, model, year },
  });
}


export const guardarMotocicletaSeleccionada = (data) =>{
  return API.post("/motocicletas/guardar", data);
}
