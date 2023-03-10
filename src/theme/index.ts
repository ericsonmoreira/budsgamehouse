import { createTheme } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import { ptBR } from "@mui/x-data-grid";

const theme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: {
        main: purple[400],
      },
      secondary: {
        main: green[400],
      },
    },
    typography: {
      fontSize: 12,
    },
  },
  ptBR
);

export default theme;
