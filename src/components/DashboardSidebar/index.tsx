import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  useMediaQuery,
  IconButton,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NavItem from "../NavItem";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "../../services/firebaseConfig";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

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
    to: "/",
    title: "Home",
  },
  {
    icon: HomeIcon,
    to: "/",
    title: "Home",
  },
  {
    icon: HomeIcon,
    to: "/",
    title: "Home",
  },
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  open,
  onClose,
}) => {
  const navigate = useNavigate();

  const [signOut] = useSignOut(auth);

  const theme = useTheme();

  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

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
          <NavItem key={title} icon={icon} to={to} title={title} />
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
