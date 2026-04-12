import express from 'express';
import {
  obtenerCitas,
  obtenerCitaPorId,
  crearCita,
  actualizarCita,
  eliminarCita
} from '../controllers/citasController.js';
import { verificarToken, soloEmpleado } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verificarToken, soloEmpleado, obtenerCitas);         // 🔒 empleados ven todas
router.get('/:id', verificarToken, obtenerCitaPorId);                // 🔒 cualquier logueado
router.post('/', verificarToken, crearCita);                         // 🔒 cualquier logueado (usuario agenda)
router.put('/:id', verificarToken, soloEmpleado, actualizarCita);    // 🔒 empleados
router.delete('/:id', verificarToken, soloEmpleado, eliminarCita);   // 🔒 empleados

export default router;