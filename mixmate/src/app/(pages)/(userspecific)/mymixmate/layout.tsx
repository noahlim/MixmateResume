"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WineBarIcon from "@mui/icons-material/WineBar";
import Link from "next/link";
import { LiaCocktailSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import { pageStateActions } from "@lib/redux/pageStateSlice";
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
    <>
      {/* SubMenu */}
      <Box sx={{ width: "100%" }}>
        {/* <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Link href={APPLICATION_PAGE.favourites}>
              <Tab icon={<FavoriteIcon />} label="Favorites" />
            </Link>
            <Link href={APPLICATION_PAGE.myRecipes}>
              <Tab icon={<LiaCocktailSolid />} label="My Recipes" />
            </Link>
            <Link href={APPLICATION_PAGE.social}>
              <Tab icon={<FavoriteIcon />} label="Social Recipes" />
            </Link>
            <Link href={APPLICATION_PAGE.myIngredients}>
              <Tab icon={<WineBarIcon />} label="My Ingredients" />
            </Link>
          </Tabs>
        </Box> */}
        {children}
      </Box>
    </>
  );
};

export default MyMixMate;
