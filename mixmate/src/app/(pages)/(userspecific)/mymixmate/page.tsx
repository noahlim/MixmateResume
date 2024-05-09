"use client";
import React, { useEffect, useState } from "react";
import DeckIcon from "@mui/icons-material/Deck";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { APPLICATION_PAGE, SEVERITY } from "@/app/_utilities/_client/constants";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Favourites from "@/app/(components)/(pageComponents)/FavouritesRecipes";
// import CustomRecipes from './CustomRecipes';
// import Social from './Social';
import FavoriteIcon from "@mui/icons-material/Favorite";
import WineBarIcon from "@mui/icons-material/WineBar";
import LiquorIcon from "@mui/icons-material/Liquor";
import { AlertColor } from "@mui/material/Alert";
import { useRouter } from "next/navigation";
import TestPage from "@/app/(components)/(pageComponents)/TestPage";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import CustomRecipes from "@/app/(components)/(pageComponents)/CustomRecipes";
import AddEditRecipe_Component from "@/app/(components)/AddEditRecipe_Component";
import SocialRecipes from "@/app/(components)/(pageComponents)/SocialRecipes";
import MyIngredients from "@/app/(components)/(pageComponents)/(userIngredients)/MyIngredients";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActions } from "lib/redux/userInfoSlice";

function MyMixMate() {
  // Validate session
  const { user, error, isLoading } = useUser();
  
  const router = useRouter();

  useEffect(() => {
    if (!userSession.isLoading && !user) {
      const tempSession = useUser();
      const dispatch = useDispatch();
      dispatch(userInfoActions.setUserInfo(tempSession));
      router.push(APPLICATION_PAGE.root);
    }
  }, [userSession, router]);

  // Tabs
  const [selectedTab, setSelectedTab] = useState(0);  
  return (
    <>
      {/* SubMenu */}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
          >
            <Tab icon={<FavoriteIcon />} label="Favorites" />
            <Tab icon={<WineBarIcon />} label="My Recipes" />
            <Tab icon={<DeckIcon />} label="Social" />
            <Tab icon={<LiquorIcon />} label="My Ingredients" />
          </Tabs>
        </Box>

        {/* Tabs content */}
        {selectedTab === 0 && <Favourites />}
        {selectedTab === 1 && <CustomRecipes />}
        {selectedTab === 2 && <SocialRecipes />}
        {selectedTab === 3 && <MyIngredients />}
      </Box>
    </>
  );
}

export default withPageAuthRequired(MyMixMate);
