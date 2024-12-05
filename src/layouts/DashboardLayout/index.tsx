import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";
import DashboardSidebar from "../../components/DashboardSidebar";

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const DashboardLayoutRoot = styled("div")(({ theme }) => ({
    display: "flex",
    flex: "1 1 auto",
    maxWidth: "100%",
    height: "100dvh",
    paddingTop: 64,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 180,
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
        open={isSidebarOpen}
      />
    </DashboardLayoutRoot>
  );
};

export default DashboardLayout;
