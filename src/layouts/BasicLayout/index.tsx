import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const BasicLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Outlet />
    </Box>
  );
};

export default BasicLayout;
