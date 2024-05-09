import React, { useEffect, useState } from "react";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { AlertColor, Pagination, Box } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import {
  APPLICATION_PAGE,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
  API_DRINK_ROUTES,
} from "@/app/_utilities/_client/constants";
import Recipe_Component from "../Recipe_Component";
import FilterRecipes_Component from "../FilterRecipes_Component";
import { useDispatch, useSelector } from "react-redux";
import { recipeActions } from "lib/redux/recipeSlice";
import { pageStateActions } from "lib/redux/pageStateSlice";

function CustomRecipes() {
  const dispatch = useDispatch();
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const [pageIndex, setpageIndex] = useState(1);

  // Toast Message
  const [openToastMessage, setOpenToastMessage] = useState(false);
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
    ).catch((error) => {
      showToastMessage("Error", error.message, SEVERITY.Warning);
    }).finally(()=>{
      dispatch(pageStateActions.setPageLoadingState(false));
    });;
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
        showToastMessage("Recipes found", response.message, SEVERITY.success);
        dispatch(pageStateActions.setPageLoadingState(false));
      }
    ).catch((error) => {
      showToastMessage("Error", error.message, SEVERITY.Warning);
      dispatch(pageStateActions.setPageLoadingState(false));
    });;
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
      showToastMessage("Error", error.message, SEVERITY.Warning);
      dispatch(pageStateActions.setPageLoadingState(false));
    });;
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
      showToastMessage("Error", error.message, SEVERITY.Warning);
      dispatch(pageStateActions.setPageLoadingState(false));
    });;
  };
  //   if (alcoholicTypes.length === 0) {
  //     dispatch(pageStateActions.setPageLoadingState(true));

  //     makeRequest(
  //       API_ROUTES.drinks,
  //       REQ_METHODS.get,
  //       { criteria: API_DRINK_ROUTES.alcoholicTypes },
  //       (response) => {
  //         if (response.isOk) {
  //           dispatch(
  //             recipeActions.setAlcoholicTypes(
  //               response.data.drinks.map((x) => x.strAlcoholic).sort()
  //             )
  //           );
  //         }
  //       }
  //     ).catch((error) => {
  //       showToastMessage("Error", error.message, SEVERITY.Warning);
  //       dispatch(pageStateActions.setPageLoadingState(false));
  //     });
  //   }
  //   loadSocialRecipes();
  // };

  // let loadIngredients = () => {
  //   if (allIngredients.length === 0) {
  //     dispatch(pageStateActions.setPageLoadingState(true));

  //     makeRequest(
  //       API_ROUTES.drinks,
  //       REQ_METHODS.get,
  //       { criteria: API_DRINK_ROUTES.ingredients },
  //       (response) => {
  //         if (response.isOk) {
  //           const updatedIngredients = response.data.drinks
  //             .map((item) => {
  //               if (item.strIngredient1 === "AÃ±ejo rum") {
  //                 return { ...item, strIngredient1: "Añejo Rum" };
  //               }
  //               return item;
  //             })
  //             .sort();
  //           dispatch(recipeActions.setIngredients(updatedIngredients));
  //         }
  //       }
  //     ).catch((error) => {
  //       showToastMessage("Error", error.message, SEVERITY.Warning);
  //       dispatch(pageStateActions.setPageLoadingState(false));
  //     });
  //   }
  //   loadAlcoholicTypes();
  // };
  // let loadGlasses = () => {
  //   if (glasses.length === 0) {
  //     dispatch(pageStateActions.setPageLoadingState(true));

  //     makeRequest(
  //       API_ROUTES.drinks,
  //       REQ_METHODS.get,
  //       { criteria: API_DRINK_ROUTES.glassTypes },
  //       (response) => {
  //         if (response.isOk) {
  //           dispatch(
  //             recipeActions.setGlasses(
  //               response.data.drinks.map((x) => x.strGlass).sort()
  //             )
  //           );
  //         }
  //       }
  //     ).catch((error) => {
  //       showToastMessage("Error", error.message, SEVERITY.Warning);
  //       dispatch(pageStateActions.setPageLoadingState(false));
  //     });
  //   }
  //   loadIngredients();
  // };
  // let loadCategories = () => {
  //   dispatch(pageStateActions.setPageLoadingState(true));
  //   if (categories.length === 0) {
  //     makeRequest(
  //       API_ROUTES.drinks,
  //       REQ_METHODS.get,
  //       { criteria: API_DRINK_ROUTES.drinkCategories },
  //       (response) => {
  //         if (response.isOk) {
  //           dispatch(
  //             recipeActions.setCategories(
  //               response.data.drinks.map((x) => x.strCategory).sort()
  //             )
  //           );
  //         }
  //       }
  //     ).catch((error) => {
  //       showToastMessage("Error", error.message, SEVERITY.Warning);
  //       dispatch(pageStateActions.setPageLoadingState(false));
  //     });
  //   }
  //   loadGlasses();
  // };
  useEffect(() => {
    loadSocialRecipes();
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

      {/* Page body */}
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <FilterRecipes_Component
            recipeAllRecipes={recipeAllRecipes}
            loadFilteredRecipes={loadFilteredMyRecipes}
            setRecipesFiltered={setRecipesFiltered}
            showToastMessage={showToastMessage}
            filterCriteriaSetter={setFilter}
            filterCriteria={filter}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Recipe_Component
            applicationPage={APPLICATION_PAGE.social}
            title="My MixMate Recipes"
            recipes={recipesFiltered}
            showToastMessage={showToastMessage}
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
    </>
  );
}

export default CustomRecipes;
