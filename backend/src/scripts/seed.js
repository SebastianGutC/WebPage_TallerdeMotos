import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { connectDB } from "../db.js";

import Usuario from "../models/userModel.js";
import Cita from "../models/citaModel.js";
import Servicio from "../models/servicioModel.js";
import Producto from "../models/productoModel.js";

const seed = async () => {
  try {
    await connectDB();

    const usuariosCount = await Usuario.countDocuments();

    if (usuariosCount > 0) {
      console.log("ℹ️ La base de datos ya está inicializada. Seed omitido.");
      return;
    }

    console.log("🌱 Insertando datos iniciales...");

    // 👤 USUARIOS
    const admin = await Usuario.create({
      nombre: "Admin",
      apellido: "Sistema",
      email: "admin@test.com",
      contraseña: await bcryptjs.hash("123456", 10),
      telefono: "3000000001",
      rol: "ADMIN",
      habilitado: true
    });

    const tecnico = await Usuario.create({
      nombre: "Carlos",
      apellido: "Gómez",
      email: "tecnico@test.com",
      contraseña: await bcryptjs.hash("123456", 10),
      telefono: "3000000002",
      rol: "TECNICO",
      habilitado: true
    });

    const cliente = await Usuario.create({
      nombre: "Michel",
      apellido: "Cardona",
      email: "cliente@test.com",
      contraseña: await bcryptjs.hash("456789", 10),
      telefono: "3204478662",
      rol: "USUARIO",
      habilitado: true
    });

    // 🛠️ SERVICIOS
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

    // 📦 PRODUCTOS
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

    // 📅 CITA disponible
    await Cita.create({
      fecha: new Date(),
      hora: "10:00",
      tecnicoId: tecnico._id,
      estado: "disponible",
    });

    // 🔧 CITA en proceso
    await Cita.create({
      fecha: new Date(),
      hora: "11:00",
      tecnicoId: tecnico._id,
      usuarioId: cliente._id,
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

export { seed };