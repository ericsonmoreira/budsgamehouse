import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { Outlet, useNavigate } from "react-router-dom";
import AppDrawer from "../../components/AppDrawer";
import { auth } from "../../services/firebaseConfig";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardNavbar from "../../components/DashboardNavbar";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();

  const [signOut] = useSignOut(auth);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const DashboardLayoutRoot = styled("div")(({ theme }) => ({
    display: "flex",
    flex: "1 1 auto",
    maxWidth: "100%",
    paddingTop: 64,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 280,
    },
  }));

  return (
    <DashboardLayoutRoot>
      {/* <AppBar sx={{ marginLeft: "300px", position: "fixed" }}>
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
      </AppBar> */}
      {/* <AppDrawer /> */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Outlet />
      </Box>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
