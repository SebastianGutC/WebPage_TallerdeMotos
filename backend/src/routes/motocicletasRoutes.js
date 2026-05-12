import express from 'express';
import {
  obtenerMotocicletas,
  obtenerMotocicletaPorId,
  crearMotocicleta,
  actualizarMotocicleta,
  eliminarMotocicleta,
  obtenerDetallesTecnicos
} from '../controllers/motocicletasController.js';

import { validateToken } from '../middlewares/validateToken.js';
import { isAdmin, isTecnico } from '../middlewares/roles.middleware.js';

const router = express.Router();

//Rutas protegidas (solo ADMIN)
router.get('/', validateToken, obtenerMotocicletas);
router.get('/:id', validateToken, obtenerMotocicletaPorId);
router.post('/', validateToken, isAdmin, crearMotocicleta);
router.put('/:id', validateToken, isAdmin, actualizarMotocicleta);
router.delete('/:id', validateToken, isAdmin, eliminarMotocicleta);

//Ruta protegida para TECNICO
router.get('/:id/detalles-tecnicos', validateToken, isTecnico, obtenerDetallesTecnicos);

export default router;