export const isAdmin = (req, res, next) => {
  if (req.user.rol !== "ADMIN") {
    return res.status(403).json({ message: "Acceso solo para ADMIN" });
  }
  next();
};

export const isTecnico = (req, res, next) => {
  if (req.user.rol !== "TECNICO") {
    return res.status(403).json({ message: "Acceso solo para TECNICO" });
  }
  next();
};

export const isAdminOrTecnico = (req, res, next) => {
  if (req.user.rol !== "ADMIN" && req.user.rol !== "TECNICO") {
    return res.status(403).json({ message: "No autorizado" });
  }
  next();
};