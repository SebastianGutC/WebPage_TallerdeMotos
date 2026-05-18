import Motocicleta from "../models/motocicletaModel.js";
import axios from "axios";

export const guardarMotocicleta = async (req, res) => {
  try {
    const {
      make, model, year, type,
      displacement, engine,
      front_brakes, rear_brakes,
      fuel_system, transmission,
    } = req.body;

    if (!make || !model || !year) {
      return res.status(400).json({ message: "Marca, modelo y año son obligatorios." });
    }

    const existe = await Motocicleta.findOne({
      marca:  make,
      nombre: model,
      modelo: String(year),
    });

    if (existe) return res.json({ _id: existe._id });

    const nueva = new Motocicleta({
      marca:  make  || "No especificado",
      nombre: model || "No especificado",
      tipo:   type,
      modelo: year,
      detalles: {
        cilindraje:       parseFloat(displacement) || 0,
        tipo_motor:       engine,
        sistema_frenos:   `delantero: ${front_brakes || "No especificado"} || trasero: ${rear_brakes || "No especificado"}`,
        tipo_combustible: fuel_system,
        tipo_transmision: transmission,
      },
    });

    await nueva.save();
    res.json({ _id: nueva._id });

  } catch (error) {
    console.error("ERROR guardando moto:", error.message);
    res.status(500).json({
      message: "Error al guardar motocicleta.",
      detalle: error.message,
    });
  }
};

export const getAllMotocicletas = async (req, res) => {
  try {
    const motos = await Motocicleta.find().sort({ marca: 1, nombre: 1 });
    res.json(motos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener motocicletas." });
  }
};
// GET ALL MOTOCICLETAS
export const obtenerMotocicletas = async (req, res) => {
  try {
    const motocicletas = await Motocicleta.find();
    res.json(motocicletas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener motocicletas", error: error.message });
  }
};

// GET MOTOCICLETA BY ID
export const obtenerMotocicletaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const motocicleta = await Motocicleta.findById(id);
    if (!motocicleta) {
      return res.status(404).json({ message: "Motocicleta no encontrada" });
    }
    res.json(motocicleta);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener motocicleta", error: error.message });
  }
};

// CREATE MOTOCICLETA
export const crearMotocicleta = async (req, res) => {
  try {
    const { marca, nombre, tipo, modelo, detalles } = req.body;

    if (!marca || !nombre || !tipo || !modelo || !detalles) {
      return res
        .status(400)
        .json({ message: "Todos los campos son requeridos" });
    }

    const nuevaMotocicleta = new Motocicleta({
      marca,
      nombre,
      tipo,
      modelo,
      detalles,
    });

    await nuevaMotocicleta.save();
    res.status(201).json({
      message: "Motocicleta creada exitosamente",
      motocicleta: nuevaMotocicleta,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear motocicleta", error: error.message });
  }
};

// UPDATE MOTOCICLETA
export const actualizarMotocicleta = async (req, res) => {
  try {
    const { id } = req.params;
    const { marca, nombre, tipo, modelo, detalles } = req.body;

    const motocicletaActualizada = await Motocicleta.findByIdAndUpdate(
      id,
      { marca, nombre, tipo, modelo, detalles },
      { new: true },
    );

    if (!motocicletaActualizada) {
      return res.status(404).json({ message: "Motocicleta no encontrada" });
    }

    res.json({
      message: "Motocicleta actualizada exitosamente",
      motocicleta: motocicletaActualizada,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar motocicleta",
      error: error.message,
    });
  }
};

// DELETE MOTOCICLETA
export const eliminarMotocicleta = async (req, res) => {
  try {
    const { id } = req.params;
    const motocicletaBorrada = await Motocicleta.findByIdAndDelete(id);

    if (!motocicletaBorrada) {
      return res.status(404).json({ message: "Motocicleta no encontrada" });
    }

    res.json({ message: "Motocicleta eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar motocicleta", error: error.message });
  }
};

// GET DETALLES TECNICOS (solo TECNICO)
export const obtenerDetallesTecnicos = async (req, res) => {
  try {
    const { id } = req.params;
    const motocicleta = await Motocicleta.findById(
      id,
      "marca nombre tipo modelo detalles",
    );

    if (!motocicleta) {
      return res.status(404).json({ message: "Motocicleta no encontrada" });
    }

    res.json({
      marca: motocicleta.marca,
      nombre: motocicleta.nombre,
      tipo: motocicleta.tipo,
      modelo: motocicleta.modelo,
      detalles: motocicleta.detalles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener detalles técnicos",
      error: error.message,
    });
  }
};

