"use client";
import React, { useEffect, useState } from "react";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { Pagination, Box, Typography, CardContent, Paper } from "@mui/material";
import {
  APPLICATION_PAGE,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import Recipe_Component from "@/app/(components)/Recipe_Component";
import FilterRecipesComponent from "@/app/(components)/FilterRecipesComponent";
import { useDispatch, useSelector } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { useUser, withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import MarqueeScroll from "@/app/(components)/MarqueeAnimation";
import MyMixMateHeader from "@/app/(components)/MyMixMateHeader";

function CustomRecipes() {
  const dispatch = useDispatch();
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);

  const { user, error, isLoading } = useUser();
  const [pageIndex, setPageIndex] = useState(1);

  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
    isFilterApplied: boolean;
    isMyRecipes: boolean;
  }>({ filter: "", criteria: "", isFilterApplied: false, isMyRecipes:false });

  // Variables
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );

  let loadMyRecipes = (pageIndex = 1) => {
    console.log(pageIndex);
    dispatch(pageStateActions.setPageLoadingState(true));
    dispatch(pageStateActions.setToastMessage({
      open: true,
      message: pageIndex.toString(),
      severity: SEVERITY.success,
      title: "test",
    }));
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

  const clearFilter = () => {
    setFilter({ filter: "", criteria: "", isFilterApplied: false, isMyRecipes:false });
    loadSocialRecipes();
  };

  let onPageIndexChange = (e) => {
    const buttonLabel = e.currentTarget.getAttribute("aria-label");   
    dispatch(pageStateActions.setPageLoadingState(true));

    if (buttonLabel === "Go to next page" || pageIndex < pageIndexCount) {
      setPageIndex(pageIndex + 1);
      loadSocialRecipes(pageIndex + 1);
    } else if (buttonLabel === "Go to previous page" || pageIndex > 1) {
      setPageIndex(pageIndex - 1);
      loadSocialRecipes(pageIndex - 1);
    } else if (e.target.innerText) {
      const index = parseInt(e.target.innerText);
      setPageIndex(index);
      if (!filter.isFilterApplied) {
        loadMyRecipes(index);
      } else {
        if(filter.isMyRecipes){
          loadMyRecipes(index);
        }else
        loadFilteredSocialRecipes(index);
      }
    } else {
      alert("Invalid page index");
    }

  };
  let loadSocialRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.get,
      { index: pageIndex, publicflag:true },
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

  let loadFilteredSocialRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));

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
  };
  // Loading recipe options

  useEffect(() => {
    loadSocialRecipes();
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <MyMixMateHeader title="Community Recipes">
        Embark on a culinary voyage of discovery through our vibrant community,
        where creative minds converge to share their inspired recipes, fostering
        a dynamic exchange of gastronomic artistry that transcends boundaries
        and ignites a passion for culinary innovation.
      </MyMixMateHeader>
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <FilterRecipesComponent
            recipeAllRecipes={recipeAllRecipes}
            loadFilteredRecipes={loadFilteredSocialRecipes}
            setRecipesFiltered={setRecipesFiltered}
            filterCriteriaSetter={setFilter}
            filterCriteria={filter}
            onFilterClear={clearFilter}
            applicationPage={APPLICATION_PAGE.social}
            loadMyRecipes={loadMyRecipes}
          />       
        </Grid>
        <Grid item xs={12} sm={9}>
          <Recipe_Component
            applicationPage={APPLICATION_PAGE.social}
            title="My MixMate Recipes"
            recipes={recipesFiltered}
            reloadRecipes={loadSocialRecipes}
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
        margin={4}
      >
        <Pagination
          count={pageIndexCount}
          defaultPage={6}
          siblingCount={0}
          boundaryCount={2}
          page={pageIndex}
          onChange={onPageIndexChange}
        />
      </Box>
      <MarqueeScroll direction="left" />
    </>
  );
}

export default withPageAuthRequired(CustomRecipes);
