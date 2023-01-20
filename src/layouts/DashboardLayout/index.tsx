import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { Outlet, useNavigate } from "react-router-dom";
import AppDrawer from "../../components/AppDrawer";
import { auth } from "../../services/firebaseConfig";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const [signOut] = useSignOut(auth);

  const handleSignOut = async () => {
    await signOut();
    navigate("login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="open drawer">
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Atm Card House
          </Typography>
          <IconButton color="inherit" onClick={handleSignOut}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <AppDrawer />
      <Outlet />
    </Box>
  );
};

export default DashboardLayout;
