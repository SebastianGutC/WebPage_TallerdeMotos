import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Nosotros from "../pages/Nosotros/Nosotros";
import Servicios from "../pages/Servicios/Servicios";
import Repuestos from "../pages/Repuestos/Repuestos";
import API from "../pages/Api/Dudas";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/repuestos" element={<Repuestos/>} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/api" element={<API />} />
    </Routes>
  );
};

export default AppRouter;