import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js';
import { verificarToken, soloEmpleado } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', obtenerProductos);                                          // público
router.get('/:id', obtenerProductoPorId);                                   // público
router.post('/', verificarToken, soloEmpleado, crearProducto);              // 🔒 empleados
router.put('/:id', verificarToken, soloEmpleado, actualizarProducto);       // 🔒 empleados
router.delete('/:id', verificarToken, soloEmpleado, eliminarProducto);      // 🔒 empleados

export default router;
