import Motocicleta from "../models/motocicletaModel.js";
import axios from "axios";
import {
  traducirTipo,
  traducirMotor,
  traducirFrenos,
  traducirCombustible,
  traducirTransmision,
} from "../utils/motoTranslations.js";

export const testAPI = async (req, res) => {
  try {
    // Probar diferentes formas del nombre
    const pruebas = ["XTZ", "XTZ150", "XTZ 150", "XTZ-150"];
    const resultados = {};

    for (const modelo of pruebas) {
      const { data } = await axios.get(
        "https://api.api-ninjas.com/v1/motorcycles",
        {
          params: { make: "yamaha", model: modelo },
          headers: { "X-Api-Key": process.env.API_NINJAS_KEY },
        }
      );
      resultados[modelo] = data.map(m => ({ make: m.make, model: m.model, year: m.year }));
    }

    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const buscarMotocicletas = async (req, res) => {
  let { make, model } = req.query;

  const normalizar = (str) => {
    if (!str) return "";
    return str.trim().replace(/\s+/g, "").replace(/-/g, "").toLowerCase();
  };

  const makeNorm  = make?.trim() || "";
  const modelNorm = normalizar(model);

  try {
    const variantes = [
      model?.trim(),
      modelNorm,
      model?.trim().replace(/(\D+)(\d+)/, "$1 $2"),
      model?.trim().replace(/\s+/g, "-"),
    ].filter(Boolean);

    const variantesUnicas = [...new Set(variantes)];
    let dataAPI = [];

    for (const variante of variantesUnicas) {
      const respuesta = await axios.get(
        "https://api.api-ninjas.com/v1/motorcycles",
        {
          params: { make: makeNorm, model: variante },
          headers: { "X-Api-Key": process.env.API_NINJAS_KEY },
        }
      );
      if (respuesta.data.length > 0) {
        dataAPI = respuesta.data;
        break;
      }
    }

    if (!dataAPI.length) {
      return res.status(404).json({ message: "No se encontraron resultados." });
    }

    // ── Retorna datos crudos de la API sin guardar nada ──
    res.json(dataAPI);

  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({
      message: "Error al buscar motocicletas.",
      detalle: error.message,
    });
  }
};

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

    // Verificar si ya existe
    const existe = await Motocicleta.findOne({
      marca:  make,
      nombre: model,
      modelo: String(year),
    });

    if (existe) return res.json({ _id: existe._id });

    // No existe → guardar
    const nueva = new Motocicleta({
      marca:  make  || "No especificado",
      nombre: model || "No especificado",
      tipo:   traducirTipo(type),
      modelo: String(year),
      detalles: {
        cilindraje:       parseFloat(displacement) || 0,
        tipo_motor:       traducirMotor(engine),
        sistema_frenos:   traducirFrenos(front_brakes, rear_brakes),
        tipo_combustible: traducirCombustible(fuel_system),
        capacidad_aceite: 0,
        tipo_transmision: traducirTransmision(transmission),
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

// Para obtener todas las guardadas (el select original)
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
