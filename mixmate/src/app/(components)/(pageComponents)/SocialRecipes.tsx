import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  API_DRINK_ROUTES,
  API_ROUTES,
  APPLICATION_PAGE,
  REQ_METHODS,
  SEVERITY,
} from "@/app/_utilities/_client/constants";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Recipe_Component from "../Recipe_Component";
import FilterRecipes_Component from "../FilterRecipes_Component";
import { useDispatch, useSelector } from "react-redux";
import { recipeActions } from "lib/redux/recipeSlice";

function Social() {
  // Toast Message
  const [openToasMessage, setOpenToasMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState(
    SEVERITY.Info.toLowerCase()
  );
  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");
  const showToastMessage = (title, message, severity = SEVERITY.Info) => {
    setToast_severity(severity.toLowerCase());
    setToast_title(title);
    setToast_message(message);
    setOpenToasMessage(true);
  };

  // Variables
  const [loadingPage, setLoadingPage] = useState(true);

  const [recipeAlcoholicTypes, setRecipeAlcoholicTypes] = useState(null);
  const [recipeAllRecipes, setRecipeAllRecipes] = useState(null);
  const [recipesFiltered, setRecipesFiltered] = useState(null);
  const dispatch = useDispatch();
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const allIngredients = useSelector((state:any)=> state.recipe.ingredients);
  let loadFavoriteRecipes = () => {
    makeRequest(API_ROUTES.favourite, REQ_METHODS.get, {}, (response) => {
      setRecipesFiltered(response.data);
      // Done
      setLoadingPage(false);
    });
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
            dispatch(recipeActions.setIngredients(updatedIngredients.map((x) => x.strIngredient1).sort()));

            loadAlcoholicTypes();
          }
        }
      );
    } else {
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

  // // Loading recipe options
  // let loadMyRecipes = () =>
  // {
  //     doPost(API.Social.getSharedRecipes, {userNickname: userSession}, (response) =>
  //     {
  //         if(response.isOk)
  //         {
  //             setRecipeAllRecipes(response.data);
  //             setRecipesFiltered(response.data);

  //             // Done
  //             setLoadingPage(false);
  //         }
  //     });
  // }
  // let loadAlcoholicTypes = () => doPost(API.Recipes.getAllAlcoholicTypes, { }, (response) =>
  //     {
  //         if(response.isOk)
  //         {
  //             setRecipeAlcoholicTypes(response.data.drinks.map(x => x.strAlcoholic).sort());
  //             loadMyRecipes();
  //         }
  //     });
  //     let loadIngredients = () => doPost(API.Recipes.getAllIngredients, { }, (response) =>
  //     {
  //         if(response.isOk)
  //         {
  //             const updatedIngredients = response.data.drinks.map((item) => {
  //                 if (item.strIngredient1 === "AÃ±ejo rum") {
  //                   return { ...item, strIngredient1: "Añejo Rum" };
  //                 }
  //                 return item;
  //               });
  //             setRecipeIngredients(updatedIngredients.map(x => x.strIngredient1).sort());
  //             loadAlcoholicTypes();
  //         }
  //     });
  // let loadGlasses = () => doPost(API.Recipes.getAllGlasses, { }, (response) =>
  //     {
  //         if(response.isOk)
  //         {
  //             setRecipeGlasses(response.data.drinks.map(x => x.strGlass).sort());
  //             loadIngredients();
  //         }
  //     });
  // let loadCategories = () => doPost(API.Recipes.getAllCategories, { }, (response) =>
  //     {
  //         if(response.isOk)
  //         {
  //             setRecipeCategories(response.data.drinks.map(x => x.strCategory).sort());
  //             loadGlasses();
  //         }
  //     });

  // useEffect(() => loadCategories(), []);

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
            recipeCategories={categories}
            recipeAlcoholicTypes={recipeAlcoholicTypes}
            recipeGlasses={glasses}
            recipeIngredients={allIngredients}
            showToastMessage={showToastMessage}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Recipe_Component
            applicationPage={APPLICATION_PAGE.social}
            recipes={recipesFiltered}
            setLoadingPage={setLoadingPage}
            showToastMessage={showToastMessage}
            recipeAlcoholicTypes={recipeAlcoholicTypes}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default Social;
