import { createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/x-data-grid';

const lightTheme = createTheme(
  {
    palette: {
      mode: 'light',
    },
    typography: {
      fontSize: 12,
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
  },
  ptBR
);

export { lightTheme, darkTheme };
