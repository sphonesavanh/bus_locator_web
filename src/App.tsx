import { AppRouter } from "@/routes";
import { ThemeProvider, createTheme } from "@mui/material/styles";

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: '"Noto Sans Lao", sans-serif',
      fontSize: 16,
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
