import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
        <AppRoutes />
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
