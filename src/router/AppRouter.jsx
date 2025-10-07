import { Routes, Route } from "react-router-dom";
import Register from "../pages/Register";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRouter;