import express from "express";

import {
  obtenerProductos,
  obtenerProductoPorId,
  obtenerProductoPorNombre,
  obtenerProductosPorCategoria,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productosController.js";

import { validateToken } from "../middlewares/validateToken.js";

import {
  isAdmin
} from "../middlewares/roles.middleware.js";

const router = express.Router();


// getAllProductos()
router.get("/", obtenerProductos);

// getProductoByName()
router.get("/buscar/nombre", obtenerProductoPorNombre);

// getProductosByCategoria()
router.get("/categoria/:categoria", obtenerProductosPorCategoria);


// getProductoById() (admin)
router.get("/:id", validateToken, isAdmin, obtenerProductoPorId);

// crearProducto() (admin)
router.post("/", validateToken, isAdmin, crearProducto);

// actualizarProducto() (admin)
router.put("/:id", validateToken, isAdmin, actualizarProducto);

// eliminarProducto() (admin)
router.delete("/:id", validateToken, isAdmin, eliminarProducto);

export default router;