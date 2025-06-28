"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WineBarIcon from "@mui/icons-material/WineBar";
import { FaEarthAmericas } from "react-icons/fa6";
import { LiaCocktailSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { pageStateActions } from "@lib/redux/pageStateSlice";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
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

const MyMixMate = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    switch (pathname) {
      case APPLICATION_PAGE.favourites:
        setSelectedTab(0);
        break;
      case APPLICATION_PAGE.myRecipes:
        setSelectedTab(1);
        break;
      case APPLICATION_PAGE.social:
        setSelectedTab(2);
        break;
      case APPLICATION_PAGE.myIngredients:
        setSelectedTab(3);
        break;
      default:
        setSelectedTab(0);
    }
  }, [pathname]);

  const handleTabChange = (event, newValue) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    const routes = {
      0: APPLICATION_PAGE.favourites,
      1: APPLICATION_PAGE.myRecipes,
      2: APPLICATION_PAGE.social,
      3: APPLICATION_PAGE.myIngredients,
    };
    router.push(routes[newValue]);
  };

  return (
    <ReduxProvider>
      <ThemeProvider theme={theme}>
        <MenuBar />
        {/* SubMenu */}
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{
              borderRadius: 3,
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              px: 2,
              py: 1,
              display: "inline-block",
              minWidth: 340,
            }}
          >
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              scrollButtons={true}
              variant="scrollable"
              TabIndicatorProps={{
                style: {
                  display: "none",
                },
              }}
              sx={{
                ".MuiTab-root": {
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1rem",
                  borderRadius: 2,
                  px: 2,
                  mx: 0.5,
                  transition: "background 0.2s, color 0.2s",
                },
                ".Mui-selected": {
                  color: "#1a1a2e",
                  background: "#ffd700",
                  borderRadius: 99,
                  boxShadow: "0 2px 8px rgba(255,215,0,0.12)",
                },
              }}
            >
              <Tab icon={<FavoriteIcon />} label="Favorites" />
              <Tab icon={<LiaCocktailSolid size={23} />} label="My Recipes" />
              <Tab
                icon={<FaEarthAmericas size={23} />}
                label="Community Recipes"
              />
              <Tab icon={<WineBarIcon />} label="My Ingredients" />
            </Tabs>
          </Box>
        </Box>
        {children}
        <Footer />
      </ThemeProvider>
    </ReduxProvider>
  );
};

export default withPageAuthRequired(MyMixMate);
