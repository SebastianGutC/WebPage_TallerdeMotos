// USUARIOS - REGISTRO (ocultar contraseña en respuesta)
import Usuario from '../models/userModel.js';
import Empleado from '../models/empleadoModel.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { config } from '../config.js';


export const registerUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, contraseña, telefono } = req.body;

    if (!nombre || !apellido || !email || !contraseña || !telefono) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcryptjs.hash(contraseña, 10);
    const nuevoUsuario = await Usuario.create({
      nombre, apellido, email,
      contraseña: hashedPassword,
      telefono
    });

    // ✅ Excluir contraseña de la respuesta
    const { contraseña: _, ...usuarioSeguro } = nuevoUsuario.toObject();
    res.status(201).json({ message: 'Usuario registrado exitosamente', usuario: usuarioSeguro });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
  }
};

// USUARIOS - LOGIN
export const loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const esValida = await bcryptjs.compare(contraseña, usuario.contraseña);
    if (!esValida) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario._id, role: 'usuario' },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    // ✅ Excluir contraseña de la respuesta
    const { contraseña: _, ...usuarioSeguro } = usuario.toObject();
    res.json({ message: 'Login exitoso', token, usuario: usuarioSeguro });

  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

// EMPLEADOS - REGISTRO
export const registerEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, email, contraseña, rol, telefono, habilitado } = req.body;

    if (!nombre || !apellido || !email || !contraseña || !rol || !telefono) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const empleadoExistente = await Empleado.findOne({ email });
    if (empleadoExistente) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcryptjs.hash(contraseña, 10);
    const nuevoEmpleado = await Empleado.create({
      nombre, apellido, email,
      contraseña: hashedPassword,
      rol, telefono,
      habilitado: habilitado ?? true
    });

    // ✅ Excluir contraseña
    const { contraseña: _, ...empleadoSeguro } = nuevoEmpleado.toObject();
    res.status(201).json({ message: 'Empleado registrado exitosamente', empleado: empleadoSeguro });

  } catch (error) {
    res.status(500).json({ message: 'Error al registrar empleado', error: error.message });
  }
};

// EMPLEADOS - LOGIN
export const loginEmpleado = async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      return res.status(400).json({ message: 'Email y contraseña requeridos' });
    }

    const empleado = await Empleado.findOne({ email });
    if (!empleado) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    if (!empleado.habilitado) {
      return res.status(403).json({ message: 'Empleado deshabilitado' });
    }

    const esValida = await bcryptjs.compare(contraseña, empleado.contraseña);
    if (!esValida) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: empleado._id, role: empleado.rol },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    // ✅ Excluir contraseña
    const { contraseña: _, ...empleadoSeguro } = empleado.toObject();
    res.json({ message: 'Login exitoso', token, empleado: empleadoSeguro });

  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};