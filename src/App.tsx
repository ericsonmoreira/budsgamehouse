import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider } from "react-query";
import AppRoutes from "./routes/AppRoutes";
import queryClient from "./services/queryClient";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
