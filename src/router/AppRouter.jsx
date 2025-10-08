import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home/Home";
import Nosotros from "../pages/Nosotros/Nosotros";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/nosotros" element={<Nosotros />} />
    </Routes>
  );
};

export default AppRouter;