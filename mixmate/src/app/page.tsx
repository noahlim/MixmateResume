"use client";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "./_utilities/_client/constants";
import MenuBar from "./(components)/MenuBar";
import ReduxProvider from "../lib/redux/provider";
import { usePathname } from "next/navigation";
import HomePage from "./(components)/HomePage";
import { EdgeStoreProvider } from "lib/edgestore";
import { Backdrop, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";

function RootPage({ children }) {
  const loadingPage = useSelector(
    (state: any) => state.pageState.isLoading
  );

  // Check if the current route is the home page


  if (usePathname() === "/") {
    return (
      <ReduxProvider>
        <EdgeStoreProvider>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loadingPage}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
        <MenuBar />

        {children}
      </EdgeStoreProvider>
    </ReduxProvider>
  );
}

export default RootPage;
