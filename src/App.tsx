import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from 'react-query';
import useThemeDetector from './hooks/useThemeDetector ';
import AppRoutes from './routes/AppRoutes';
import queryClient from './services/queryClient';
import { darkTheme, lightTheme } from './theme';

function App() {
  const osTheme = useThemeDetector();

  return (
    <ThemeProvider theme={osTheme === 'dark' ? darkTheme : lightTheme}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
