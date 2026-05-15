import dotenv from 'dotenv';

const result = dotenv.config();

export const config = {
  port: process.env.PORT || 4001,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/taller_motos',
  jwtSecret: process.env.JWT_SECRET || 'tu_secreto_super_seguro_2026',
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiKey: process.env.GEMINI_API_KEY,
};
