"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { Pagination, Box, CardContent, Paper, Button } from "@mui/material";
import {
  APPLICATION_PAGE,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import NightlifeIcon from "@mui/icons-material/Nightlife";
import Recipe_Component from "@/app/(components)/Recipe_Component";
import FilterRecipesComponent from "@/app/(components)/FilterRecipesComponent";
import { useDispatch, useSelector } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import MarqueeAnimation from "@/app/(components)/(shapeComponents)/MarqueeAnimation";
import MyMixMateHeader from "@/app/(components)/MyMixMateHeader";
import AddEditRecipe_Component from "@/app/(components)/AddEditRecipe_Component";

function CustomRecipes() {
  const dispatch = useDispatch();
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);

  const { user, error, isLoading } = useUser();
  const [pageIndex, setPageIndex] = useState(1);

  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
    isFilterApplied: boolean;
    isMyRecipes: boolean;
  }>({ filter: "", criteria: "", isFilterApplied: false, isMyRecipes: false });

  // Variables
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const [pageIndexCount, setPageIndexCount] = useState(1);

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

  let loadMyRecipes = (pageIndex = 1) => {
    if (pageIndex === 1) {
      setFilter({ ...filter, isMyRecipes: true });
    }
    dispatch(pageStateActions.setPageLoadingState(true));
    if (filter.isFilterApplied) {
      loadFilteredMyRecipes(pageIndex);
      return;
    } else
      makeRequest(
        API_ROUTES.recipeShare,
        REQ_METHODS.get,
        { userid: user.sub, index: pageIndex, publicflag: true },
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

  const handleCurateMyRecipes = () => {
    setFilter({ ...filter, isMyRecipes: true });
    loadMyRecipes();
  };
  const clearFilter = () => {
    setFilter({
      filter: "",
      criteria: "",
      isFilterApplied: false,
      isMyRecipes: false,
    });
    loadSocialRecipes();
  };

  const loadRecipes = (newPageIndex) => {
    if (!filter.isFilterApplied) {
      if (filter.isMyRecipes) loadMyRecipes(newPageIndex);
      else loadSocialRecipes(newPageIndex);
    } else {
      if (filter.isMyRecipes) loadFilteredMyRecipes(newPageIndex);
      else loadFilteredSocialRecipes(newPageIndex);
    }
  };

  let loadFilteredMyRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.sharedRecipesFilter,
      REQ_METHODS.get,
      {
        filter: filter.filter,
        criteria: filter.criteria,
        index: pageIndex,
        userid: user.sub,
      },
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

  let onPageIndexChange = (e) => {
    const buttonLabel = e.currentTarget.getAttribute("aria-label");
    let newPageIndex = pageIndex;

    if (buttonLabel === "Go to next page" && pageIndex < pageIndexCount) {
      newPageIndex = pageIndex + 1;
    } else if (buttonLabel === "Go to previous page" && pageIndex > 1) {
      newPageIndex = pageIndex - 1;
    } else if (buttonLabel === "Go to first page" && pageIndex > 1) {
      newPageIndex = 1;
    } else if (
      buttonLabel === "Go to last page" &&
      pageIndex < pageIndexCount
    ) {
      newPageIndex = pageIndexCount;
    } else if (e.target.innerText) {
      const index = parseInt(e.target.innerText);
      if (!isNaN(index)) {
        newPageIndex = index;
      } else {
        alert("Invalid page index");
        return;
      }
    }

    setPageIndex(newPageIndex);
    loadRecipes(newPageIndex);
  };
  let loadSocialRecipes = useCallback((pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.get,
      { index: pageIndex, publicflag: true },
      (response) => {
        setRecipesFiltered(response.data.recipes);
        setPageIndexCount(Math.ceil(response.data.length / 5));
        setPageIndex(pageIndex);
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
    //eslint-disable-next-line
  },[]);

  let loadFilteredSocialRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    setPageIndex(pageIndex);

    makeRequest(
      API_ROUTES.sharedRecipesFilter,
      REQ_METHODS.get,
      { filter: filter.filter, criteria: filter.criteria, index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data.recipes);
        setPageIndexCount(Math.ceil(response.data.length / 5));
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
  }
  // Loading recipe options

  useEffect(() => {
    
    loadSocialRecipes();
    window.scrollTo(0, 0);
  }, [loadSocialRecipes]);

  return (
    <>
      {/* Add new recipe modal */}
      <AddEditRecipe_Component
        openModal={openAddEditRecipeModal}
        closeModal={modalAddEditRecipe_onClose}
        reloadPage={loadMyRecipes}
        recipeId={selectedRecipeIdAddEdit}
        applicationPage={APPLICATION_PAGE.social}
      />
      <MyMixMateHeader title="Community Recipes">
        Embark on a culinary voyage of discovery through our vibrant community,
        where creative minds converge to share their inspired recipes, fostering
        a dynamic exchange of gastronomic artistry that transcends boundaries
        and ignites a passion for culinary innovation.
      </MyMixMateHeader>
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} lg={3}>
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
          <FilterRecipesComponent
            recipeAllRecipes={recipeAllRecipes}
            loadFilteredRecipes={loadFilteredSocialRecipes}
            setRecipesFiltered={setRecipesFiltered}
            filterCriteriaSetter={setFilter}
            filterCriteria={filter}
            onFilterClear={clearFilter}
            applicationPage={APPLICATION_PAGE.social}
            loadMyRecipes={handleCurateMyRecipes}
          />
        </Grid>
        <Grid item xs={12} lg={9}>
          <Recipe_Component
            applicationPage={APPLICATION_PAGE.social}
            title="My MixMate Recipes"
            recipes={recipesFiltered}
            reloadRecipes={loadSocialRecipes}
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
              backgroundColor: "#FFFFFF",
              marginBottom: 1,
            },
          }}
        />
      </Box>
      <MarqueeAnimation direction="left" />
    </>
  );
}

export default withPageAuthRequired(CustomRecipes);
