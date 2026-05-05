import mongoose from "mongoose";

const CitaSchema = new mongoose.Schema(
{
  fecha: {
    type: Date,
    required: true
  },

  hora: {
    type: String,
    required: true,
    trim: true
  },

  tecnicoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },

  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    default: null
  },

  placaMoto: {
    type: String,
    trim: true,
    uppercase: true
  },

  motocicletaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Motocicleta",
    default: null
  },

  servicios: [
    {
      nombre: {
        type: String,
        trim: true
      },

      costo: {
        type: Number,
        min: 0,
        default: 0
      }
    }
  ],

  productos: [
    {
      nombre: {
        type: String,
        trim: true
      },

      cantidad: {
        type: Number,
        min: 1,
        default: 1
      },

      costo: {
        type: Number,
        min: 0,
        default: 0
      }
    }
  ],

    fechaIngreso: {
    type: Date,
    default: null
  },

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

},
{
  timestamps: true,
  versionKey: false
});

export default mongoose.model("Cita", CitaSchema);