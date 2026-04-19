import express from "express";
import {
  generarFacturaDesdeCita,
  getFacturasByUsuario,
  getFacturas
} from "../controllers/facturasController.js";

import { validateToken } from "../middlewares/validateToken.js";
import { isAdmin } from "../middlewares/roles.middleware.js";

const router = express.Router();

router.get("/cita/:citaId", validateToken, generarFacturaDesdeCita);

router.get("/usuario/:usuarioId", validateToken, getFacturasByUsuario);

router.get("/", validateToken, isAdmin, getFacturas);

export default router;