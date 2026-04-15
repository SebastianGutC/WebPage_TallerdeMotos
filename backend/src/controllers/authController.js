import Usuario from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const registerUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, contraseña, telefono } = req.body;

    // 🔥 validar si ya existe
    const userExists = await Usuario.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // 🔥 hash contraseña
    const hashedPassword = await bcryptjs.hash(contraseña, 10);

    // 🔥 crear usuario (rol automático)
    const newUser = new Usuario({
      nombre,
      apellido,
      email,
      contraseña: hashedPassword,
      telefono,
      rol: "USUARIO"
    });

    await newUser.save();

    // 🔥 generar JWT
    const token = jwt.sign(
      {
        id: newUser._id,
        rol: newUser.rol
      },
      config.jwtSecret,
      { expiresIn: "1d" }
    );

    // 🔥 respuesta segura
    res.status(201).json({
      message: "Usuario registrado correctamente",
      token,
      user: {
        id: newUser._id,
        nombre: newUser.nombre,
        email: newUser.email,
        rol: newUser.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en register" });
  }
};