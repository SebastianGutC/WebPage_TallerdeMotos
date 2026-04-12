import Servicio from '../models/servicioModel.js';

// GET ALL SERVICIOS
export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servicios', error: error.message });
  }
};

// GET SERVICIO BY ID
export const obtenerServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }
    res.json(servicio);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener servicio', error: error.message });
  }
};

// CREATE SERVICIO
export const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion, precio, icono } = req.body;

    if (!nombre || !descripcion || !precio || !icono) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoServicio = new Servicio({
      nombre,
      descripcion,
      precio,
      icono
    });

    await nuevoServicio.save();
    res.status(201).json({ message: 'Servicio creado exitosamente', servicio: nuevoServicio });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear servicio', error: error.message });
  }
};

// UPDATE SERVICIO
export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, icono } = req.body;

    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      { nombre, descripcion, precio, icono },
      { new: true }
    );

    if (!servicioActualizado) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.json({ message: 'Servicio actualizado exitosamente', servicio: servicioActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar servicio', error: error.message });
  }
};

// DELETE SERVICIO
export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const servicioBorrado = await Servicio.findByIdAndDelete(id);

    if (!servicioBorrado) {
      return res.status(404).json({ message: 'Servicio no encontrado' });
    }

    res.json({ message: 'Servicio eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar servicio', error: error.message });
  }
};
