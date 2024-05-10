"use client";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "./_utilities/_client/constants";
import MenuBar from "./(components)/MenuBar";
import ReduxProvider from "../lib/redux/provider";
import { usePathname } from "next/navigation";
import HomePage from "./(components)/HomePage";
import { EdgeStoreProvider } from "lib/edgestore";
import { Box } from "@mui/material";

function RootPage({ children }) {
  // Check if the current route is the home page

  if (usePathname() === "/") {
    return (
      <ReduxProvider>
        <EdgeStoreProvider>
          <MenuBar />

          <HomePage />
        </EdgeStoreProvider>
      </ReduxProvider>
    );
  }

  // For all other routes, render the children normally
  return (
    <ReduxProvider>
      <EdgeStoreProvider>
        <Box bgcolor="#DFFFFE">
          <MenuBar />

          {children}
        </Box>
      </EdgeStoreProvider>
    </ReduxProvider>
  );
}

export default RootPage;
