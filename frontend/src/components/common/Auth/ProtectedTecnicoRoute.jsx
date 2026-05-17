// src/components/Auth/ProtectedTecnicoRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth} from "../../../context/UseAuth";

const ProtectedTecnicoRoute = ({ children }) => {
  const { usuario, isAuthenticated } = useAuth();

  if (!isAuthenticated || usuario?.rol !== "TECNICO") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedTecnicoRoute;
