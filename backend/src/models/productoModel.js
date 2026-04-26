import mongoose from "mongoose";

const productoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim:true , unique: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    imagen: { type: String, default: "" },
    marca: { type: String, required: true, trim:true },
    categoria: { type: String, required: true, trim:true },
    modelo: { type: String, required: true, trim:true },
})

export default mongoose.model("Producto", productoSchema)