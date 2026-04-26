import API from "./Api";

export const getProductos = async () => {
  return API.get("/productos");
};

export const getProductoByName = async (nombre) => {
  return API.get(`/productos/buscar/${nombre}`);
};
export const getProductosByCategoria = async (categoria) => {
  return API.get(`/productos/categoria/${categoria}`);
};

export const getProductoById = async (id) => {
  return API.get(`/productos/${id}`);
};

export const crearProducto = async (data) => {
  return API.post("/productos", data);
};  

export const actualizarProducto = async (id, data) => {
  return API.put(`/productos/${id}`, data);
};

export const eliminarProducto = async (id) => {
  return API.delete(`/productos/${id}`);
};

export const getImagenUrl = (imagen) => {
  if (!imagen) return null;
  return `http://localhost:4001${imagen}`;
};

