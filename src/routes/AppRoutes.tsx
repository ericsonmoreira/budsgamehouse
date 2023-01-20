import { BrowserRouter, Route, Routes } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import PrivateRoutes from "./PrivateRoutes";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Home />} />
            {/* É possível colocar outras rotas protegidas aqui */}
          </Route>
        </Route>
        <Route element={<BasicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
