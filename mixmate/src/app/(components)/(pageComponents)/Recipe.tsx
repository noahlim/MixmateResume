"use client";
import React, { useEffect, useState, useRef } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  API_ROUTES,
  API_DRINK_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import RecipeRow from "@/app/(components)/RecipeRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { APPLICATION_PAGE, SEVERITY } from "@/app/_utilities/_client/constants";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { recipeActions } from "redux/recipeSlice";
import { AlertColor } from "@mui/material/Alert";

function RecipesComponent() {
  // Validate session
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);

  // Toast Message
  const [openToastMessage, setOpenToastMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>("info");
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

  const [selectedFilter, setSelectedFilter] = useState("");

  const [recipeCategories, setRecipeCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [recipeGlasses, setRecipeGlasses] = useState(null);
  const [selectedGlass, setSelectedGlass] = useState("");

  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const [recipeAlcoholicTypes, setRecipeAlcoholicTypes] = useState(null);
  const [selectedAlcoholicType, setSelectedAlcoholicType] = useState("");

  const [recipesFiltered, setRecipesFiltered] = useState(null);

  const recipeNameRef = useRef(null);
  const dispatch = useDispatch();

  
  let loadAllRecipes = () => {
    if (recipeAllRecipes.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.allRecipes },
        (response) => {
          dispatch(recipeActions.setRecipes(response.data));
          setRecipesFiltered(response.data);

          // Done
          setLoadingPage(false);
        }
      );
    } else {
      setLoadingPage(false);
      setRecipesFiltered(recipeAllRecipes);
    }
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
          loadAllRecipes();
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
  useEffect(() => {
    if (!isLoading && !user) {
      router.push(APPLICATION_PAGE.root);
    }
  }, [isLoading, user, router]);
  // Filter recipes controls
  let filterBy_onChange = (value) => {
    setSelectedFilter(value);
    setSelectedCategory("");
    setSelectedGlass("");
    setSelectedIngredient("");
    setSelectedAlcoholicType("");
    recipeNameRef.current ? (recipeNameRef.current.value = "") : {};
  };
  let btnClear_onClick = () => {
    setSelectedFilter("");
    setSelectedCategory("");
    setSelectedGlass("");
    setSelectedIngredient("");
    setSelectedAlcoholicType("");
    recipeNameRef.current ? (recipeNameRef.current.value = "") : {};

    setRecipesFiltered(recipeAllRecipes);
  };
  let btnFind_onClick = async () => {
    if (
      selectedCategory !== "" ||
      selectedGlass !== "" ||
      selectedIngredient !== "" ||
      selectedAlcoholicType !== "" ||
      (recipeNameRef.current ? recipeNameRef.current.value !== "" : false)
    ) {
      setLoadingPage(true);
      if (recipeAllRecipes.length === 0) await loadAllRecipes();

      switch (selectedFilter) {
        case "Alcoholic Type": {
          if (selectedAlcoholicType !== "") {
            const filtered = recipeAllRecipes.filter(
              (recipe) => recipe.strAlcoholic === selectedAlcoholicType
            );
            setRecipesFiltered(filtered);
          } else
            showToastMessage(
              "Filter",
              "Please Enter the Criteria.",
              SEVERITY.Warning
            );

          break;
        }
        case "Category": {
          if (selectedCategory !== "") {
            const filtered = recipeAllRecipes.filter(
              (recipe) => recipe.strCategory === selectedCategory
            );
            setRecipesFiltered(filtered);
          } else
            showToastMessage(
              "Filter",
              "Please Enter the Criteria.",
              SEVERITY.Warning
            );

          break;
        }
        case "Glass": {
          if (selectedGlass !== "") {
            console.log(selectedGlass);
            const filtered = recipeAllRecipes.filter(
              (recipe) => recipe.strGlass === selectedGlass
            );
            setRecipesFiltered(filtered);
          } else
            showToastMessage(
              "Filter",
              "Please Enter the Criteria.",
              SEVERITY.Warning
            );

          break;
        }
        case "Ingredient": {
          if (selectedIngredient !== "") {
            const filtered = recipeAllRecipes.filter((recipe) =>
              recipe.ingredients.some(
                (ing) => ing.ingredient === selectedIngredient
              )
            );
            setRecipesFiltered(filtered);
          } else
            showToastMessage(
              "Filter",
              "Please Enter the Criteria.",
              SEVERITY.Warning
            );

          break;
        }
        case "Recipe Name": {
          if (recipeNameRef.current?.value !== "") {
            const searchText = recipeNameRef.current.value.toLowerCase();

            const matchedRecipes = recipeAllRecipes.filter((recipe) =>
              recipe.strDrink.toLowerCase().includes(searchText)
            );
            setRecipesFiltered(matchedRecipes);
          } else
            showToastMessage(
              "Filter",
              "Please Enter the Criteria.",
              SEVERITY.Warning
            );

          break;
        }
        default:
          showToastMessage(
            "Filter",
            "Please Choose the filtering criteria.",
            SEVERITY.Warning
          );
      }
      setLoadingPage(false);
    } else {
      showToastMessage("Filter", "No criteria to search", SEVERITY.Warning);
      setLoadingPage(false);
    }
  };

  // Recipe actions
  let btnAddToMyMixMate_onClick = (recipe) => {
    // Get user
    if (!user) {
      showToastMessage(
        "Please Log In",
        "You must be logged in to use Favourite Features",
        SEVERITY.Warning
      );
    }

    setLoadingPage(true);
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.post,
      { user: user, recipe: recipe },
      (response) => {
        if (response.isOk)
          showToastMessage("Recipe", response.message, SEVERITY.Success);
        else showToastMessage("Recipe", response.message, SEVERITY.Warning);
        setLoadingPage(false);
      }
    );
  };

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

      {/* Loading */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Page body */}

      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={3}>
          <Paper
            elevation={3}
            style={{ margin: 15 }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                btnFind_onClick();
              }
            }}
          >
            <CardContent
              style={{
                textAlign: "center",
                paddingTop: 25,
                paddingBottom: 0,
              }}
            >
              <Typography variant="h6">Filter recipes</Typography>
            </CardContent>

            {/* Filters */}
            <div style={{ padding: 25 }}>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="filter-select-label">Filter by</InputLabel>
                <Select
                  labelId="filter-select-label"
                  label="Filter by"
                  value={selectedFilter}
                  onChange={(e) => filterBy_onChange(e.target.value)}
                >
                  {[
                    "Alcoholic Type",
                    "Category",
                    "Glass",
                    "Ingredient",
                    "Recipe Name",
                  ].map((f) => {
                    return (
                      <MenuItem key={f} value={f}>
                        {f}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>

            {/* Categories */}
            {selectedFilter === "Category" && (
              <div style={{ padding: 25 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    label="Category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {recipeCategories?.map((cat) => {
                      return (
                        <MenuItem key={cat} value={cat}>
                          {cat}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            )}

            {/* Glasses */}
            {selectedFilter === "Glass" && (
              <div style={{ padding: 25 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="glass-select-label">Glass</InputLabel>
                  <Select
                    labelId="glass-select-label"
                    label="Glass"
                    value={selectedGlass}
                    onChange={(e) => setSelectedGlass(e.target.value)}
                  >
                    {recipeGlasses?.map((glass) => {
                      return (
                        <MenuItem key={glass} value={glass}>
                          {glass}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            )}

            {/* Ingredients */}
            {selectedFilter === "Ingredient" && (
              <div style={{ padding: 25 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="ingredient-select-label">
                    Ingredient
                  </InputLabel>
                  <Select
                    labelId="ingredient-select-label"
                    label="Ingredient"
                    value={selectedIngredient}
                    onChange={(e) => setSelectedIngredient(e.target.value)}
                  >
                    {recipeIngredients?.map((ingre) => {
                      return (
                        <MenuItem key={ingre} value={ingre}>
                          {ingre}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            )}

            {/* Alcoholic types */}
            {selectedFilter === "Alcoholic Type" && (
              <div style={{ padding: 25 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="alcoholictype-select-label">
                    Alcoholic Type
                  </InputLabel>
                  <Select
                    labelId="alcoholictype-select-label"
                    label="Alcoholic Type"
                    value={selectedAlcoholicType}
                    onChange={(e) => setSelectedAlcoholicType(e.target.value)}
                  >
                    {recipeAlcoholicTypes?.map((at) => {
                      return (
                        <MenuItem key={at} value={at}>
                          {at}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            )}

            {/* Recipe name */}
            {selectedFilter === "Recipe Name" && (
              <div style={{ padding: 25 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel htmlFor="input-with-icon-adornment">
                    Recipe Name
                  </InputLabel>
                  <Input
                    id="input-with-icon-adornment"
                    startAdornment={
                      <InputAdornment position="start">
                        <LocalBarIcon />
                      </InputAdornment>
                    }
                    inputRef={recipeNameRef}
                  />
                </FormControl>
              </div>
            )}

            <CardContent
              style={{
                textAlign: "center",
                paddingTop: 10,
                paddingBottom: 25,
              }}
            >
              <Button
                onClick={() => btnClear_onClick()}
                color="error"
                variant="outlined"
                startIcon={<ClearIcon />}
                style={{ marginRight: 7 }}
              >
                Clear
              </Button>
              <Button
                onClick={() => btnFind_onClick()}
                color="primary"
                variant="outlined"
                startIcon={<SearchIcon />}
                style={{ marginLeft: 7 }}
              >
                Find
              </Button>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={9}>
          <div style={{ paddingLeft: 25, paddingRight: 55 }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <CardContent
                      style={{
                        textAlign: "center",
                        paddingTop: 25,
                        paddingBottom: 0,
                      }}
                    >
                      <Typography variant="h6">Recipes</Typography>
                    </CardContent>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipesFiltered?.length > 0 ? (
                  recipesFiltered?.map((drink) => (
                    <RecipeRow
                      key={drink.idDrink}
                      drink={drink}
                      btnAddToMyMixMate_onClick={btnAddToMyMixMate_onClick}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      sx={{
                        fontSize: "1.6em",
                        fontFamily: '"Arial", sans-serif',
                        textAlign: "center",
                        padding: "20px",
                        color: "skyblue",
                      }}
                    >
                      No Results Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default RecipesComponent;
