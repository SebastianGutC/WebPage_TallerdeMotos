import mongoose from "mongoose";

const MotocicletaSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  modelo: { type: String, required: true },

  detalles: {
    cilindraje: { type: Number, required: true },
    tipo_motor: { type: String, required: true },       
    sistema_frenos: { type: String, required: true }, 
    tipo_combustible: { type: String, required: true }, 
    capacidad_aceite: { type: Number, required: true },
    tipo_transmision: { type: String, required: true }  
  }
});

export default mongoose.model("Motocicleta", MotocicletaSchema)