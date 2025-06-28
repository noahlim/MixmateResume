"use client";
import {
  Box,
  Grid,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import AboutPage from "./AboutPage";
import MenuBar from "@/app/(components)/global/MenuBar";
import Footer from "@/app/(components)/global/Footer";
import ReduxProvider from "../../../lib/redux/provider";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
    },
    secondary: {
      main: "#764ba2",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "sans-serif",
    ].join(","),
  },
});

export default function Page() {
  return (
    <ReduxProvider>
      <ThemeProvider theme={theme}>
        <MenuBar />
        <AboutPage />
        <Footer />
      </ThemeProvider>
    </ReduxProvider>
  );
}
