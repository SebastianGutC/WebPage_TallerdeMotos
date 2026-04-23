// src/controllers/citasController.js

import mongoose from "mongoose";
import Cita from "../models/citaModel.js";
import Producto from "../models/productoModel.js";
import Servicio from "../models/servicioModel.js";

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const populateCita = (query) =>
  query
    .populate("tecnicoId", "nombre apellido email telefono rol")
    .populate("usuarioId", "nombre apellido email telefono rol")
    .populate("motocicletaId");

const descontarStockProductos = async (cita) => {
  for (const item of cita.productos) {
    const producto = await Producto.findOne({ nombre: item.nombre });

    if (!producto) {
      throw new Error(`Producto no encontrado: ${item.nombre}`);
    }

    if (producto.stock < item.cantidad) {
      throw new Error(`Stock insuficiente para ${item.nombre}`);
    }

    producto.stock -= item.cantidad;
    await producto.save();
  }
};

// GET ALL CITAS
export const obtenerCitas = async (req, res) => {
  try {
    const citas = await populateCita(Cita.find()).sort({ fecha: -1 });
    res.status(200).json(citas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

// GET CITA BY ID
export const obtenerCitaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ message: "Id inválido" });
    }

    const cita = await populateCita(Cita.findById(id));

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json(cita);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener cita" });
  }
};

// CREATE
export const crearCita = async (req, res) => {
  try {
    const {
      fecha,
      hora,
      tecnicoId,
      usuarioId,
      placaMoto,
      motocicletaId,
      servicios,
      productos,
      fechaEntrega,
      estado
    } = req.body;

    if (!fecha || !hora || !tecnicoId) {
      return res.status(400).json({
        message: "Fecha, hora y técnico son requeridos"
      });
    }

    const nuevaCita = new Cita({
      fecha,
      hora,
      tecnicoId,
      usuarioId,
      placaMoto,
      motocicletaId,
      servicios: servicios || [],
      productos: productos || [],
      fechaEntrega,
      estado: "disponible"
    });

    await nuevaCita.save();

    const cita = await populateCita(Cita.findById(nuevaCita._id));

    res.status(201).json({
      message: "Cita creada exitosamente",
      cita
    });

  } catch (error) {
    res.status(500).json({ message: "Error al crear cita" });
  }
};

// UPDATE GENERAL
export const actualizarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await populateCita(
      Cita.findByIdAndUpdate(id, req.body, { new: true })
    );

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({
      message: "Cita actualizada correctamente",
      cita
    });

  } catch (error) {
    res.status(500).json({ message: "Error al actualizar cita" });
  }
};

// DELETE
export const eliminarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findByIdAndDelete(id);

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json({
      message: "Cita eliminada correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar cita" });
  }
};

// USUARIO
export const getCitasByUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const esAdmin = req.user.rol === "ADMIN";
    const esMismoUsuario = req.user._id.toString() === usuarioId;

    if (!esAdmin && !esMismoUsuario) {
      return res.status(403).json({ message: "No autorizado" });
    }

    const citas = await populateCita(
      Cita.find({ usuarioId })
    ).sort({ fecha: -1 });

    res.status(200).json(citas);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

export const cancelarCita = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await Cita.findById(id);

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    const esAdmin = req.user.rol === "ADMIN";
    const esDueño = cita.usuarioId?.toString() === req.user._id.toString();

    if (!esAdmin && !esDueño) {
      return res.status(403).json({ message: "No autorizado" });
    }

    cita.estado = "cancelada";
    await cita.save();

    res.status(200).json({
      message: "Cita cancelada correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: "Error al cancelar cita" });
  }
};

// ADMIN
export const asignarTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const { tecnicoId } = req.body;

    const cita = await Cita.findByIdAndUpdate(
      id,
      { tecnicoId },
      { new: true }
    );

    res.status(200).json({
      message: "Técnico asignado correctamente",
      cita
    });

  } catch (error) {
    res.status(500).json({ message: "Error al asignar técnico" });
  }
};

export const cambiarEstadoCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const cita = await Cita.findById(id);

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    const estadoAnterior = cita.estado;

    if (estadoAnterior !== "lista" && estado === "lista") {
      await descontarStockProductos(cita);
    }

    cita.estado = estado;
    await cita.save();

    res.status(200).json({
      message: "Estado actualizado correctamente",
      cita
    });

  } catch (error) {
    res.status(400).json({
      message: error.message || "Error al cambiar estado"
    });
  }
};

export const getCitasPorEstado = async (req, res) => {
  try {
    const { estado } = req.params;

    const citas = await populateCita(
      Cita.find({ estado })
    );

    res.status(200).json(citas);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

export const getCitasPorFecha = async (req, res) => {
  try {
    const { fecha } = req.query;

    const inicio = new Date(fecha);
    const fin = new Date(fecha);
    fin.setDate(fin.getDate() + 1);

    const citas = await populateCita(
      Cita.find({
        fecha: { $gte: inicio, $lt: fin }
      })
    );

    res.status(200).json(citas);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas" });
  }
};

// TECNICO
export const getCitasAsignadas = async (req, res) => {
  try {
    const tecnicoId = req.user._id;

    const citas = await populateCita(
      Cita.find({ tecnicoId })
    );

    res.status(200).json(citas);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener citas asignadas" });
  }
};

export const getDetalleCitaTecnico = async (req, res) => {
  try {
    const { id } = req.params;

    const cita = await populateCita(Cita.findById(id));

    if (!cita) {
      return res.status(404).json({ message: "Cita no encontrada" });
    }

    res.status(200).json(cita);

  } catch (error) {
    res.status(500).json({ message: "Error al obtener detalle" });
  }
};

// SERVICIOS
export const addServicioToCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { servicioId } = req.body;

    const servicio = await Servicio.findById(servicioId);

    if (!servicio) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }

    const cita = await Cita.findById(id);

    cita.servicios.push({
      nombre: servicio.nombre,
      costo: servicio.precio
    });

    await cita.save();

    res.status(200).json({
      message: "Servicio agregado correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: "Error al agregar servicio" });
  }
};

export const removeServicioFromCita = async (req, res) => {
  try {
    const { id, index } = req.params;

    const cita = await Cita.findById(id);

    cita.servicios.splice(index, 1);

    await cita.save();

    res.status(200).json({
      message: "Servicio eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar servicio" });
  }
};

// PRODUCTOS
export const addProductoToCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { productoId, cantidad } = req.body;

    const producto = await Producto.findById(productoId);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const cita = await Cita.findById(id);

    cita.productos.push({
      nombre: producto.nombre,
      cantidad,
      costo: producto.precio
    });

    await cita.save();

    res.status(200).json({
      message: "Producto agregado correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: "Error al agregar producto" });
  }
};

export const removeProductoFromCita = async (req, res) => {
  try {
    const { id, index } = req.params;

    const cita = await Cita.findById(id);

    cita.productos.splice(index, 1);

    await cita.save();

    res.status(200).json({
      message: "Producto eliminado correctamente"
    });

  } catch (error) {
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};