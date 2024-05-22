"use client";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "./_utilities/_client/constants";
import MenuBar from "./(components)/MenuBar";
import ReduxProvider from "../lib/redux/provider";
import { usePathname } from "next/navigation";
import HomePage from "./(components)/HomePage";
import { Box, ThemeProvider, createTheme } from "@mui/material";

function RootPage({ children }) {
  // Check if the current route is the home page
  const theme = createTheme({
    palette: {
      primary: {
        main: "#489FB5",
      },
      secondary: {
        main: "#F3E3FF",
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
        </ThemeProvider>
      </ReduxProvider>
    );
  }

  // For all other routes, render the children normally
  return (
    <ReduxProvider>
      <ThemeProvider theme={theme}>
          <Box>
            <MenuBar />

            {children}
          </Box>
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default RootPage;
