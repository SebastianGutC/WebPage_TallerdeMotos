import Producto from '../models/productoModel.js';

// GET ALL PRODUCTOS
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// GET PRODUCTO BY ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

// CREATE PRODUCTO
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, img64, marca, categoria } = req.body;

    if (!nombre || !descripcion || !precio || stock === undefined || !marca || !categoria) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      stock,
      img64,
      marca,
      categoria
    });

    await nuevoProducto.save();
    res.status(201).json({ message: 'Producto creado exitosamente', producto: nuevoProducto });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

// UPDATE PRODUCTO
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, img64, marca, categoria } = req.body;

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      { nombre, descripcion, precio, stock, img64, marca, categoria },
      { new: true }
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado exitosamente', producto: productoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// DELETE PRODUCTO
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const productoBorrado = await Producto.findByIdAndDelete(id);

    if (!productoBorrado) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};
