import { Box, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import BackGroundLoginPageImg from "../../assets/bgLogin.jpg";

const BasicLayout: React.FC = () => {
  const theme = useTheme();

  const upMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        height: "100dvh",
        backgroundImage: `url(${BackGroundLoginPageImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: upMd ? "row" : "column",
          height: "100dvh",
        }}
      >
        <Box
          sx={{
            padding: 1,
            display: "flex",
            // flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/buds-logo.png"
            style={{ maxWidth: upMd ? "300px" : "220px", width: "auto" }}
          />
        </Box>
        <Box
          sx={{
            padding: 1,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            alignItems: "center",
            justifyContent: upMd ? "center" : "flex-start",
          }}
        >
          <Outlet />
        </Box>
      </Container>
    </Box>
  );
};

export default BasicLayout;
