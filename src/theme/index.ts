import { alpha, createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid';

const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#2e6bff',
      },
      background: {
        default: '#d0dee2',
        paper: '#e3f8ff',
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
            '&:nth-of-type(even) td': {
              backgroundColor: alpha('#a2a2a2', 0.1),
            },
            '&:hover td': {
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
      primary: {
        main: '#2e9cff',
      },
      background: {
        default: '#010405',
        paper: '#201d1e',
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
            '&:nth-of-type(even) td': {
              backgroundColor: alpha('#d2d2d2', 0.1),
            },
            '&:hover td': {
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
