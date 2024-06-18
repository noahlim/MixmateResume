"use client";
import React, { useEffect, useState } from "react";
import { API_ROUTES, REQ_METHODS } from "@/app/_utilities/_client/constants";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
import Recipe_Component from "@/app/(components)/Recipe_Component";
import FilterRecipesComponent from "@/app/(components)/FilterRecipesComponent";
import { useDispatch} from "react-redux";
import { Box, Pagination, Typography } from "@mui/material";
import { pageStateActions } from "lib/redux/pageStateSlice";
import MarqueeAnimation from "@/app/(components)/(shapeComponents)/MarqueeAnimation";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

function Favourites() {
  const dispatch = useDispatch();
  // Variables
  const [recipesFiltered, setRecipesFiltered] = useState([]);
  const [recipesFilteredToBeDisplayed, setRecipesFilteredToBeDisplayed] =
    useState([]);
  const [allFavoriteRecipes, setAllFavouriteRecipes] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const [pageIndex, setPageIndex] = useState(1);

  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
  }>({ filter: "", criteria: "" });
  const clearFilters = () => {
    setRecipesFilteredToBeDisplayed(allFavoriteRecipes.slice(0, 5));
    setPageIndexCount(Math.ceil(allFavoriteRecipes.length / 5));
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

        setRecipesFilteredToBeDisplayed(response.data.recipes);
        setRecipesFiltered(response.data.allRecipes);
        setAllFavouriteRecipes(response.data.allRecipes);
        setPageIndexCount(Math.ceil(response.data.allRecipes.length / 5));
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
    if (isFilterApplied)
      setRecipesFilteredToBeDisplayed(
        recipesFiltered.slice((newPageIndex - 1) * 5, newPageIndex * 5)
      );
    else
      setRecipesFilteredToBeDisplayed(
        allFavoriteRecipes.slice((newPageIndex - 1) * 5, newPageIndex * 5)
      );
  };

  let onPageIndexChange = (e) => {
    const buttonLabel = e.currentTarget.getAttribute("aria-label");

    if (buttonLabel === "Go to next page" && pageIndex < pageIndexCount) {
      handlePageChange(pageIndex + 1);
    } else if (buttonLabel === "Go to previous page" && pageIndex > 1) {
      handlePageChange(pageIndex - 1);
    }else if(buttonLabel === "Go to first page" && pageIndex > 1){
      handlePageChange(1);
    } else if(buttonLabel === "Go to last page" && pageIndex < pageIndexCount){
      handlePageChange(pageIndexCount);
    } else if (e.target.innerText) {
      const index = parseInt(e.target.innerText);
      handlePageChange(index);
    } else {
      alert("Invalid page index");
    }
  };

  let loadFilteredFavouriteRecipes = (pageIndex) => {
    setIsFilterApplied(true);
    dispatch(pageStateActions.setPageLoadingState(true));
    if (!allFavoriteRecipes || allFavoriteRecipes.length === 0) {
      loadFavoriteRecipes();
      dispatch(pageStateActions.setPageLoadingState(true));
      return;
    }
    let filteredRecipes = allFavoriteRecipes.filter((recipe) => {
      if (filter.filter === "Category") {
        return recipe.strCategory === filter.criteria;
      } else if (filter.filter === "Alcoholic") {
        return recipe.strAlcoholic === filter.criteria;
      } else if (filter.filter === "Glass") {
        return recipe.strGlass === filter.criteria;
      } else if (filter.filter === "Ingredient") {
        return recipe.ingredients.some(
          (ing) =>
            ing.ingredient.toLowerCase().includes(filter.criteria.toLowerCase()) 
        );
      } else {
        return recipe.strDrink
          .toLowerCase()
          .includes(filter.criteria.toLowerCase());
      }
    });
    setRecipesFiltered(filteredRecipes);
    setPageIndex(1);
    setPageIndexCount(Math.ceil(filteredRecipes.length / 5));
    setRecipesFilteredToBeDisplayed(filteredRecipes.slice(0, 5));
    dispatch(pageStateActions.setPageLoadingState(false));    
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
      <MarqueeAnimation direction="right" />
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <FilterRecipesComponent
            recipeAllRecipes={allFavoriteRecipes}
            loadFilteredRecipes={loadFilteredFavouriteRecipes}
            setRecipesFiltered={setRecipesFilteredToBeDisplayed}
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
            recipes={recipesFilteredToBeDisplayed}
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
          page={pageIndex}
          showFirstButton
          showLastButton
          color="primary"
          disabled={pageIndexCount === 1}
          onChange={onPageIndexChange}
          sx={{
            "& .MuiPaginationItem-root": {
              backgroundColor:"#FFFFFF",
              marginBottom: 1
            },
          }}
        />
      </Box>
      <MarqueeAnimation direction="left" />
    </>
  );
}
export default Favourites;
