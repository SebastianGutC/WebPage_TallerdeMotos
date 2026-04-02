import mongoose from "mongoose";
import {connectDB} from "../db.js";

import Usuario from "../models/userModel.js";
import Empleado from "../models/empleadoModel.js";
import Cita from "../models/citaModel.js";
import Servicio from "../models/servicioModel.js";
import Inventario from "../models/productoModel.js";

const seed = async () => {
  try {

    await connectDB();

    console.log("🧹 Limpiando base de datos...");

    // 👤 Usuario
    const usuario = await Usuario.create({
      nombre: "Michel",
      apellido: "Cardona",
      email: "michel@test.com",
      contraseña: "456789",
      telefono: 3204478662,
    });

    // 👨‍🔧 Técnico
    const tecnico = await Empleado.create({
      nombre: "Carlos",
      apellido: "Gómez",
      telefono: 3009876543,
      email: "carlos@test.com",
      contraseña: "123456",
      habilitado: true,
      rol: "técnico"
    });

    // 🛠️ Servicios
    const servicios = await Servicio.insertMany([
      {
        nombre: "Cambio de aceite",
        icono: "fi-wrench",
        precio: 40000,
        descripcion: "Cambio de aceite"
      }
    ]);

    // 📦 Inventario
    const productos = await Inventario.insertMany([
      {
        nombre: "Aceite 10W40",
        descripcion: "Aceite",
        precio: 35000,
        stock: 10,
        img64: "",
        marca: "Yamalube",
        categoria: "Lubricantes"
      }
    ]);

    // 📅 Cita disponible
    await Cita.create({
      fecha: new Date(),
      hora: 10,
      tecnicoId: tecnico._id,
      estado: "disponible"
    });

    // 🔧 Cita en proceso
    await Cita.create({
      fecha: new Date(),
      hora: 11,
      tecnicoId: tecnico._id,
      usuarioId: usuario._id,
      placaMoto: "ABC123",

      motocicleta: {
        marca: "Yamaha",
        nombre: "FZ",
        tipo: "Deportiva",
        modelo: "2022",
        detalles: {
          cilindraje: 150
        }
      },

      servicios: [
        {
          nombre: servicios[0].nombre,
          costo: servicios[0].precio
        }
      ],

      productos: [
        {
          nombre: productos[0].nombre,
          cantidad: 1,
          costo: productos[0].precio
        }
      ],

      estado: "en_proceso"
    });

    console.log("✅ Seed ejecutado correctamente");

    process.exit();

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

seed();