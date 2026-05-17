import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Nosotros from "../pages/Nosotros/Nosotros";
import Servicios from "../pages/Servicios/Servicios";
import Repuestos from "../pages/Repuestos/Repuestos";
import API from "../pages/Api/Dudas";
import AdminPage from "../pages/Admin/AdminPage";
import ProtectedAdminRoute from "../components/common/Auth/ProtectedAdminRoute";
import TecnicoPage from "../pages/Tecnico/TecnicoPage";
import ProtectedTecnicoRoute from "../components/common/Auth/ProtectedTecnicoRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/repuestos" element={<Repuestos />} />
      <Route path="/nosotros" element={<Nosotros />} />

      {/* Ruta protegida: solo accesible si rol === "ADMIN" */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminPage />
          </ProtectedAdminRoute>
        }
      />
      {/* Ruta protegida: solo accesible si rol === "TECNICO" */}
      <Route
        path="/tecnico"
        element={
          <ProtectedTecnicoRoute>
            <TecnicoPage />
          </ProtectedTecnicoRoute>
        }
      />

    </Routes>
  );
};

export default AppRouter;