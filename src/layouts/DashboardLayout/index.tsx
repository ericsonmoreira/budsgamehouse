import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const DashboardLayoutRoot = styled("div")(({ theme }) => ({
    display: "flex",
    flex: "1 1 auto",
    maxWidth: "100%",
    height: "100dvh",
    paddingTop: 54,
    overflow: "auto",
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.up("lg")]: {
      paddingLeft: 180,
      paddingTop: 64,
    },
    [theme.breakpoints.up("sm")]: {
      paddingTop: 64,
    },
  }));

  return (
    <DashboardLayoutRoot>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          display: "flex",
          flex: "1 1 auto",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Outlet />
      </Container>
      <DashboardNavbar onSidebarOpen={() => setSidebarOpen(true)} />
      <DashboardSidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
    </DashboardLayoutRoot>
  );
}

export default DashboardLayout;
