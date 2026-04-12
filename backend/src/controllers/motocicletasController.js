import Motocicleta from '../models/motocicletaModel.js';

// GET ALL MOTOCICLETAS
export const obtenerMotocicletas = async (req, res) => {
  try {
    const motocicletas = await Motocicleta.find();
    res.json(motocicletas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener motocicletas', error: error.message });
  }
};

// GET MOTOCICLETA BY ID
export const obtenerMotocicletaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const motocicleta = await Motocicleta.findById(id);
    if (!motocicleta) {
      return res.status(404).json({ message: 'Motocicleta no encontrada' });
    }
    res.json(motocicleta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener motocicleta', error: error.message });
  }
};

// CREATE MOTOCICLETA
export const crearMotocicleta = async (req, res) => {
  try {
    const { marca, nombre, tipo, modelo, detalles } = req.body;

    if (!marca || !nombre || !tipo || !modelo || !detalles) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevaMotocicleta = new Motocicleta({
      marca,
      nombre,
      tipo,
      modelo,
      detalles
    });

    await nuevaMotocicleta.save();
    res.status(201).json({ message: 'Motocicleta creada exitosamente', motocicleta: nuevaMotocicleta });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear motocicleta', error: error.message });
  }
};

// UPDATE MOTOCICLETA
export const actualizarMotocicleta = async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, nombre, tipo, modelo, detalles } = req.body;

    const motocicletaActualizada = await Motocicleta.findByIdAndUpdate(
      id,
      { marca, nombre, tipo, modelo, detalles },
      { new: true }
    );

    if (!motocicletaActualizada) {
      return res.status(404).json({ message: 'Motocicleta no encontrada' });
    }

    res.json({ message: 'Motocicleta actualizada exitosamente', motocicleta: motocicletaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar motocicleta', error: error.message });
  }
};

// DELETE MOTOCICLETA
export const eliminarMotocicleta = async (req, res) => {
  try {
    const { id } = req.params;
    const motocicletaBorrada = await Motocicleta.findByIdAndDelete(id);

    if (!motocicletaBorrada) {
      return res.status(404).json({ message: 'Motocicleta no encontrada' });
    }

    res.json({ message: 'Motocicleta eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar motocicleta', error: error.message });
  }
};
