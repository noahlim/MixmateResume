"use client";
import MenuBar from "@/app/(components)/global/MenuBar";
import ReduxProvider from "../lib/redux/provider";
import { usePathname } from "next/navigation";
import HomePage from "./HomePage";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import Footer from "./(components)/global/Footer";

function RootPage({ children }) {
  // Check if the current route is the home page
  const theme = createTheme({
    palette: {
      primary: {
        main: "#ACCEFF",
      },
      secondary: {
        main: "#FFFFFF",
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  if (usePathname() === "/") {
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

  // For all other routes, render the children normally
  return (
    <ReduxProvider>
      <ThemeProvider theme={theme}>
          <Box sx={{backgroundColor:"#E6FFFF"}}>
            <MenuBar />

            {children}
          </Box>
          <Footer />
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default RootPage;
