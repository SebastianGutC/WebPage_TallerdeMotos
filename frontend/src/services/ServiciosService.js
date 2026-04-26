import API from './Api';

export const getServicios = () => {
  return API.get('/servicios');
};

export const getServicioById = (id) => {
  return API.get(`/servicios/${id}`);
};

export const crearServicio = (data) => {
    return API.post('/servicios', data);
};

export const actualizarServicio = (id, data) => {
    return API.put(`/servicios/${id}`, data);
};

export const eliminarServicio = (id) => {
    return API.delete(`/servicios/${id}`);
}