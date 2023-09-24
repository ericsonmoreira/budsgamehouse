import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Balances from '../pages/Balances';
import Home from '../pages/Home';
import Login from '../pages/Login';
import NotFoundPage from '../pages/NotFoundPage';
import Players from '../pages/Players';
import Products from '../pages/Products';
import RecoverPassword from '../pages/RecoverPassword';
import TradingCards from '../pages/TradingCards';
import ViewPlayer from '../pages/ViewPlayer';
import WantedCards from '../pages/WantedCards';
import PrivateRoutes from './PrivateRoutes';
import routesNames from './routesNames';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route element={<DashboardLayout />}>
            <Route path={routesNames.HOME} element={<Home />} />
            <Route path={routesNames.BALANCES} element={<Balances />} />
            <Route path={routesNames.TRANDING_CARDS} element={<TradingCards />} />
            <Route path={routesNames.WANTED_CARDS} element={<WantedCards />} />
            <Route path={routesNames.PLAYERS} element={<Players />} />
            <Route path={routesNames.VIEW_PLAYER} element={<ViewPlayer />} />
            <Route path={routesNames.PRODUCTS} element={<Products />} />
            <Route path={routesNames.NOT_FOUND} element={<NotFoundPage />} />
          </Route>
        </Route>
        <Route element={<BasicLayout />}>
          <Route path={routesNames.LOGIN} element={<Login />} />
          <Route path={routesNames.RECOVER_PASSWORD} element={<RecoverPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
