import express from 'express';
import { registerUsuario} from '../controllers/authController.js';

const router = express.Router();

// Rutas públicas
router.post('/usuarios/register', registerUsuario);

export default router;
