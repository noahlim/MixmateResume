"use client";
import Fallback from "@/app/(components)/global/Fallback";
import { Suspense } from "react";
import PreloadedRecipes from "@/app/(components)/(pageComponents)/PreloadedRecipesPage";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
import MenuBar from "@/app/(components)/global/MenuBar";
import Footer from "@/app/(components)/global/Footer";
import { ThemeProvider, createTheme } from "@mui/material";
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

function RecipePage() {
  return (
    <ReduxProvider>
      <ThemeProvider theme={theme}>
        <MenuBar />
        <Suspense fallback={<Fallback />}>
          <PreloadedRecipes applicationPage={APPLICATION_PAGE.recipes} />
        </Suspense>
        <Footer />
      </ThemeProvider>
    </ReduxProvider>
  );
}

export default RecipePage;
