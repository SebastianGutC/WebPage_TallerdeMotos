import express from 'express';
import { registerUsuario, loginUsuario, logoutUsuario} from '../controllers/authController.js';

const router = express.Router();

// Rutas públicas
router.post('/usuarios/register', registerUsuario);
router.post('/usuarios/login', loginUsuario);
router.post('/usuarios/logout', logoutUsuario);

export default router;
