import express from 'express';
import {
  obtenerCitas,
  obtenerCitaPorId,
  crearCita,
  actualizarCita,
  eliminarCita
} from '../controllers/citasController.js';

import { validateToken } from '../middlewares/validateToken.js';
import { isAdminOrTecnico } from '../middlewares/roles.middleware.js';

const router = express.Router();


router.get('/', validateToken, isAdminOrTecnico, obtenerCitas);


router.get('/:id', validateToken, obtenerCitaPorId);

router.post('/', validateToken, crearCita);

router.put('/:id', validateToken, isAdminOrTecnico, actualizarCita);
router.delete('/:id', validateToken, isAdminOrTecnico, eliminarCita);

export default router;