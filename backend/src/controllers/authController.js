import Usuario from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const registerUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, contraseña, telefono } = req.body;


    const userExists = await Usuario.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcryptjs.hash(contraseña, 10);


    const newUser = new Usuario({
      nombre,
      apellido,
      email,
      contraseña: hashedPassword,
      telefono,
      rol: "USUARIO"
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        rol: newUser.rol
      },
      config.jwtSecret,
      { expiresIn: "1d" }
    );

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
    res.status(500).json({ message: "Error al registrarse" });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, contraseña } = req.body;


    if (!email || !contraseña) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }


    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }


    if (!user.habilitado) {
      return res.status(403).json({ message: "Usuario deshabilitado" });
    }


    const isMatch = await bcryptjs.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }


    const token = jwt.sign(
      {
        id: user._id,
        rol: user.rol
      },
      config.jwtSecret,
      { expiresIn: "1d" }
    );


    res.cookie("token", token, {
      httpOnly: true,        // no accesible desde JS (más seguro)
      secure: false,        // true en producción con HTTPS
      sameSite: "lax",      // protege contra CSRF básico
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en login" });
  }
};

export const logoutUsuario = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,   
      sameSite: "lax"
    });

    return res.status(200).json({
      message: "Logout exitoso"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error en logout"
    });
  }
};