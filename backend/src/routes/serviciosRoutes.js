import express from 'express';
import {
  obtenerServicios,
  obtenerServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio
} from '../controllers/serviciosController.js';

import { validateToken } from '../middlewares/validateToken.js';
import { isAdminOrTecnico } from '../middlewares/roles.middleware.js';

const router = express.Router();


router.get('/', obtenerServicios);
router.get('/:id', obtenerServicioPorId);

//Rutas protegidas (ADMIN o TECNICO)
router.post('/', validateToken, isAdminOrTecnico, crearServicio);
router.put('/:id', validateToken, isAdminOrTecnico, actualizarServicio);
router.delete('/:id', validateToken, isAdminOrTecnico, eliminarServicio);

export default router;