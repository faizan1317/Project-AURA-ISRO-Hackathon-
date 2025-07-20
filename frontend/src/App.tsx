import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import LocationDetail from "./pages/LocationDetail";
import HistoricalTrends from "./pages/HistoricalTrends";
import CommutePlanner from "./pages/CommutePlanner";
import Map2 from "./pages/Map2";
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";
// import "./App.css";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00FBFB",
    },
  },

  // palette: {
  //   primary: {
  //     main: "#2196f3",
  //   },
  //   secondary: {
  //     main: "#f50057",
  //   },
  //   background: {
  //     default: "#f5f5f5",
  //   },
  // },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/map" element={<Map2 />} />
          <Route path="/location/:id" element={<LocationDetail />} />
          <Route path="/history" element={<HistoricalTrends />} />
          <Route path="/commute" element={<CommutePlanner />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
