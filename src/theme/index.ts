import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid';

const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      background: {
        default: grey[300],
        paper: grey[200],
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
    },
  },
  ptBR
);

const darkTheme = createTheme(
  {
    palette: {
      mode: 'dark',
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
    },
  },
  ptBR
);

export { darkTheme, lightTheme };
