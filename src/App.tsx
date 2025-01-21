import { ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ptBR } from "date-fns/locale/pt-BR";
import { Toaster } from "react-hot-toast";
import { useLocalStorage } from "usehooks-ts";
import AppRoutes from "./routes/AppRoutes";
import queryClient from "./services/queryClient";
import { darkTheme, lightTheme } from "./theme";
import AppGlobalStyles from "./theme/AppGlobalStyles";

function App() {
  const [isDarkTheme] = useLocalStorage("darkTheme", true);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <AppGlobalStyles />
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <AppRoutes />
        </LocalizationProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
