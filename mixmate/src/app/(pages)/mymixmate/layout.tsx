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
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
const MyMixMate = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState(0);
  const { user, error, isLoading } = useUser();
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
    <>
      {/* SubMenu */}
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            backgroundColor: "#B8FFF9",
            borderTop: "divider",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            scrollButtons={true}
          >
            <Tab
              icon={<FavoriteIcon />}
              label="Favorites"
              onClick={() => {
                if (pathname !== APPLICATION_PAGE.favourites) {
                  dispatch(pageStateActions.setPageLoadingState(true));
                }
              }}
            />

            <Tab
              icon={<LiaCocktailSolid size={23} />}
              label="My Recipes"
              onClick={() => {
                if (pathname !== APPLICATION_PAGE.myRecipes) {
                  dispatch(pageStateActions.setPageLoadingState(true));
                }
              }}
            />

            <Tab
              icon={<FaEarthAmericas size={23} />}
              label="Community Recipes"
              onClick={() => {
                if (pathname !== APPLICATION_PAGE.social)
                  dispatch(pageStateActions.setPageLoadingState(true));
              }}
            />

            <Tab
              icon={<WineBarIcon />}
              label="My Ingredients"
              onClick={() => {
                if (pathname !== APPLICATION_PAGE.social)
                  dispatch(pageStateActions.setPageLoadingState(true));
              }}
            />
          </Tabs>
        </Box>
        {children}
      </Box>
    </>
  );
};

export default withPageAuthRequired(MyMixMate);
