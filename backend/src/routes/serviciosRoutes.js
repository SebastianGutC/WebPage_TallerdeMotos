import express from 'express';
import {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../controllers/serviciosController.js';

import { validateToken } from '../middlewares/validateToken.js';
import { isAdmin } from '../middlewares/roles.middleware.js';

const router = express.Router();


router.get('/', obtenerServicios);
router.get('/:id', obtenerServicioPorId);

//Rutas protegidas (solo ADMIN)
router.post('/', validateToken, isAdmin, crearServicio);
router.put('/:id', validateToken, isAdmin, actualizarServicio);
router.delete('/:id', validateToken, isAdmin, eliminarServicio);

export default router;