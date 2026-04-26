import API from './Api';

export const generarFacturaDesdeCita = async (citaId) => {
  return API.get(`/facturas/cita/${citaId}`);     
}

export const getFacturasByUsuario = async (usuarioId) => {
  return API.get(`/facturas/usuario/${usuarioId}`);     
}

export const getFacturas = async () => {
  return API.get(`/facturas`);     
}
