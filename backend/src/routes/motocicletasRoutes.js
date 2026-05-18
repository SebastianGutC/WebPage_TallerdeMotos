import express from 'express';
import {
  obtenerMotocicletas,
  obtenerMotocicletaPorId,
  crearMotocicleta,
  actualizarMotocicleta,
  eliminarMotocicleta,
  obtenerDetallesTecnicos, 
  buscarMotocicletas,
  getAllMotocicletas, 
  guardarMotocicleta,
  testAPI
} from '../controllers/motocicletasController.js';

import { validateToken } from '../middlewares/validateToken.js';
import { isAdmin, isTecnico } from '../middlewares/roles.middleware.js';
import axios from 'axios';
const router = express.Router();

router.get('/test-api', testAPI);

router.get('/buscar', buscarMotocicletas); 
router.get('/', validateToken, getAllMotocicletas);
router.post('/guardar', validateToken, guardarMotocicleta);

//Rutas protegidas (solo ADMIN)
router.get('/:id', validateToken, obtenerMotocicletaPorId);
router.post('/', validateToken, isAdmin, crearMotocicleta);
router.put('/:id', validateToken, isAdmin, actualizarMotocicleta);
router.delete('/:id', validateToken, isAdmin, eliminarMotocicleta);

//Ruta protegida para TECNICO
router.get('/:id/detalles-tecnicos', validateToken, isTecnico, obtenerDetallesTecnicos);

export default router;