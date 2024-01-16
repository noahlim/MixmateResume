import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { CardContent, AlertColor } from "@mui/material";
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
  // Toast Message
  const [openToasMessage, setOpenToasMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>(
    SEVERITY.Info
  );
  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");
  const showToastMessage = (title, message, severity = SEVERITY.Info) => {
    setToast_severity(severity);
    setToast_title(title);
    setToast_message(message);
    setOpenToasMessage(true);
  };

  // Variables
  const [loadingPage, setLoadingPage] = useState(true);
  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);

  let loadMyRecipes = () => {
    makeRequest(API_ROUTES.recipeShare, REQ_METHODS.get, {userid:user?.sub, index:pageIndex}, (response) => {
      //dispatch(recipeActions.setRecipes(response.data));
      setRecipesFiltered(response.data);
      // Done
      setLoadingPage(false);
    });
  };
  // Loading recipe options

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
            const updatedIngredients = response.data.drinks.map((item) => {
              if (item.strIngredient1 === "AÃ±ejo rum") {
                return { ...item, strIngredient1: "Añejo Rum" };
              }
              return item;
            });
            dispatch(recipeActions.setIngredients(updatedIngredients));

            loadAlcoholicTypes();
          }
        }
      );
    } else {
      setRecipeIngredients(allIngredients.map((x) => x.strIngredient1).sort());
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
            setRecipesFiltered={setRecipesFiltered}
            recipeCategories={categories}
            recipeAlcoholicTypes={alcoholicTypes}
            recipeGlasses={glasses}
            recipeIngredients={recipeIngredients}
            showToastMessage={showToastMessage}
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
    </>
  );
}

export default CustomRecipes;
