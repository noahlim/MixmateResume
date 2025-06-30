"use client";
import MenuBar from "@/app/(components)/global/MenuBar";
import ReduxProvider from "../lib/redux/provider";
import HomePage from "./HomePage";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import Footer from "./(components)/global/Footer";

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

export default function Home() {
  return (
    <ReduxProvider>
      <ThemeProvider theme={theme}>
        <MenuBar />
        <HomePage />
        <Footer />
      </ThemeProvider>
    </ReduxProvider>
  );
}
