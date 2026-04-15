import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    contraseña: { type: String, required: true, trim: true },
    telefono: { type: Number, required: true },
    habilitado: { type: Boolean, default: true },

    rol: {
        type: String,
        enum: ["ADMIN", "TECNICO", "USUARIO"],
        default: "USUARIO",
        required: true
    }

}, { timestamps: true });

export default mongoose.model("Usuario", userSchema);