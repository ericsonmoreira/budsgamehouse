import LoadingTransition from "@/components/LoadingTransition";
import AreaClientLayout from "@/layouts/AreaClientLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import routesNames from "./routesNames";

// PAGES
const Balances = lazy(() => import("../pages/Balances"));
const BasicLayout = lazy(() => import("../layouts/BasicLayout"));
const Client = lazy(() => import("../pages/Client"));
const CreateSchedle = lazy(() => import("../pages/CreateSchedle"));
const Commands = lazy(() => import("../pages/Commands"));
const EditPlayer = lazy(() => import("../pages/EditPlayer"));
const EditProduct = lazy(() => import("../pages/EditProduct"));
const EditSchedle = lazy(() => import("../pages/EditSchedle"));
const Expenses = lazy(() => import("../pages/Expenses"));
const Home = lazy(() => import("../pages/Home"));
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
const ViewProduct = lazy(() => import("../pages/ViewProduct"));
const ViewSale = lazy(() => import("../pages/ViewSale"));
const ViewSchedle = lazy(() => import("../pages/ViewSchedle"));
const WantedCards = lazy(() => import("../pages/WantedCards"));

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingTransition />}>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<DashboardLayout />}>
              <Route path={routesNames.BALANCES} element={<Balances />} />
              <Route
                path={routesNames.CREATE_SCHEDULE}
                element={<CreateSchedle />}
              />
              <Route path={routesNames.COMMANDS} element={<Commands />} />
              <Route path={routesNames.EDIT_PLAYER} element={<EditPlayer />} />
              <Route
                path={routesNames.EDIT_PRODUCT}
                element={<EditProduct />}
              />
              <Route
                path={routesNames.EDIT_SCHEDLE}
                element={<EditSchedle />}
              />
              <Route path={routesNames.EXPENSES} element={<Expenses />} />
              <Route path={routesNames.HOME} element={<Home />} />
              <Route path={routesNames.LIGA_PODIUM} element={<LigaPodium />} />
              <Route path={routesNames.NOT_FOUND} element={<NotFoundPage />} />
              <Route path={routesNames.PLAYERS} element={<Players />} />
              <Route path={routesNames.PRODUCTS} element={<Products />} />
              <Route path={routesNames.SALES} element={<Sales />} />
              <Route path={routesNames.SCHEDULES} element={<Schedules />} />
              <Route path={routesNames.SETTINGS} element={<Settings />} />
              <Route
                path={routesNames.TOURNAMENT_PRIZES}
                element={<TournamentPrizes />}
              />
              <Route
                path={routesNames.VIEW_COMMAND}
                element={<ViewCommand />}
              />
              <Route
                path={routesNames.VIEW_EXPENSE}
                element={<ViewExpense />}
              />
              <Route path={routesNames.VIEW_PLAYER} element={<ViewPlayer />} />
              <Route
                path={routesNames.VIEM_PRODUCT}
                element={<ViewProduct />}
              />
              <Route path={routesNames.VIEW_SALE} element={<ViewSale />} />
              <Route
                path={routesNames.VIEW_SCHEDLE}
                element={<ViewSchedle />}
              />
              <Route
                path={routesNames.WANTED_CARDS}
                element={<WantedCards />}
              />
            </Route>
          </Route>
          <Route element={<BasicLayout />}>
            <Route path={routesNames.CLIENT} element={<Client />} />
            <Route
              path={routesNames.CLIENT_LIGA_PODIUM}
              element={<LigaPodium />}
            />
            <Route path={routesNames.LOGIN} element={<Login />} />
            <Route
              path={routesNames.RECOVER_PASSWORD}
              element={<RecoverPassword />}
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
