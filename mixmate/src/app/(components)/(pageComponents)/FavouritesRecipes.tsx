import React, { useEffect, useState } from "react";
import {
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import { displayErrorSnackMessage, makeRequest } from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { APPLICATION_PAGE, SEVERITY } from "@/app/_utilities/_client/constants";
import Recipe_Component from "../Recipe_Component";
import FilterRecipes_Component from "../FilterRecipes_Component";
import { useDispatch, useSelector } from "react-redux";
import { Box, Pagination } from "@mui/material";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { useUser } from "@auth0/nextjs-auth0/client";
function Favourites() {
  // Toast Message
  const { user, error, isLoading } = useUser();
  const dispatch = useDispatch();
  // Variables
  const [pageIndex, setpageIndex] = useState(1);
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const [allFavouriteRecipes, setAllFavouriteRecipes] = useState([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [pageIndexCount, setPageIndexCount] = useState(0);
  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
  }>({ filter: "", criteria: "" });
  // Loading recipe options
  let loadFavoriteRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.get,
      { index: [pageIndex] },
      (response) => {
        setIsFilterApplied(false);

        setRecipesFiltered(response.data);
        setAllFavouriteRecipes(response.data);
        // Done
        dispatch(pageStateActions.setPageLoadingState(false));
      }
    ).catch((error) => {
      displayErrorSnackMessage(error, dispatch);
      dispatch(pageStateActions.setPageLoadingState(false));
    });
  };
  let onPageIndexChange = (e) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    if (!isFilterApplied) loadFavoriteRecipes(parseInt(e.target.innerText));
    else loadFilteredFavouriteRecipes();
    dispatch(pageStateActions.setPageLoadingState(false));
  };
  let loadFilteredFavouriteRecipes = () => {
    setIsFilterApplied(true);
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.favouritesByFilter,
      REQ_METHODS.get,
      { filter: filter.filter, criteria: filter.criteria, index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data);
        setIsFilterApplied(true);
        loadFilteredRecipesCount(filter.filter, filter.criteria);
        const toastMessageObject: ToastMessage = {
          open: true,
          title: "Recipes found",
          severity: SEVERITY.success,
          message: response.message,
        };        
        dispatch(pageStateActions.setToastMessage(toastMessageObject));        
        dispatch(pageStateActions.setPageLoadingState(false));
      }
    ).catch((error) => {
      displayErrorSnackMessage(error, dispatch);
      dispatch(pageStateActions.setPageLoadingState(false));
    });
  };
  let loadFilteredRecipesCount = (filter: string, criteria: string) => {
    makeRequest(
      API_ROUTES.favouriteFilteredCount,
      REQ_METHODS.get,
      {
        filter: filter,
        criteria: criteria,
      },
      (response) => {
        setPageIndexCount(Math.ceil(response.data / 5));
      }
    ).catch((error) => {      
      displayErrorSnackMessage(error, dispatch);
      dispatch(pageStateActions.setPageLoadingState(false));
    });
  };
  let loadRecipesCount = () => {
    makeRequest(
      API_ROUTES.favouriteCount,
      REQ_METHODS.get,
      { userid: user.sub },
      (response) => {
        setPageIndexCount(Math.ceil(response.data / 5));
      }
    ).catch((error) => {
      const toastMessageObject: ToastMessage = {
        open: true,
        message: error.message,
        severity: SEVERITY.Error,
        title: "Error",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
      dispatch(pageStateActions.setPageLoadingState(false));
    });
  };
  useEffect(() => {
    loadFavoriteRecipes();
    loadRecipesCount();
  }, []);
  return (
    <>
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <FilterRecipes_Component
            recipeAllRecipes={allFavouriteRecipes}
            loadFilteredRecipes={loadFilteredFavouriteRecipes}
            setRecipesFiltered={setRecipesFiltered}
            page="Favourite"
            filterCriteriaSetter={setFilter}
            filterCriteria={filter}
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
    </>
  );
}
export default Favourites;
