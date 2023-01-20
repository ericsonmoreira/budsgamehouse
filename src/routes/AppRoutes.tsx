import { BrowserRouter, Route, Routes } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import TradingCards from "../pages/TradingCards";
import WantedCards from "../pages/WantedCards";
import PrivateRoutes from "./PrivateRoutes";
import routesNames from "./routesNames";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path={routesNames.HOME} element={<Home />} />
            <Route
              path={routesNames.TRANDING_CARDS}
              element={<TradingCards />}
            />
            <Route path={routesNames.WANTED_CARDS} element={<WantedCards />} />
          </Route>
        </Route>
        <Route element={<BasicLayout />}>
          <Route path={routesNames.LOGIN} element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
