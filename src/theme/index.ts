import { alpha, createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/x-data-grid/locales";

const lightTheme = createTheme(
  {
    palette: {
      mode: "light",
      primary: {
        main: "#3762C1", // Azul mais escuro para maior contraste
        light: "#5A86E8",
        dark: "#25448B",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#E35B48", // Vermelho mais escuro para complementar
        light: "#FF8A73",
        dark: "#AF362E",
        contrastText: "#FFFFFF",
      },
      background: {
        default: "#E5E9EC", // Cinza mais escuro para o fundo geral
        paper: "#F2F4F5", // Levemente mais escuro para destacar do default
      },
      text: {
        primary: "#212121", // Cinza muito escuro para o texto principal
        secondary: "#424242", // Cinza escuro para texto secundário
      },
    },
    typography: {
      fontSize: 12,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(even) td": {
              backgroundColor: alpha("#a2a2a2", 0.1),
            },
            "&:hover td": {
              backgroundColor: alpha("#a2a2a2", 0.2),
            },
          },
        },
      },
    },
  },
  ptBR,
);

const darkTheme = createTheme(
  {
    palette: {
      mode: "dark",
      primary: {
        main: "#2e9cff",
      },
      background: {
        default: "#010405",
        paper: "#201d1e",
      },
    },
    typography: {
      fontSize: 12,
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:nth-of-type(even) td": {
              backgroundColor: alpha("#d2d2d2", 0.1),
            },
            "&:hover td": {
              backgroundColor: alpha("#d2d2d2", 0.2),
            },
          },
        },
      },
    },
  },
  ptBR,
);

export { darkTheme, lightTheme };
