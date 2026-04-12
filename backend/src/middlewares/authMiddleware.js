import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export const soloEmpleado = (req, res, next) => {
  if (!req.user?.role || req.user.role === 'usuario') {
    return res.status(403).json({ message: 'Acceso solo para empleados' });
  }
  next();
};

export const soloAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso solo para administradores' });
  }
  next();
};