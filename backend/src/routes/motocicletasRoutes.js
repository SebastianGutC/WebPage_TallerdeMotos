import express from 'express';
import {
  obtenerMotocicletas,
  obtenerMotocicletaPorId,
  crearMotocicleta,
  actualizarMotocicleta,
  eliminarMotocicleta
} from '../controllers/motocicletasController.js';

import { validateToken } from '../middlewares/validateToken.js';
import { isAdminOrTecnico } from '../middlewares/roles.middleware.js';

const router = express.Router();

//Rutas públicas
router.get('/', obtenerMotocicletas);
router.get('/:id', obtenerMotocicletaPorId);

//Rutas protegidas (ADMIN o TECNICO)
router.post('/', validateToken, isAdminOrTecnico, crearMotocicleta);
router.put('/:id', validateToken, isAdminOrTecnico, actualizarMotocicleta);
router.delete('/:id', validateToken, isAdminOrTecnico, eliminarMotocicleta);

export default router;