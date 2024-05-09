import React, { useEffect, useState } from "react";
import {
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { APPLICATION_PAGE, SEVERITY } from "@/app/_utilities/_client/constants";
import Recipe_Component from "../Recipe_Component";
import FilterRecipes_Component from "../FilterRecipes_Component";
import { useDispatch, useSelector } from "react-redux";
import { AlertColor } from "@mui/material/Alert";
import { Box, Pagination } from "@mui/material";
import { pageStateActions } from "lib/redux/pageStateSlice";
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
      showToastMessage("Error", error.message, SEVERITY.Warning);
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
        showToastMessage("Recipes found", response.message, SEVERITY.success);
        dispatch(pageStateActions.setPageLoadingState(false));
      }
    ).catch((error) => {
      showToastMessage("Error", error.message, SEVERITY.Warning);
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
      showToastMessage("Error", error.message, SEVERITY.Warning);
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
      showToastMessage("Error", error.message, SEVERITY.Warning);
      dispatch(pageStateActions.setPageLoadingState(false));
    });
  };
  useEffect(() => {
    loadFavoriteRecipes();
    loadRecipesCount();
  }, []);
  return (
    <>
      {/* Toast message */}
      <Snackbar
        open={openToastMessage}
        autoHideDuration={5000}
        onClose={() => setOpenToastMessage(false)}
      >
        <Alert severity={toast_severity}>
          <AlertTitle>{toast_title}</AlertTitle>
          {toast_message}
        </Alert>
      </Snackbar>

      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <FilterRecipes_Component
            recipeAllRecipes={allFavouriteRecipes}
            loadFilteredRecipes={loadFilteredFavouriteRecipes}
            setRecipesFiltered={setRecipesFiltered}
            showToastMessage={showToastMessage}
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
            showToastMessage={showToastMessage}
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
