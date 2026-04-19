import express from "express";

import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuarios,
  obtenerHistorialCitasUsuario,
  cambiarRolUsuario,
  crearTecnico,
  cambiarPassword
} from "../controllers/userController.js";

import { validateToken } from "../middlewares/validateToken.js";

import {
  isAdmin,
  isAdminOrTecnico
} from "../middlewares/roles.middleware.js";

const router = express.Router();

router.use(validateToken);

// tecnico, admin
router.get("/", isAdminOrTecnico, obtenerUsuarios);

// admin
router.post("/tecnico", isAdmin, crearTecnico);

// usuario autenticado
router.put("/cambiar-password", cambiarPassword);

// admin
router.put("/:id/rol", isAdmin, cambiarRolUsuario);

// usuario dueño o admin
router.get("/:id", obtenerUsuarioPorId);

// usuario dueño o admin
router.put("/:id", actualizarUsuario);

// admin
router.delete("/:id", isAdmin, eliminarUsuarios);

// usuario dueño o admin
router.get("/:id/citas", obtenerHistorialCitasUsuario);

export default router;