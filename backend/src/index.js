import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './db.js';
import { config } from './config.js';
import { seed } from './scripts/seed.js';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import serviciosRoutes from './routes/serviciosRoutes.js';
import citasRoutes from './routes/citasRoutes.js';
import motocicletasRoutes from './routes/motocicletasRoutes.js';

const backend = express();

// Middleware base
backend.use(morgan('dev'));
backend.use(cors({
  origin: true,
  credentials: true
}));
backend.use(express.json());

// 🔥 NECESARIO PARA COOKIES
backend.use(cookieParser());

// Conectar BD + seed (solo una vez)
await connectDB();
await seed();

// Rutas
backend.use('/api/auth', authRoutes);
backend.use('/api/productos', productosRoutes);
backend.use('/api/servicios', serviciosRoutes);
backend.use('/api/citas', citasRoutes);
backend.use('/api/motocicletas', motocicletasRoutes);

// Health check
backend.get('/api/health', (req, res) => {
  res.json({
    message: 'Servidor corriendo correctamente',
    env: config.nodeEnv
  });
});

backend.listen(config.port);
console.log(`Servidor corriendo en puerto ${config.port} - Entorno: ${config.nodeEnv}`);