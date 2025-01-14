import LoadingTransition from "@/components/LoadingTransition";
import AreaClientLayout from "@/layouts/AreaClientLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import routesNames from "./routesNames";

// PAGES
const Home = lazy(() => import("../pages/Home"));
const BasicLayout = lazy(() => import("../layouts/BasicLayout"));
const Balances = lazy(() => import("../pages/Balances"));
const Client = lazy(() => import("../pages/Client"));
const Commands = lazy(() => import("../pages/Commands"));
const EditSchedle = lazy(() => import("../pages/EditSchedle"));
const Expenses = lazy(() => import("../pages/Expenses"));
const LigaPodium = lazy(() => import("../pages/LigaPodium"));
const Login = lazy(() => import("../pages/Login"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const Players = lazy(() => import("../pages/Players"));
const Products = lazy(() => import("../pages/Products"));
const RecoverPassword = lazy(() => import("../pages/RecoverPassword"));
const Sales = lazy(() => import("../pages/Sales"));
const Schedules = lazy(() => import("../pages/Schedules"));
const Settings = lazy(() => import("../pages/Settings"));
const TournamentPrizes = lazy(() => import("../pages/TournamentPrizes"));
const ViewClient = lazy(() => import("../pages/ViewClient"));
const ViewCommand = lazy(() => import("../pages/ViewCommand"));
const ViewExpense = lazy(() => import("../pages/ViewExpense"));
const ViewPlayer = lazy(() => import("../pages/ViewPlayer"));
const ViewSchedle = lazy(() => import("../pages/ViewSchedle"));
const WantedCards = lazy(() => import("../pages/WantedCards"));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingTransition />}>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<DashboardLayout />}>
              <Route path={routesNames.HOME} element={<Home />} />
              <Route path={routesNames.BALANCES} element={<Balances />} />
              <Route path={routesNames.COMMANDS} element={<Commands />} />
              <Route path={routesNames.EXPENSES} element={<Expenses />} />
              <Route
                path={routesNames.VIEW_EXPENSE}
                element={<ViewExpense />}
              />
              <Route
                path={routesNames.VIEW_COMMAND}
                element={<ViewCommand />}
              />
              <Route
                path={routesNames.WANTED_CARDS}
                element={<WantedCards />}
              />
              <Route path={routesNames.PLAYERS} element={<Players />} />
              <Route path={routesNames.VIEW_PLAYER} element={<ViewPlayer />} />
              <Route path={routesNames.PRODUCTS} element={<Products />} />
              <Route path={routesNames.SALES} element={<Sales />} />
              <Route path={routesNames.SCHEDULES} element={<Schedules />} />
              <Route
                path={routesNames.VIEW_SCHEDLE}
                element={<ViewSchedle />}
              />
              <Route
                path={routesNames.EDIT_SCHEDLE}
                element={<EditSchedle />}
              />
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
    </Suspense>
  );
}

export default AppRoutes;
