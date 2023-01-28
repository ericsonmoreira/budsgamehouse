import AddCardIcon from "@mui/icons-material/AddCard";
import CachedIcon from "@mui/icons-material/Cached";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSignOut } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import routesNames from "../../routes/routesNames";
import { auth } from "../../services/firebaseConfig";
import NavItem from "../NavItem";

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
    title: "Home",
  },
  {
    icon: CachedIcon,
    to: routesNames.TRANDING_CARDS,
    title: "Cartas de Troca",
  },
  {
    icon: AddCardIcon,
    to: routesNames.WANTED_CARDS,
    title: "Want List",
  },
  {
    icon: PersonIcon,
    to: routesNames.PLAYERS,
    title: "Players",
  },
  {
    icon: EmojiEventsIcon,
    to: routesNames.TOURNAMENTS,
    title: "Torneiros",
  },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const location = useLocation();

  const [signOut] = useSignOut(auth);

  const theme = useTheme();

  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  const isNavItemActive = (to: string): boolean =>
    to === routesNames.HOME
      ? to === location.pathname
      : location.pathname.includes(to);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Stack
        spacing={1}
        padding={2}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <img
          src="/atm-logo.png"
          alt="Atm Logo"
          style={{ width: "5rem", height: "5rem" }}
        />
        <Typography variant="body2">Associação Tabulerence de Magic</Typography>
      </Stack>

      <Divider />
      <Box sx={{ flexGrow: 1, py: 2 }}>
        {items.map(({ icon, title, to }) => (
          <NavItem
            key={title}
            icon={icon}
            to={to}
            title={title}
            active={isNavItemActive(to)}
          />
        ))}
      </Box>
      <Divider />
      <Box padding={1}>
        <Button
          fullWidth
          color="error"
          variant="outlined"
          endIcon={<LogoutIcon />}
          onClick={handleSignOut}
        >
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
            width: 280,
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
