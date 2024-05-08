"use client";
import React, { useEffect, useState, useRef } from "react";
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
import { Typography, CardContent, Pagination, Stack } from "@mui/material";
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
import { recipeActions } from "lib/redux/recipeSlice";
import { AlertColor } from "@mui/material/Alert";
import { pageStateActions } from "lib/redux/pageStateSlice";
function RecipesComponent() {
  // Validate session
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const allRecipes = useSelector((state: any) => state.recipe.recipes);
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);

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

  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedGlass, setSelectedGlass] = useState("");

  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const [selectedAlcoholicType, setSelectedAlcoholicType] = useState("");

  const [recipesFiltered, setRecipesFiltered] = useState(null);

  const recipeNameRef = useRef(null);
  const dispatch = useDispatch();

  //pagination
  const itemsPerPage = 11; // Adjust as needed
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedRecipes = recipesFiltered?.slice(startIndex, endIndex);

  let loadAllRecipes = () => {
    if (allRecipes.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.allRecipes },
        (response) => {
          dispatch(recipeActions.setRecipes(response.data));
          setRecipesFiltered(response.data);

          // Done
          dispatch(pageStateActions.setPageLoadingState(false));
        }
      ).catch((error) => {
        showToastMessage("Error", error.message, SEVERITY.warning);
      });
    } else {
      dispatch(pageStateActions.setPageLoadingState(false));
      setRecipesFiltered(allRecipes);
    }
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
    loadAllRecipes();
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
            setRecipeIngredients(
              updatedIngredients.map((x) => x.strIngredient1).sort()
            );
            dispatch(recipeActions.setIngredients(updatedIngredients));

            loadAlcoholicTypes();
          }
        },(error) => {
          showToastMessage("Error", error.message, SEVERITY.warning);
        }
      )
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
      console.log(categories);
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
    if (!isLoading && !user) {
      router.push(APPLICATION_PAGE.root);
    }
  }, [isLoading, user, router]);
  useEffect(() => {
    loadCategories();
  }, []);

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

    setRecipesFiltered(allRecipes);
  };
  let btnFind_onClick = async () => {
    if (
      selectedCategory !== "" ||
      selectedGlass !== "" ||
      selectedIngredient !== "" ||
      selectedAlcoholicType !== "" ||
      (recipeNameRef.current ? recipeNameRef.current.value !== "" : false)
    ) {
      dispatch(pageStateActions.setPageLoadingState(true));
      if (allRecipes.length === 0) await loadAllRecipes();

      switch (selectedFilter) {
        case "Alcoholic Type": {
          if (selectedAlcoholicType !== "") {
            const filtered = allRecipes.filter(
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
            const filtered = allRecipes.filter(
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
            const filtered = allRecipes.filter(
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
            const filtered = allRecipes.filter((recipe) =>
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

            const matchedRecipes = allRecipes.filter((recipe) =>
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
      dispatch(pageStateActions.setPageLoadingState(false));
    } else {
      showToastMessage("Filter", "No criteria to search", SEVERITY.Warning);
      dispatch(pageStateActions.setPageLoadingState(false));
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

    dispatch(pageStateActions.setPageLoadingState(true));
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.post,
      { userId: user.sub, recipe: recipe },
      (response) => {
        if (response.isOk)
          showToastMessage("Recipe", response.message, SEVERITY.Success);
        else showToastMessage("Recipe", response.message, SEVERITY.Warning);
        dispatch(pageStateActions.setPageLoadingState(false));
      }
    ).catch((error) => {
      showToastMessage("Error", error.message, SEVERITY.warning);
    });
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
                    {categories?.map((cat) => {
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
                    {glasses?.map((glass) => {
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
                    {alcoholicTypes?.map((at) => {
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
                {displayedRecipes?.length > 0 ? (
                  displayedRecipes?.map((drink) => (
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
      <Stack
        spacing={2}
        style={{ justifyContent: "center", marginTop: "20px" }}
      >
        <Pagination
          shape="rounded"
          variant="outlined"
          count={Math.ceil(recipesFiltered?.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
        />
      </Stack>
    </>
  );
}

export default RecipesComponent;
