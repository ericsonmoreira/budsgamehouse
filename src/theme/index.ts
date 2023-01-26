import { createTheme } from "@mui/material/styles";
import { green, purple } from "@mui/material/colors";
import { ptBR } from "@mui/x-data-grid";

const theme = createTheme(
  {
    palette: {
      primary: {
        main: purple[500],
      },
      secondary: {
        main: green[500],
      },
    },
  },
  ptBR
);

export default theme;
