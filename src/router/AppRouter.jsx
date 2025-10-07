import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Servicios from "../pages/Servicios";
import Repuestos from "../pages/Repuestos";
import Nosotros from "../pages/Nosotros";
import Login from "../pages/Login";
import Register from "../pages/Register";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/repuestos" element={<Repuestos />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRouter;