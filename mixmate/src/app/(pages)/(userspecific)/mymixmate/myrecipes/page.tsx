"use client";
import React, { useEffect, useState } from "react";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { CardContent, Pagination, Box } from "@mui/material";
import Button from "@mui/material/Button";

import {
  APPLICATION_PAGE,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import Recipe_Component from "@/app/(components)/Recipe_Component";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import FilterCustomRecipesComponent from "@/app/(components)/FilterCustomRecipesComponent";
import { useDispatch, useSelector } from "react-redux";
import AddEditRecipe_Component from "@/app/(components)/AddEditRecipe_Component";
import { pageStateActions } from "lib/redux/pageStateSlice";
import MarqueeScroll from "@/app/(components)/MarqueeAnimation";
import { ToastMessage } from "interface/toastMessage";
import MyMixMateHeader from "@/app/(components)/MyMixMateHeader";

function MyRecipes() {
  const { user, error, isLoading } = useUser();
  const dispatch = useDispatch();
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const [pageIndex, setPageIndex] = useState(1);

  
  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
    isFilterApplied: boolean;
  }>({ filter: "", criteria: "", isFilterApplied: false });

  // Variables
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );

  let onPageIndexChange = (e) => {
  
    const buttonLabel = e.currentTarget.getAttribute("aria-label");  
    dispatch(pageStateActions.setPageLoadingState(true));
  
    if (buttonLabel === "Go to next page" || pageIndex < pageIndexCount) {
      setPageIndex(pageIndex + 1);
      loadMyRecipes(pageIndex + 1);
    } else if (buttonLabel === "Go to previous page" || pageIndex > 1) {
      setPageIndex(pageIndex - 1);
      loadMyRecipes(pageIndex - 1);
    } else if (e.target.innerText) {
      const index = parseInt(e.target.innerText);
      setPageIndex(index);
      if (!filter.isFilterApplied) {
        loadMyRecipes(index);
      } else {
        loadFilteredMyRecipes(index);
      }
    } else {
      alert("Invalid page index");
    }
  };
  let loadMyRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.get,
      { userid: user?.sub, index: pageIndex, publicflag: false  },
      (response) => {
        setRecipesFiltered(response.data.recipes);
        setPageIndexCount(Math.ceil(response.data.length / 5));
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };

  let loadFilteredMyRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.sharedRecipesFilter,
      REQ_METHODS.get,
      { filter: filter.filter, criteria: filter.criteria, index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data.recipes);
        setPageIndexCount(Math.ceil(response.data.length / 5));
        setPageIndex(pageIndex);
        setFilter({ ...filter, isFilterApplied: true });
        const toastMessageObject: ToastMessage = {
          title: "Recipes found",
          message: response.message,
          severity: SEVERITY.success,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };

  const clearFilter = () => {
    setFilter({ filter: "", criteria: "", isFilterApplied: false });
    setPageIndex(1);
    loadMyRecipes();
  };

  useEffect(() => {
    loadMyRecipes();
    window.scrollTo(0, 0);
  }, []);

  // Add edit recipes
  const [openAddEditRecipeModal, setOpenAddEditRecipemodal] = useState(false);
  const [selectedRecipeIdAddEdit, setSelectedRecipeIdAddEdit] = useState(null);
  let modalAddEditRecipe_onOpen = (selectedRecipeId) => {
    setSelectedRecipeIdAddEdit(selectedRecipeId);
    setOpenAddEditRecipemodal(true);
  };
  let modalAddEditRecipe_onClose = () => {
    setSelectedRecipeIdAddEdit(null);
    setOpenAddEditRecipemodal(false);
  };

  return (
    <>
      {/* Add new recipe modal */}
      <AddEditRecipe_Component
        openModal={openAddEditRecipeModal}
        closeModal={modalAddEditRecipe_onClose}
        reloadPage={loadMyRecipes}
        recipeId={selectedRecipeIdAddEdit}
      />

      {/* Page body */}
      <MyMixMateHeader title="My Recipes">
        Explore your very own culinary canvas, a sanctuary where your inspired
        creations take center stage, allowing you to meticulously refine and
        perfect each recipe before unveiling your masterpieces to the world,
        leaving an indelible mark on the palates of fellow epicureans
      </MyMixMateHeader>
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <Paper elevation={3} style={{ margin: 15 }}>
            <CardContent
              style={{ textAlign: "center", paddingTop: 25, paddingBottom: 25 }}
            >
              <Button
                onClick={() => modalAddEditRecipe_onOpen(null)}
                color="success"
                variant="outlined"
                startIcon={<NightlifeIcon />}
                style={{ marginLeft: 7 }}
              >
                Add a new recipe
              </Button>
            </CardContent>
          </Paper>

          <FilterCustomRecipesComponent
            recipeAllRecipes={recipeAllRecipes}
            loadFilteredRecipes={loadFilteredMyRecipes}
            setRecipesFiltered={setRecipesFiltered}
            filterCriteriaSetter={setFilter}
            filterCriteria={filter}
            onFilterClear={clearFilter}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Recipe_Component
            applicationPage={APPLICATION_PAGE.myRecipes}
            title="My MixMate Recipes"
            recipes={recipesFiltered}
            reloadRecipes={loadMyRecipes}
            recipeCategories={categories}
            recipeAlcoholicTypes={alcoholicTypes}
            recipeGlasses={glasses}
          />
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={4} // Margin top of 4 (adjust as needed)
      >
        <Pagination
          count={pageIndexCount}
          defaultPage={1}
          boundaryCount={10}
          onChange={onPageIndexChange}
          page={pageIndex}
        />
      </Box>
      <MarqueeScroll direction="left" />
    </>
  );
}

export default withPageAuthRequired(MyRecipes);
