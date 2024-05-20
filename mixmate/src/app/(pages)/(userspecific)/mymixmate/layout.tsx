"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WineBarIcon from "@mui/icons-material/WineBar";
import Link from "next/link";
import Transition from "./transition";

const MyMixMate = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(() => {
    switch (pathname) {
      case APPLICATION_PAGE.favourites:
        return 0;
      case APPLICATION_PAGE.myRecipes:
        return 1;
      case APPLICATION_PAGE.social:
        return 2;
      case APPLICATION_PAGE.myIngredients:
        return 3;
      default:
        return 0;
    }
  });

  const handleTabChange = (event, newValue) => {
    const routes = {
      0: APPLICATION_PAGE.favourites,
      1: APPLICATION_PAGE.myRecipes,
      2: APPLICATION_PAGE.social,
      3: APPLICATION_PAGE.myIngredients,
    };
    router.push(routes[newValue]);
    setSelectedTab(newValue);
  };

  return (
    <>
      {/* SubMenu */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Link href={APPLICATION_PAGE.favourites}>
              <Tab icon={<FavoriteIcon />} label="Favorites" />
            </Link>
            <Link href={APPLICATION_PAGE.myRecipes}>
              <Tab icon={<WineBarIcon />} label="My Recipes" />
            </Link>
            <Link href={APPLICATION_PAGE.social}>
              <Tab icon={<FavoriteIcon />} label="Social Recipes" />
            </Link>
            <Link href={APPLICATION_PAGE.myIngredients}>
              <Tab icon={<WineBarIcon />} label="My Ingredients" />
            </Link>
          </Tabs>
        </Box>
        <Transition>{children}</Transition>
      </Box>
    </>
  );
};

export default MyMixMate;