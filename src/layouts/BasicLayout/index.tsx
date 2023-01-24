import { Box, Container, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import theme from "../../theme";
import BackGroundLoginPageImg from "../../assets/bgLogin.png";

const BasicLayout: React.FC = () => {
  const upLg = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundImage: `url(${BackGroundLoginPageImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: upLg ? "row" : "column",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src="/atm-logo.png" width="300rem" />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: upLg ? "center" : "flex-start",
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default BasicLayout;
