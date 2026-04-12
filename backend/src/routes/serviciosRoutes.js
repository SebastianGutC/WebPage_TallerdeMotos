import express from 'express';
import {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../controllers/serviciosController.js';
import { verificarToken, soloEmpleado } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', obtenerServicios);                                          // público
router.get('/:id', obtenerServicioPorId);                                   // público
router.post('/', verificarToken, soloEmpleado, crearServicio);              // 🔒 empleados
router.put('/:id', verificarToken, soloEmpleado, actualizarServicio);       // 🔒 empleados
router.delete('/:id', verificarToken, soloEmpleado, eliminarServicio);      // 🔒 empleados

export default router;