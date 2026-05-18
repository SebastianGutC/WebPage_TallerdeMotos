// src/routes/citasRoutes.js

import express from "express";

import {
  obtenerCitas,
  obtenerCitaPorId,
  crearCita,
  actualizarCita,
  eliminarCita,
  getCitasByUsuario,
  cancelarCita,
  asignarTecnico,
  cambiarEstadoCita,
  getCitasPorEstado,
  getCitasPorFecha,
  getCitasAsignadas,
  getDetalleCitaTecnico,
  addServicioToCita,
  removeServicioFromCita,
  addProductoToCita,
  removeProductoFromCita,
  agendarCita
} from "../controllers/citasController.js";

import { validateToken } from "../middlewares/validateToken.js";

import {
  isAdmin,
  isTecnico,
  isAdminOrTecnico
} from "../middlewares/roles.middleware.js";

const router = express.Router();

router.use(validateToken);

// ADMIN / TECNICO
router.get("/", isAdminOrTecnico, obtenerCitas);

// USUARIO / ADMIN
router.get("/usuario/:usuarioId", getCitasByUsuario);

// FILTROS ADMIN
router.get("/estado/:estado", getCitasPorEstado);
router.get("/fecha/buscar", isAdmin, getCitasPorFecha);

// TECNICO
router.get("/tecnico/asignadas", isTecnico, getCitasAsignadas);
router.get("/tecnico/detalle/:id", isTecnico, getDetalleCitaTecnico);

// CRUD
router.get("/:id", isAdmin, obtenerCitaPorId);
router.post("/", isAdmin, crearCita);
router.put("/:id", isAdminOrTecnico, actualizarCita);
router.delete("/:id", isAdmin, eliminarCita);

// USUARIO
router.put("/:id/cancelar", cancelarCita);
router.put("/:id/agendar", agendarCita)

// ADMIN
router.put("/:id/asignar-tecnico", isAdmin, asignarTecnico);
router.put("/:id/estado", cambiarEstadoCita);

// SERVICIOS
router.post("/:id/servicios", isAdminOrTecnico, addServicioToCita);
router.delete("/:id/servicios/:index", isAdminOrTecnico, removeServicioFromCita);

// PRODUCTOS
router.post("/:id/productos", isAdminOrTecnico, addProductoToCita);
router.delete("/:id/productos/:index", isAdminOrTecnico, removeProductoFromCita);



export default router;