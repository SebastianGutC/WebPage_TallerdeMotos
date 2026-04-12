import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { connectDB } from "../db.js";

import Usuario from "../models/userModel.js";
import Empleado from "../models/empleadoModel.js";
import Cita from "../models/citaModel.js";
import Servicio from "../models/servicioModel.js";
import Producto from "../models/productoModel.js";


    
const seed = async () => {
  try {
    await connectDB();

    // ✅ Solo corre si no hay datos
    const hayUsuarios = await Usuario.countDocuments();
    if (hayUsuarios > 0) {
      console.log("ℹ️ La base de datos ya tiene datos, seed omitido.");
      return;
    }

    console.log("🌱 Base de datos vacía, insertando datos iniciales...");
    // ... resto del seed igual
    // Limpiar colecciones antes de insertar
    await Promise.all([
      Usuario.deleteMany(),
      Empleado.deleteMany(),
      Cita.deleteMany(),
      Servicio.deleteMany(),
      Producto.deleteMany(),
    ]);

    // 👤 Usuario
    const usuario = await Usuario.create({
      nombre: "Michel",
      apellido: "Cardona",
      email: "michel@test.com",
      contraseña: await bcryptjs.hash("456789", 10),  // ✅ hasheada
      telefono: 3204478662,
    });

    // 👨‍🔧 Técnico
    const tecnico = await Empleado.create({
      nombre: "Carlos",
      apellido: "Gómez",
      telefono: 3009876543,
      email: "carlos@test.com",
      contraseña: await bcryptjs.hash("123456", 10),  // ✅ hasheada
      habilitado: true,
      rol: "técnico",
    });

    // 🛠️ Servicios
    const servicios = await Servicio.insertMany([
      {
        nombre: "Cambio de aceite",
        icono: "fi-wrench",
        precio: 40000,
        descripcion: "Sustitución del aceite del motor con productos de alta calidad.",
      },
      {
        nombre: "Revisión general",
        icono: "fi-shield",
        precio: 60000,
        descripcion: "Diagnóstico completo de frenos, motor y sistema eléctrico.",
      },
    ]);

    // 📦 Productos
    const productos = await Producto.insertMany([
      {
        nombre: "Aceite 10W40",
        descripcion: "Aceite de motor para motos de 4 tiempos",
        precio: 35000,
        stock: 10,
        img64: "",
        marca: "Yamalube",
        categoria: "Lubricantes",
      },
      {
        nombre: "Filtro de aire FZ150",
        descripcion: "Filtro de aire original para Yamaha FZ150",
        precio: 28000,
        stock: 5,
        img64: "",
        marca: "Yamaha",
        categoria: "Filtros",
      },
    ]);

    // 📅 Cita disponible (sin usuario aún)
    await Cita.create({
      fecha: new Date(),
      hora: "10:00",           // ✅ String, como está en el modelo
      tecnicoId: tecnico._id,
      estado: "disponible",
    });

    // 🔧 Cita en proceso (con usuario asignado)
    await Cita.create({
      fecha: new Date(),
      hora: "11:00",           // ✅ String
      tecnicoId: tecnico._id,
      usuarioId: usuario._id,
      placaMoto: "ABC123",
      servicios: [
        { nombre: servicios[0].nombre, costo: servicios[0].precio },
      ],
      productos: [
        { nombre: productos[0].nombre, cantidad: 1, costo: productos[0].precio },
      ],
      estado: "en_proceso",
    });

    console.log("✅ Seed ejecutado correctamente");
    process.exit();

  } catch (error) {
    console.error("❌ Error en seed:", error);
    process.exit(1);
  }
};

// Al final del archivo, reemplaza seed(); por:
export { seed };