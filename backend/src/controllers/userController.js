// src/controllers/userController.js

import Usuario from "../models/userModel.js";
import Cita from "../models/citaModel.js";
import bcryptjs from "bcryptjs";

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .select("-contraseña")
      .sort({ createdAt: -1 });

    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id).select("-contraseña");

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const esAdmin = req.user.rol === "ADMIN";
    const esMismoUsuario = req.user._id.toString() === id;

    if (!esAdmin && !esMismoUsuario) {
      return res.status(403).json({ message: "No autorizado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuario" });
  }
};

export const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const esAdmin = req.user.rol === "ADMIN";
    const esMismoUsuario = req.user._id.toString() === id;

    if (!esAdmin && !esMismoUsuario) {
      return res.status(403).json({ message: "No autorizado" });
    }

    // ADMIN solo puede cambiar habilitado
    if (esAdmin && !esMismoUsuario) {
      usuario.habilitado = req.body.habilitado;
      await usuario.save();

      return res.status(200).json({
        message: "Estado actualizado correctamente"
      });
    }

    // Usuario normal actualiza sus propios datos
    const camposPermitidos = [
      "nombre",
      "apellido",
      "telefono",
      "email"
    ];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        usuario[campo] = req.body[campo];
      }
    });

    await usuario.save();

    res.status(200).json({
      message: "Usuario actualizado correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

export const eliminarUsuarios = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndDelete(id);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

export const obtenerHistorialCitasUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const esAdmin = req.user.rol === "ADMIN";
    const esMismoUsuario = req.user._id.toString() === id;

    if (!esAdmin && !esMismoUsuario) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const citas = await Cita.find({ usuarioId: id })
      .populate("tecnicoId", "nombre apellido email telefono rol")
      .populate("motocicletaId")
      .sort({ fecha: -1, hora: -1 });

    res.status(200).json(citas);

  } catch (error) {
    res.status(500).json({
      message: "Error al obtener historial de citas"
    });
  }
};

export const cambiarRolUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body;

    if (!["USUARIO", "TECNICO"].includes(rol)) {
      return res.status(400).json({
        message: "Solo se permite USUARIO o TECNICO"
      });
    }

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    usuario.rol = rol;
    await usuario.save();

    res.status(200).json({
      message: "Rol actualizado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al cambiar rol"
    });
  }
};

export const crearTecnico = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      contraseña,
      telefono
    } = req.body;

    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.status(400).json({
        message: "Ya existe un usuario con ese email"
      });
    }

    const hashedPassword = await bcryptjs.hash(contraseña, 10);

    const nuevoTecnico = new Usuario({
      nombre,
      apellido,
      email,
      contraseña: hashedPassword,
      telefono,
      rol: "TECNICO"
    });

    await nuevoTecnico.save();

    res.status(201).json({
      message: "Técnico creado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al crear técnico"
    });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      contraseñaActual,
      nuevaContraseña
    } = req.body;

    const usuario = await Usuario.findById(userId);

    if (!usuario) {
      return res.status(404).json({
        message: "Usuario no encontrado"
      });
    }

    const coincide = await bcryptjs.compare(
      contraseñaActual,
      usuario.contraseña
    );

    if (!coincide) {
      return res.status(400).json({
        message: "Contraseña actual incorrecta"
      });
    }

    const nuevaHash = await bcryptjs.hash(
      nuevaContraseña,
      10
    );

    usuario.contraseña = nuevaHash;

    await usuario.save();

    res.status(200).json({
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error al cambiar contraseña"
    });
  }
};