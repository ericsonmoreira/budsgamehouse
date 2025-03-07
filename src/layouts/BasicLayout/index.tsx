import BackGroundLoginPageImg from "@/assets/bgLogin.jpg";
import { Box, Container, Grid2 as Grid, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";

function BasicLayout() {
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
      <Container maxWidth="xl">
        <Grid
          container
          spacing={2}
          direction={upMd ? "row" : "column"}
          sx={{
            height: "100%",
            justifyContent: "center",
            alignItems: upMd ? "center" : "stretch",
          }}
        >
          <Grid
            size={{ md: 6 }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="/buds-hero.svg"
              style={{
                maxWidth: upMd ? "400px" : "200px",
              }}
            />
          </Grid>
          <Grid size={{ md: 6 }}>
            <Outlet />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default BasicLayout;
