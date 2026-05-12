// src/components/Auth/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";

/**
 * Componente guardián de ruta.
 * Solo permite acceso si el usuario en localStorage tiene rol "ADMIN".
 * Si no: redirige al inicio silenciosamente.
 *
 * Uso en App.jsx / router:
 *   <Route path="/admin" element={
 *     <ProtectedAdminRoute>
 *       <AdminPage />
 *     </ProtectedAdminRoute>
 *   } />
 */
const ProtectedAdminRoute = ({ children }) => {
  const userStorage = localStorage.getItem("user");
  const user = userStorage ? JSON.parse(userStorage) : null;

  if (!user || user.rol !== "ADMIN") {
    // Redirige al home sin dejar rastro en el historial
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;