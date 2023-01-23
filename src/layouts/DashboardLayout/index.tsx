import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";
import DashboardSidebar from "../../components/DashboardSidebar";
import theme from "../../theme";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  const DashboardLayoutRoot = styled("div")(({ theme }) => ({
    display: "flex",
    flex: "1 1 auto",
    maxWidth: "100%",
    height: "100vh",
    paddingTop: 64,
    backgroundColor: "#f5f5f5",
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 280,
    },
  }));

  return (
    <DashboardLayoutRoot>
      <Box
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen || upLg}
      />
    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
