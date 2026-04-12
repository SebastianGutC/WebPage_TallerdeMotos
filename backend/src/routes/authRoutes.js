import express from 'express';
import { registerUsuario, loginUsuario, registerEmpleado, loginEmpleado } from '../controllers/authController.js';

const router = express.Router();

// Rutas públicas
router.post('/usuarios/register', registerUsuario);
router.post('/usuarios/login', loginUsuario);
router.post('/empleados/register', registerEmpleado);
router.post('/empleados/login', loginEmpleado);

export default router;
