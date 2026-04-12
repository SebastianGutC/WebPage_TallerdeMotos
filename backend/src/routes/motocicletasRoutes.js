import express from 'express';
import {
  obtenerMotocicletas,
  obtenerMotocicletaPorId,
  crearMotocicleta,
  actualizarMotocicleta,
  eliminarMotocicleta
} from '../controllers/motocicletasController.js';
import { verificarToken, soloEmpleado } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', obtenerMotocicletas);                                       // público
router.get('/:id', obtenerMotocicletaPorId);                                // público
router.post('/', verificarToken, soloEmpleado, crearMotocicleta);           // 🔒 empleados
router.put('/:id', verificarToken, soloEmpleado, actualizarMotocicleta);    // 🔒 empleados
router.delete('/:id', verificarToken, soloEmpleado, eliminarMotocicleta);   // 🔒 empleados

export default router;