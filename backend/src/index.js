import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { connectDB } from './db.js';
import { config } from './config.js';
import { seed } from './scripts/seed.js';

import path from 'path';
import { fileURLToPath } from 'url';
// Importar rutas
import authRoutes from './routes/authRoutes.js';
import productosRoutes from './routes/productosRoutes.js';
import serviciosRoutes from './routes/serviciosRoutes.js';
import citasRoutes from './routes/citasRoutes.js';
import motocicletasRoutes from './routes/motocicletasRoutes.js';
import userRoutes from './routes/userRoutes.js'; 
import facturasRoutes from './routes/facturasRoutes.js';

const backend = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

backend.use(morgan('dev'));

backend.use(cors({
  origin: true,
  credentials: true
}));
backend.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
backend.use(express.json());
backend.use(express.urlencoded({ extended: true })); 

backend.use(cookieParser());

// Conectar BD + seed
await connectDB();
await seed();

backend.use('/api/auth', authRoutes);
backend.use('/api/productos', productosRoutes);
backend.use('/api/servicios', serviciosRoutes);
backend.use('/api/citas', citasRoutes);
backend.use('/api/motocicletas', motocicletasRoutes);
backend.use('/api/usuarios', userRoutes); 

// 🔥 AGREGADO: facturas routes
backend.use('/api/facturas', facturasRoutes);

backend.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'Servidor corriendo correctamente',
    env: config.nodeEnv
  });
});

backend.use((req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada'
  });
});

backend.listen(config.port, () => {
  console.log(
    `Servidor corriendo en puerto ${config.port} - Entorno: ${config.nodeEnv}`
  );
});