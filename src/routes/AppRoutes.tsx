import { BrowserRouter, Route, Routes } from "react-router-dom";
import AreaClientLayout from "../layouts/AreaClientLayout";
import BasicLayout from "../layouts/BasicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Balances from "../pages/Balances";
import Client from "../pages/Client";
import Commands from "../pages/Commands";
import Expenses from "../pages/Expenses";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFoundPage from "../pages/NotFoundPage";
import Players from "../pages/Players";
import Products from "../pages/Products";
import RecoverPassword from "../pages/RecoverPassword";
import Sales from "../pages/Sales";
import Schedules from "../pages/Schedules";
import Settings from "../pages/Settings";
import TournamentPrizes from "../pages/TournamentPrizes";
import TradingCards from "../pages/TradingCards";
import ViewClient from "../pages/ViewClient";
import ViewCommand from "../pages/ViewCommand";
import ViewExpense from "../pages/ViewExpense";
import ViewPlayer from "../pages/ViewPlayer";
import WantedCards from "../pages/WantedCards";
import PrivateRoutes from "./PrivateRoutes";
import routesNames from "./routesNames";
import LigaPodium from "../pages/LigaPodium";

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path={routesNames.HOME} element={<Home />} />
            <Route path={routesNames.BALANCES} element={<Balances />} />
            <Route path={routesNames.COMMANDS} element={<Commands />} />
            <Route path={routesNames.EXPENSES} element={<Expenses />} />
            <Route path={routesNames.VIEW_EXPENSE} element={<ViewExpense />} />
            <Route path={routesNames.VIEW_COMMAND} element={<ViewCommand />} />
            <Route
              path={routesNames.TRANDING_CARDS}
              element={<TradingCards />}
            />
            <Route path={routesNames.WANTED_CARDS} element={<WantedCards />} />
            <Route path={routesNames.PLAYERS} element={<Players />} />
            <Route path={routesNames.VIEW_PLAYER} element={<ViewPlayer />} />
            <Route path={routesNames.PRODUCTS} element={<Products />} />
            <Route path={routesNames.SALES} element={<Sales />} />
            <Route path={routesNames.SCHEDULES} element={<Schedules />} />
            <Route
              path={routesNames.TOURNAMENT_PRIZES}
              element={<TournamentPrizes />}
            />
            <Route path={routesNames.LIGA_PODIUM} element={<LigaPodium />} />
            <Route path={routesNames.SETTINGS} element={<Settings />} />
            <Route path={routesNames.NOT_FOUND} element={<NotFoundPage />} />
          </Route>
        </Route>
        <Route element={<BasicLayout />}>
          <Route path={routesNames.LOGIN} element={<Login />} />
          <Route
            path={routesNames.RECOVER_PASSWORD}
            element={<RecoverPassword />}
          />
          <Route path={routesNames.CLIENT} element={<Client />} />
          <Route
            path={routesNames.CLIENT_LIGA_PODIUM}
            element={<LigaPodium />}
          />
        </Route>
        <Route element={<AreaClientLayout />}>
          <Route path={routesNames.VIEW_CLIENT} element={<ViewClient />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
