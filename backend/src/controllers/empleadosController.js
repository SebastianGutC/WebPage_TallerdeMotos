import Empleado from '../models/empleadoModel.js';

// GET ALL EMPLEADOS
export const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find().select('-contraseña');
    res.json(empleados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleados', error: error.message });
  }
};

// GET EMPLEADO BY ID
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const empleado = await Empleado.findById(id).select('-contraseña');
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empleado', error: error.message });
  }
};

// UPDATE EMPLEADO
export const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol, telefono, habilitado } = req.body;

    const empleadoActualizado = await Empleado.findByIdAndUpdate(
      id,
      { nombre, apellido, email, rol, telefono, habilitado },
      { new: true }
    ).select('-contraseña');

    if (!empleadoActualizado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado actualizado exitosamente', empleado: empleadoActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar empleado', error: error.message });
  }
};

// DELETE EMPLEADO
export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const empleadoBorrado = await Empleado.findByIdAndDelete(id);

    if (!empleadoBorrado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar empleado', error: error.message });
  }
};
