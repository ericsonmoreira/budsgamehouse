import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "react-query";
import AppRoutes from "./routes/AppRoutes";
import queryClient from "./services/queryClient";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
