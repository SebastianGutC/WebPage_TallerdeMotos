import jwt from "jsonwebtoken";
import Usuario from "../models/userModel.js";
import { config } from "../config.js";

export const validateToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, acceso denegado" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await Usuario.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "Usuario no válido" });
    }

    if (!user.habilitado) {
      return res.status(403).json({ message: "Usuario deshabilitado" });
    }

    req.user = user;

    next();

  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
};