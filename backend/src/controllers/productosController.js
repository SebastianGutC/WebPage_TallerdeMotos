import Producto from "../models/productoModel.js";

// GET ALL PRODUCTOS
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find().sort({ nombre: 1 });

    res.status(200).json(productos);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos"
    });
  }
};

// GET PRODUCTO BY ID
export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.status(200).json(producto);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener producto"
    });
  }
};

// GET PRODUCTO BY NAME
export const obtenerProductoPorNombre = async (req, res) => {
  try {
    const { nombre } = req.query;

    if (!nombre) {
      return res.status(400).json({
        message: "Debe enviar el nombre del producto"
      });
    }

    const productos = await Producto.find({
      nombre: { $regex: nombre, $options: "i" }
    }).sort({ nombre: 1 });

    res.status(200).json(productos);

  } catch (error) {
    res.status(500).json({
      message: "Error al buscar producto"
    });
  }
};

// GET PRODUCTOS BY CATEGORIA
export const obtenerProductosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;

    const productos = await Producto.find({
      categoria: { $regex: `^${categoria}$`, $options: "i" }
    }).sort({ nombre: 1 });

    res.status(200).json(productos);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener productos por categoría"
    });
  }
};

// CREATE PRODUCTO
export const crearProducto = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      stock,
      img64,
      marca,
      categoria
    } = req.body;

    if (
      !nombre ||
      !descripcion ||
      precio === undefined ||
      stock === undefined ||
      !marca ||
      !categoria
    ) {
      return res.status(400).json({
        message: "Todos los campos requeridos deben ser enviados"
      });
    }

    const productoExiste = await Producto.findOne({ nombre });

    if (productoExiste) {
      return res.status(400).json({
        message: "Ya existe un producto con ese nombre"
      });
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

    res.status(201).json({
      message: "Producto creado correctamente",
      producto: nuevoProducto
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear producto"
    });
  }
};

// UPDATE PRODUCTO
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    const camposPermitidos = [
      "nombre",
      "descripcion",
      "precio",
      "stock",
      "img64",
      "marca",
      "categoria"
    ];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        producto[campo] = req.body[campo];
      }
    });

    await producto.save();

    res.status(200).json({
      message: "Producto actualizado correctamente",
      producto
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar producto"
    });
  }
};

// DELETE PRODUCTO
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findByIdAndDelete(id);

    if (!producto) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }

    res.status(200).json({
      message: "Producto eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar producto"
    });
  }
};