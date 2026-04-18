import express from "express";

import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  eliminarUsuarios,
  obtenerHistorialCitasUsuario,
  obtenerFacturasUsuario
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

// usuario dueño o admin
router.get("/:id", obtenerUsuarioPorId);

// usuario dueño o admin
router.put("/:id", actualizarUsuario);

// admin
router.delete("/:id", isAdmin, eliminarUsuarios);

// usuario dueño o admin
router.get("/:id/citas", obtenerHistorialCitasUsuario);

// usuario dueño o admin
router.get("/:id/facturas", obtenerFacturasUsuario);

export default router;