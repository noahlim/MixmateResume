"use client";
import React, { useEffect, useState } from "react";
import { API_ROUTES, REQ_METHODS } from "@/app/_utilities/_client/constants";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { APPLICATION_PAGE, SEVERITY } from "@/app/_utilities/_client/constants";
import Recipe_Component from "@/app/(components)/Recipe_Component";
import FilterRecipesComponent from "@/app/(components)/FilterRecipesComponent";
import { useDispatch, useSelector } from "react-redux";
import { Box, Pagination, Typography } from "@mui/material";
import { pageStateActions } from "lib/redux/pageStateSlice";
import MarqueeScroll from "@/app/(components)/MarqueeAnimation";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

function Favourites() {
  const dispatch = useDispatch();
  // Variables
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const [allFavouriteRecipes, setAllFavouriteRecipes] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [pageIndexCount, setPageIndexCount] = useState(0);
  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
  }>({ filter: "", criteria: "" });
  const clearFilters = () => {
    setRecipesFiltered(allFavouriteRecipes.slice(0, 5));
    setPageIndexCount(Math.ceil(allFavouriteRecipes.length / 5));
  };
  // Loading recipe options
  let loadFavoriteRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.get,
      { index: [pageIndex] },
      (response) => {
        setIsFilterApplied(false);

        setRecipesFiltered(response.data.recipes);
        setAllFavouriteRecipes(response.data.allRecipes);
        setPageIndexCount(Math.ceil(allFavouriteRecipes.length / 5));
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };
  let onPageIndexChange = (e) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    const index = parseInt(e.target.innerText);
    if (!isFilterApplied) loadFavoriteRecipes(index);
    else loadFilteredFavouriteRecipes(index);
    dispatch(pageStateActions.setPageLoadingState(false));
  };
  let loadFilteredFavouriteRecipes = (pageIndex) => {
    setIsFilterApplied(true);
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.favouritesByFilter,
      REQ_METHODS.get,
      { filter: filter.filter, criteria: filter.criteria, index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data.recipes);
        setIsFilterApplied(true);
        //loadFilteredRecipesCount(filter.filter, filter.criteria);
        setPageIndexCount(Math.ceil(response.data.length / 5));

        dispatch(pageStateActions.setPageLoadingState(false));
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };
  useEffect(() => {
    loadFavoriteRecipes();
  }, []);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#FFFFFF",
          padding: { xs: "30px 0px", md: "80px 0px" },
        }}
        justifyContent="center"
        alignContent="center"
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{ padding: "20px" }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography variant="h3" className={spaceGrotesk.className}>
              Favorites
            </Typography>
          </Grid>

          <Grid item xs={12} md={8} textAlign="center">
            <Typography className={spaceGrotesk.className}>
              The Favorites page is your personal collection where you can store
              and access your most beloved recipes with ease, ensuring that your
              culinary treasures are always within reach whenever the craving
              strikes.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <MarqueeScroll direction="right" />
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <FilterRecipesComponent
            recipeAllRecipes={allFavouriteRecipes}
            loadFilteredRecipes={loadFilteredFavouriteRecipes}
            setRecipesFiltered={setRecipesFiltered}
            filterCriteriaSetter={setFilter}
            filterCriteria={filter}
            onFilterClear={clearFilters}
            applicationPage={APPLICATION_PAGE.favourites}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Recipe_Component
            applicationPage={APPLICATION_PAGE.favourites}
            title="My Favourite Recipes"
            recipes={recipesFiltered}
            reloadRecipes={loadFavoriteRecipes}
          />
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={4}
      >
        <Pagination
          shape="rounded"
          variant="outlined"
          count={pageIndexCount}
          defaultPage={6}
          siblingCount={0}
          boundaryCount={2}
          onChange={onPageIndexChange}
        />
      </Box>
      <MarqueeScroll direction="left" />
    </>
  );
}
export default Favourites;
