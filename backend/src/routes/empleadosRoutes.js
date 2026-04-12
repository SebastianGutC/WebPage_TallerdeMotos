import express from 'express';
import {
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado
} from '../controllers/empleadosController.js';
import { verificarToken, soloEmpleado } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Todo protegido — solo empleados pueden ver y gestionar a otros empleados
router.get('/', verificarToken, soloEmpleado, obtenerEmpleados);
router.get('/:id', verificarToken, soloEmpleado, obtenerEmpleadoPorId);
router.put('/:id', verificarToken, soloEmpleado, actualizarEmpleado);
router.delete('/:id', verificarToken, soloEmpleado, eliminarEmpleado);

export default router;