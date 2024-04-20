import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  API_DRINK_ROUTES,
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
import { recipeActions } from "lib/redux/recipeSlice";
import { AlertColor } from "@mui/material/Alert";
import { Box, Pagination } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
function Favourites() {
  // Toast Message
  const [openToasMessage, setOpenToastMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>(
    SEVERITY.Info
  );
  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");
  const showToastMessage = (title, message, severity = SEVERITY.Info) => {
    setToast_severity(severity);
    setToast_title(title);
    setToast_message(message);
    setOpenToastMessage(true);
  };
  const { user, error, isLoading } = useUser();
  // Variables
  const [loadingPage, setLoadingPage] = useState(true);
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
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.get,
      { index: [pageIndex] },
      (response) => {
        setIsFilterApplied(false);

        setRecipesFiltered(response.data);
        setAllFavouriteRecipes(response.data);
        // Done
        setLoadingPage(false);
      }
    );
  };
  let onPageIndexChange = (e) => {
    setLoadingPage(true);
    if (!isFilterApplied) loadFavoriteRecipes(parseInt(e.target.innerText));
    else loadFilteredFavouriteRecipes();
    setLoadingPage(false);
  };
  let loadFilteredFavouriteRecipes = () => {
    setIsFilterApplied(true);
    setLoadingPage(true);
    makeRequest(
      API_ROUTES.favouritesByFilter,
      REQ_METHODS.get,
      { filter: filter.filter, criteria: filter.criteria, index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data);
        setIsFilterApplied(true);
          loadFilteredRecipesCount(filter.filter, filter.criteria);
        showToastMessage(
          "Recipes found",
          response.message,
          SEVERITY.success
        );
        setLoadingPage(false);
      }
    );
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
        console.log(response);
        setPageIndexCount(Math.ceil(response.data / 5));
      }
    );
  };
  let loadRecipesCount = () => {
    makeRequest(
      API_ROUTES.favouriteCount,
      REQ_METHODS.get,
      { userid: user.sub },
      (response) => {
        setPageIndexCount(Math.ceil(response.data / 5));
      }
    );
  };
  useEffect(() => {
    loadFavoriteRecipes();
    loadRecipesCount();
  }, []);
  return (
    <>
      {/* Toast message */}
      <Snackbar
        open={openToasMessage}
        autoHideDuration={5000}
        onClose={() => setOpenToastMessage(false)}
      >
        <Alert severity={toast_severity}>
          <AlertTitle>{toast_title}</AlertTitle>
          {toast_message}
        </Alert>
      </Snackbar>

      {/* Loading */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

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
            setLoadingPage={setLoadingPage}
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
