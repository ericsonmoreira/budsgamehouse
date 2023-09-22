import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Associates from '../pages/Associates';
import Balances from '../pages/Balances';
import Fiados from '../pages/Fiados';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Negotiations from '../pages/Negotiations';
import Players from '../pages/Players';
import Products from '../pages/Products';
import RecoverPassword from '../pages/RecoverPassword';
import TournamentView from '../pages/TournamentView';
import Tournaments from '../pages/Tournaments';
import TradingCards from '../pages/TradingCards';
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
            <Route path={routesNames.ASSOCIATES} element={<Associates />} />
            <Route path={routesNames.BALANCES} element={<Balances />} />
            <Route path={routesNames.TRANDING_CARDS} element={<TradingCards />} />
            <Route path={routesNames.WANTED_CARDS} element={<WantedCards />} />
            <Route path={routesNames.PLAYERS} element={<Players />} />
            <Route path={routesNames.PRODUCTS} element={<Products />} />
            <Route path={routesNames.FIADOS} element={<Fiados />} />
            <Route path={routesNames.TOURNAMENTS} element={<Tournaments />} />
            <Route path={routesNames.NEGOTIATIONS} element={<Negotiations />} />
            <Route path={routesNames.TOURNAMENT_VIEW} element={<TournamentView />} />
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
