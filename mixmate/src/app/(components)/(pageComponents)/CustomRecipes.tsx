import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { CardContent, AlertColor, Pagination, Box } from "@mui/material";
import Button from "@mui/material/Button";
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
import NightlifeIcon from "@mui/icons-material/Nightlife";
import Recipe_Component from "../Recipe_Component";
import { useUser } from "@auth0/nextjs-auth0/client";
import FilterRecipes_Component from "../FilterRecipes_Component";
import { useDispatch, useSelector } from "react-redux";
import { recipeActions } from "lib/redux/recipeSlice";
import AddEditRecipe_Component from "../AddEditRecipe_Component";

function CustomRecipes() {
  const { user, error, isLoading } = useUser();
  const dispatch = useDispatch();
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const [pageIndex, setpageIndex] = useState(1);

  // Toast Message
  const [openToasMessage, setOpenToasMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>(
    SEVERITY.Info
  );
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");
  const showToastMessage = (title, message, severity = SEVERITY.Info) => {
    setToast_severity(severity);
    setToast_title(title);
    setToast_message(message);
    setOpenToasMessage(true);
  };
  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
  }>({ filter: "", criteria: "" });

  // Variables
  const [loadingPage, setLoadingPage] = useState(true);
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );

  let onPageIndexChange = (e) => {
    setLoadingPage(true);
    loadMyRecipes(parseInt(e.target.innerText));
  };
  let loadMyRecipes = (pageIndex = 1) => {
    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.get,
      { userid: user?.sub, index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data);
        loadRecipesCount();
        // Done
        setLoadingPage(false);
      }
    );
  };

  let loadFilteredMyRecipes = () => {
    setIsFilterApplied(true);
    setLoadingPage(true);
    makeRequest(
      API_ROUTES.sharedRecipesFilter,
      REQ_METHODS.get,
      { filter: filter.filter, criteria: filter.criteria, index: pageIndex },
      (response) => {
        setRecipesFiltered(response.data);
        setIsFilterApplied(true);
        loadFilteredRecipesCount(filter.filter, filter.criteria);
        showToastMessage("Recipes found", response.message, SEVERITY.success);
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
  // Loading recipe options
  let loadRecipesCount = () => {
    makeRequest(
      API_ROUTES.sharedRecipesCount,
      REQ_METHODS.get,
      { userid: user.sub },
      (response) => {
        setPageIndexCount(Math.ceil(response.data / 5));
      }
    );
  };
  let loadAlcoholicTypes = () => {
    if (alcoholicTypes.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.alcoholicTypes },
        (response) => {
          if (response.isOk) {
            dispatch(
              recipeActions.setAlcoholicTypes(
                response.data.drinks.map((x) => x.strAlcoholic).sort()
              )
            );
          }
        }
      ).catch((error) => {
        showToastMessage("Error", error.message, SEVERITY.warning);
      });
    }
    loadMyRecipes();
  };

  let loadIngredients = () => {
    if (allIngredients.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.ingredients },
        (response) => {
          if (response.isOk) {
            const updatedIngredients = response.data.drinks
              .map((item) => {
                if (item.strIngredient1 === "AÃ±ejo rum") {
                  return { ...item, strIngredient1: "Añejo Rum" };
                }
                return item;
              })
              .sort();
            dispatch(recipeActions.setIngredients(updatedIngredients));

            loadAlcoholicTypes();
          }
        }
      );
    } else {
      loadAlcoholicTypes();
    }
  };
  let loadGlasses = () => {
    if (glasses.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.glassTypes },
        (response) => {
          if (response.isOk) {
            dispatch(
              recipeActions.setGlasses(
                response.data.drinks.map((x) => x.strGlass).sort()
              )
            );
          }
        }
      ).catch((error) => {
        showToastMessage("Error", error.message, SEVERITY.warning);
      });
    }
    loadIngredients();
  };
  let loadCategories = () => {
    if (categories.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.drinkCategories },
        (response) => {
          if (response.isOk) {
            dispatch(
              recipeActions.setCategories(
                response.data.drinks.map((x) => x.strCategory).sort()
              )
            );
          }
        }
      ).catch((error) => {
        showToastMessage("Error", error.message, SEVERITY.warning);
      });
    }
    loadGlasses();
  };
  useEffect(() => {
    loadCategories();
    loadRecipesCount();
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
      {/* Toast message */}
      <Snackbar
        open={openToasMessage}
        autoHideDuration={5000}
        onClose={() => setOpenToasMessage(false)}
      >
        <Alert severity={toast_severity}>
          <AlertTitle>{toast_title}</AlertTitle>
          {toast_message}
        </Alert>
      </Snackbar>

      {/* Loading */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => 9999 }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Add new recipe modal */}
      <AddEditRecipe_Component
        openModal={openAddEditRecipeModal}
        closeModal={modalAddEditRecipe_onClose}
        showToastMessage={showToastMessage}
        setLoadingPage={setLoadingPage}
        reloadPage={loadMyRecipes}
        recipeId={selectedRecipeIdAddEdit}
      />

      {/* Page body */}
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
            applicationPage={APPLICATION_PAGE.myRecipes}
            title="My MixMate Recipes"
            recipes={recipesFiltered}
            setLoadingPage={setLoadingPage}
            showToastMessage={showToastMessage}
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
        {" "}
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
