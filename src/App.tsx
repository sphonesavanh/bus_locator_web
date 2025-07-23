import { AppRouter } from "@/routes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ActiveBusProvider } from "./contexts/ActiveBusContext";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: '"Noto Sans Lao", sans-serif',
      fontSize: 16,
    },
  });
  return (
    <ActiveBusProvider>
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </ActiveBusProvider>
  );
}

export default App;
