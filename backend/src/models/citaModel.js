import mongoose from "mongoose";

const CitaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },

  hora: {
    type: String,
    required: true
  },

  tecnicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empleado",
    required: true
  },

  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null
  },

  placaMoto: {
    type: String
  },

    motocicletaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Motocicleta"
    },

  servicios: [
    {
      nombre: String,
      costo: Number
    }
  ],

  productos: [
    {
      nombre: String,
      cantidad: Number,
      costo: Number
    }
  ],

  fechaEntrega: {
    type: Date,
    default: null
  },

  estado: {
    type: String,
    enum: [
      "disponible",
      "pendiente",
      "en_proceso",
      "lista",
      "entregada",
      "cancelada",
      "no_asistio"
    ],
    default: "disponible"
  }

}, {
  timestamps: true
});

export default mongoose.model("Cita", CitaSchema);
