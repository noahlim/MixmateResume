'use client';
import React, { useEffect, useState } from "react";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { Pagination, Box } from "@mui/material";
import {
  APPLICATION_PAGE,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
  API_DRINK_ROUTES,
} from "@/app/_utilities/_client/constants";
import Recipe_Component from "@/app/(components)/Recipe_Component";
import FilterRecipes_Component from "@/app/(components)/FilterRecipes_Component";
import { useDispatch, useSelector } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import MarqueeScroll from "@/app/(components)/MarqueeAnimation";

function CustomRecipes() {
  const dispatch = useDispatch();
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const [pageIndex, setpageIndex] = useState(1);

  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
  }>({ filter: "", criteria: "" });

  // Variables
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );

  let onPageIndexChange = (e) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    loadSocialRecipes(parseInt(e.target.innerText));
  };
  let loadSocialRecipes = (pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.get,
      { index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data);
        loadRecipesCount();
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

  let loadFilteredMyRecipes = () => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.sharedRecipesFilter,
      REQ_METHODS.get,
      { filter: filter.filter, criteria: filter.criteria, index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data);
        loadFilteredRecipesCount(filter.filter, filter.criteria);
        const toastMessageObject: ToastMessage = {
          open: true,
          message: response.message,
          severity: SEVERITY.success,
          title: "Recipes found",
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
  let loadFilteredRecipesCount = (filter: string, criteria: string) => {
    makeRequest(
      API_ROUTES.favouriteFilteredCount,
      REQ_METHODS.get,
      {
        filter: filter,
        criteria: criteria,
      },
      (response) => {
        setPageIndexCount(Math.ceil(response.data / 10));
      }
    ).catch((error) => {
      displayErrorSnackMessage(error, dispatch);
    }).finally(() => {
      dispatch(pageStateActions.setPageLoadingState(false));
    });
  };

  // Loading recipe options
  let loadRecipesCount = () => {
    makeRequest(
      API_ROUTES.sharedRecipesCount,
      REQ_METHODS.get,
      {},
      (response) => {
        setPageIndexCount(Math.ceil(response.data / 10));
      }
    ).catch((error) => {
      displayErrorSnackMessage(error, dispatch);
      dispatch(pageStateActions.setPageLoadingState(false));
    });
  };

  useEffect(() => {
    loadSocialRecipes();
    loadRecipesCount();
  }, []);

  return (
    <>
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <FilterRecipes_Component
            recipeAllRecipes={recipeAllRecipes}
            loadFilteredRecipes={loadFilteredMyRecipes}
            setRecipesFiltered={setRecipesFiltered}
            filterCriteriaSetter={setFilter}
            filterCriteria={filter}
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
          shape="rounded"
          variant="outlined"
          count={pageIndexCount}
          defaultPage={6}
          siblingCount={0}
          boundaryCount={2}
          onChange={onPageIndexChange}
        />
      </Box>
      <MarqueeScroll/>
    </>
  );
}

export default withPageAuthRequired(CustomRecipes);
