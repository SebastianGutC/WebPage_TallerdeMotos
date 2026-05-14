import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Nosotros from "../pages/Nosotros/Nosotros";
import Servicios from "../pages/Servicios/Servicios";
import Repuestos from "../pages/Repuestos/Repuestos";
import API from "../pages/Api/Dudas";
import AdminPage from "../pages/Admin/AdminPage";
import ProtectedAdminRoute from "../components/common/Auth/ProtectedAdminRoute";

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
    </Routes>
  );
};

export default AppRouter;