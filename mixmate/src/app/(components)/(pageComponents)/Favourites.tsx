import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  API_DRINK_ROUTES,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import {
  makeRequest,
} from "@/app/_utilities/_client/utilities";
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
  // Variables
  const [loadingPage, setLoadingPage] = useState(true);

  const [recipeCategories, setRecipeCategories] = useState(null);
  const [recipeGlasses, setRecipeGlasses] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [recipeAlcoholicTypes, setRecipeAlcoholicTypes] = useState(null);
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);
  const dispatch = useDispatch();

  // Loading recipe options
  let loadFavoriteRecipes = () => {
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.get,
      { },
      (response) => {        
        setRecipesFiltered(response.data);
        // Done
        setLoadingPage(false);
      }
    );
  };
  let loadAlcoholicTypes = () =>
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.alcoholicTypes },
      (response) => {
        if (response.isOk) {
          setRecipeAlcoholicTypes(
            response.data.drinks.map((x) => x.strAlcoholic).sort()
          );
          loadFavoriteRecipes();
        }
      }
    );
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
            setRecipeIngredients(
              updatedIngredients.map((x) => x.strIngredient1).sort()
            );
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
  let loadGlasses = () =>
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.glassTypes },
      (response) => {
        if (response.isOk) {
          setRecipeGlasses(response.data.drinks.map((x) => x.strGlass).sort());
          loadIngredients();
        }
      }
    );
  let loadCategories = () =>
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.drinkCategories },
      (response) => {
        if (response.isOk) {
          setRecipeCategories(
            response.data.drinks.map((x) => x.strCategory).sort()
          );
          loadGlasses();
        }
      }
    );

  useEffect(() => {
    loadCategories();
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
            recipeAllRecipes={recipeAllRecipes}
            setRecipesFiltered={setRecipesFiltered}
            recipeCategories={recipeCategories}
            recipeAlcoholicTypes={recipeAlcoholicTypes}
            recipeGlasses={recipeGlasses}
            recipeIngredients={recipeIngredients}
            showToastMessage={showToastMessage}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Recipe_Component
            title="My Favourite Recipes"
            recipes={recipesFiltered}
            setLoadingPage={setLoadingPage}
            showToastMessage={showToastMessage}
            reloadRecipes={loadFavoriteRecipes}
            recipeCategories={recipeCategories}
            recipeAlcoholicTypes={recipeAlcoholicTypes}
            recipeGlasses={recipeGlasses}
          />
        </Grid>
      </Grid>
    </>
  );
}
export default Favourites;
