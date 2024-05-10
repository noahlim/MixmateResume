"use client";
import React, { useEffect, useState } from "react";
import DeckIcon from "@mui/icons-material/Deck";
import { useUser } from "@auth0/nextjs-auth0/client";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Favourites from "@/app/(components)/(pageComponents)/FavouritesRecipes";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WineBarIcon from "@mui/icons-material/WineBar";
import LiquorIcon from "@mui/icons-material/Liquor";
import { useRouter } from "next/navigation";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import CustomRecipes from "@/app/(components)/(pageComponents)/CustomRecipes";
import SocialRecipes from "@/app/(components)/(pageComponents)/SocialRecipes";
import MyIngredients from "@/app/(components)/(pageComponents)/(userIngredients)/MyIngredients";

function MyMixMate() {
  // Validate session
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(APPLICATION_PAGE.root);
    }
  }, [isLoading, user, router]);

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
