import { ThemeProvider } from "@mui/material/styles";
import AppRoutes from "./routes/AppRoutes";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
