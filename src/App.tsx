import { ThemeProvider } from '@mui/material/styles';
import { Toaster } from 'react-hot-toast';
import { QueryClientProvider } from 'react-query';
import { useLocalStorage } from 'usehooks-ts';
import AppRoutes from './routes/AppRoutes';
import queryClient from './services/queryClient';
import { darkTheme, lightTheme } from './theme';

function App() {
  const [isDarkTheme] = useLocalStorage('darkTheme', true);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
