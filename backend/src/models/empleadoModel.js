import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim:true },
    apellido: { type: String, required: true, trim:true },
    email: { type: String, required: true, unique: true, trim:true },
    contraseña: { type: String, required: true, trim:true },
    rol: { type: String, required: true },
    telefono: { type: Number, required: true},
    habilitado: { type: Boolean, required: true },
},
{timestamps: true})

export default mongoose.model("Empleado", empleadoSchema)