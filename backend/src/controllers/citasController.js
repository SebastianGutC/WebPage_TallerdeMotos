import Cita from '../models/citaModel.js';

// GET ALL CITAS
export const obtenerCitas = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate('tecnicoId')
      .populate('usuarioId')
      .populate('motocicletaId');
    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener citas', error: error.message });
  }
};

// GET CITA BY ID
export const obtenerCitaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const cita = await Cita.findById(id)
      .populate('tecnicoId')
      .populate('usuarioId')
      .populate('motocicletaId');
    if (!cita) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }
    res.json(cita);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cita', error: error.message });
  }
};

// CREATE CITA
export const crearCita = async (req, res) => {
  try {
    const { fecha, hora, tecnicoId, usuarioId, placaMoto, motocicletaId, servicios, productos, fechaEntrega } = req.body;

    if (!fecha || !hora || !tecnicoId) {
      return res.status(400).json({ message: 'Fecha, hora y técnico son requeridos' });
    }

    const nuevaCita = new Cita({
      fecha,
      hora,
      tecnicoId,
      usuarioId,
      placaMoto,
      motocicletaId,
      servicios: servicios || [],
      productos: productos || [],
      fechaEntrega
    });

    await nuevaCita.save();
    await nuevaCita.populate(['tecnicoId', 'usuarioId', 'motocicletaId']);
    res.status(201).json({ message: 'Cita creada exitosamente', cita: nuevaCita });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cita', error: error.message });
  }
};

// UPDATE CITA
export const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, tecnicoId, usuarioId, placaMoto, motocicletaId, servicios, productos, fechaEntrega } = req.body;

    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      { fecha, hora, tecnicoId, usuarioId, placaMoto, motocicletaId, servicios, productos, fechaEntrega },
      { new: true }
    ).populate(['tecnicoId', 'usuarioId', 'motocicletaId']);

    if (!citaActualizada) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.json({ message: 'Cita actualizada exitosamente', cita: citaActualizada });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cita', error: error.message });
  }
};

// DELETE CITA
export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const citaBorrada = await Cita.findByIdAndDelete(id);

    if (!citaBorrada) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    res.json({ message: 'Cita eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cita', error: error.message });
  }
};
