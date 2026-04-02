import mongoose from "mongoose";

const servicioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim:true , unique: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    icono: { type: String, required: true, trim:true },
})

export default mongoose.model("Servicio", servicioSchema)