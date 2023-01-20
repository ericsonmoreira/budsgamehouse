import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useSignOut } from "react-firebase-hooks/auth";
import { Outlet, useNavigate } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";
import DashboardSidebar from "../../components/DashboardSidebar";
import { auth } from "../../services/firebaseConfig";

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
