import AddCardIcon from '@mui/icons-material/AddCard';
import CachedIcon from '@mui/icons-material/Cached';
import HomeIcon from '@mui/icons-material/Home';
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import LogoutIcon from '@mui/icons-material/Logout';
import PaidIcon from '@mui/icons-material/Paid';
import PersonIcon from '@mui/icons-material/Person';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import { Box, Button, Divider, Drawer, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSignOut } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import routesNames from '../../routes/routesNames';
import { auth } from '../../services/firebaseConfig';
import NavItem from '../NavItem';

type AppDrawerItemData = {
  to: string;
  icon: React.FC;
  title: string;
};

type DashboardSidebarProps = {
  open: boolean;
  onClose(): void;
};

const items: AppDrawerItemData[] = [
  {
    icon: HomeIcon,
    to: routesNames.HOME,
    title: 'Home',
  },
  {
    icon: CachedIcon,
    to: routesNames.TRANDING_CARDS,
    title: 'Cartas de Troca',
  },
  {
    icon: AddCardIcon,
    to: routesNames.WANTED_CARDS,
    title: 'Want List',
  },
  {
    icon: PersonIcon,
    to: routesNames.PLAYERS,
    title: 'Players',
  },
  {
    icon: LocalGroceryStoreIcon,
    to: routesNames.PRODUCTS,
    title: 'Produtos',
  },
  {
    icon: PriceCheckIcon,
    to: routesNames.BALANCES,
    title: 'Saldos',
  },
  {
    icon: PaidIcon,
    to: routesNames.FIADOS,
    title: 'Fiados',
  },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const location = useLocation();

  const [signOut] = useSignOut(auth);

  const theme = useTheme();

  const upLg = useMediaQuery(theme.breakpoints.up('lg'));

  const isNavItemActive = (to: string): boolean =>
    to === routesNames.HOME ? to === location.pathname : location.pathname.includes(to);

  const handleSignOut = async () => {
    await signOut();

    navigate(routesNames.LOGIN);
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ flexGrow: 1, py: 2 }}>
        {items.map(({ icon, title, to }) => (
          <NavItem
            key={title}
            icon={icon}
            to={to}
            title={title}
            active={isNavItemActive(to)}
            onClick={() => onClose()}
          />
        ))}
      </Box>
      <Divider />
      <Box padding={1}>
        <Button fullWidth color="error" variant="outlined" endIcon={<LogoutIcon />} onClick={handleSignOut}>
          Logout
        </Button>
      </Box>
    </Box>
  );

  if (upLg) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            top: 65,
            width: 180,
            height: 'calc(100% - 65px)',
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

export default DashboardSidebar;
