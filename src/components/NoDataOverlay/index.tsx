import NotDataAnimation from "@/assets/lotties/noData.json";
import { Box, Typography } from "@mui/material";
import Lottie from "lottie-react";

function NoDataOverlay() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography variant="inherit" gutterBottom>
        Nada para apresentar...
      </Typography>
      <Lottie animationData={NotDataAnimation} />
    </Box>
  );
}

export default NoDataOverlay;
