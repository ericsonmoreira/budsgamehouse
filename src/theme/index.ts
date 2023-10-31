import { grey } from '@mui/material/colors';
import { alpha, createTheme } from '@mui/material/styles';
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
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(even)': {
              backgroundColor: alpha('#a2a2a2', 0.1),
            },
            '&:hover': {
              backgroundColor: alpha('#a2a2a2', 0.2),
            },
          },
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
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:nth-of-type(even)': {
              backgroundColor: alpha('#d2d2d2', 0.1),
            },
            '&:hover': {
              backgroundColor: alpha('#d2d2d2', 0.2),
            },
          },
        },
      },
    },
  },
  ptBR
);

export { darkTheme, lightTheme };
