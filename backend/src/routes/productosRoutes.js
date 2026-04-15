import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from '../controllers/productosController.js';

import { validateToken } from '../middlewares/validateToken.js';
import { isAdminOrTecnico } from '../middlewares/roles.middleware.js';

const router = express.Router();

//Rutas públicas
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

//Rutas protegidas (ADMIN o TECNICO)
router.post('/', validateToken, isAdminOrTecnico, crearProducto);
router.put('/:id', validateToken, isAdminOrTecnico, actualizarProducto);
router.delete('/:id', validateToken, isAdminOrTecnico, eliminarProducto);

export default router;