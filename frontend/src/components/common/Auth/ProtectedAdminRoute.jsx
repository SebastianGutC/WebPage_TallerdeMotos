// src/components/Auth/ProtectedAdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth} from "../../../context/UseAuth";

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
  const { usuario, isAuthenticated } = useAuth();

  if (!isAuthenticated || usuario?.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;