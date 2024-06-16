import React, { useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import { Typography, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import {
  capitalizeWords,
  isSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import {
  API_DRINK_ROUTES,
  API_ROUTES,
  APPLICATION_PAGE,
  REQ_METHODS,
  SEVERITY,
} from "@/app/_utilities/_client/constants";
import { useDispatch, useSelector } from "react-redux";
import { recipeActions } from "lib/redux/recipeSlice";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { FaLemon } from "react-icons/fa";

function FilterRecipesComponent({
  recipeAllRecipes,
  setRecipesFiltered,
  filterCriteriaSetter,
  filterCriteria,
  loadFilteredRecipes,
  onFilterClear,
  applicationPage,
  loadMyRecipes = null,
}) {
  // Variables

  const dispatch = useDispatch();
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );

  let btnClear_onClick = () => {
    onFilterClear();
  };

  let btnFind_onClick = () => {
    dispatch(pageStateActions.setPageLoadingState(true));
    if (isSet(filterCriteria.criteria)) {
      loadFilteredRecipes(recipeAllRecipes);
    } else {
      const toastMessageObject: ToastMessage = {
        open: true,
        message: "Please fill in the Filter/Criteria.",
        severity: SEVERITY.Warning,
        title: "Missing Filter/Criteria",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
    }
    dispatch(pageStateActions.setPageLoadingState(false));
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
      )
        .catch((error) => {
          const toastMessageObject: ToastMessage = {
            open: true,
            message: error.message,
            severity: SEVERITY.Error,
            title: "Error",
          };
          dispatch(pageStateActions.setToastMessage(toastMessageObject));
        })
        .finally(() => {
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    }
  };

  let loadIngredients = () => {
    if (allIngredients.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.ingredients },
        (response) => {
          const updatedIngredients = response.data
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
      )
        .catch((error) => {
          const toastMessageObject: ToastMessage = {
            open: true,
            message: error.message,
            severity: SEVERITY.Error,
            title: "Error",
          };
          dispatch(pageStateActions.setToastMessage(toastMessageObject));
          dispatch(pageStateActions.setPageLoadingState(false));
        })
        .finally(() => {
          loadAlcoholicTypes();
        });
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
      )
        .catch((error) => {
          const toastMessageObject: ToastMessage = {
            open: true,
            message: error.message,
            severity: SEVERITY.Error,
            title: "Error",
          };
          dispatch(pageStateActions.setToastMessage(toastMessageObject));
          dispatch(pageStateActions.setPageLoadingState(false));
        })
        .finally(() => {
          loadIngredients();
        });
    }
    loadIngredients();
  };
  let loadCategories = () => {
    dispatch(pageStateActions.setPageLoadingState(true));
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
      )
        .catch((error) => {
          const toastMessageObject: ToastMessage = {
            open: true,
            message: error.message,
            severity: SEVERITY.Error,
            title: "Error",
          };
          dispatch(pageStateActions.setToastMessage(toastMessageObject));
          dispatch(pageStateActions.setPageLoadingState(false));
        })
        .finally(() => {
          loadGlasses();
        });
    } else {
      loadGlasses();
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);
  return (
    <>
      <Paper elevation={3} sx={{ m: 15 }}>
        <CardContent
          sx={{ textAlign: "center", pt: 25, pb: 0 }}
        >
          <Typography variant="h6">Search By...</Typography>
        </CardContent>

        {/* Filters */}

        <Box sx={{ p: 25 }}>
          <FormControl variant="standard" fullWidth>
            <InputLabel id="filter-select-label">Filter By</InputLabel>
            <Select
              labelId="filter-select-label"
              label="Filter By"
              value={filterCriteria.filter}
              onChange={(e) =>
                filterCriteriaSetter({
                  filter: e.target.value,
                  criteria: "",
                })
              }
            >
              {[
                "Recipe Name",
                "Alcoholic Type",
                "Category",
                "Glass",
                "Ingredient",
              ].map((f) => {
                return (
                  <MenuItem key={f} value={f}>
                    {capitalizeWords(f)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        {/* Categories */}
        {filterCriteria.filter === "Category" && (
          <Box sx={{ p: 25 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                label="Category"
                value={filterCriteria.criteria}
                onChange={(e) =>
                  filterCriteriaSetter({
                    filter: filterCriteria.filter,
                    criteria: e.target.value,
                  })
                }
                //onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories?.map((cat) => {
                  return (
                    <MenuItem key={cat} value={cat}>
                      {capitalizeWords(cat)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Glasses */}
        {filterCriteria.filter === "Glass" && (
          <Box sx={{ p: 25 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="glass-select-label">Glass</InputLabel>
              <Select
                labelId="glass-select-label"
                label="Glass"
                value={filterCriteria.criteria}
                onChange={(e) =>
                  filterCriteriaSetter({
                    filter: filterCriteria.filter,
                    criteria: e.target.value,
                  })
                }
              >
                {glasses?.map((glass) => {
                  return (
                    <MenuItem key={glass} value={glass}>
                      {capitalizeWords(glass)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Ingredients */}
        {filterCriteria.filter === "Ingredient" && (
          <Box sx={{ p: 25 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="ingredient-select-label">Ingredient</InputLabel>
              <Input
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <FaLemon />
                  </InputAdornment>
                }
                onChange={(e) =>
                  filterCriteriaSetter({
                    filter: filterCriteria.filter,
                    criteria: e.target.value,
                  })
                }
              />
            </FormControl>
          </Box>
        )}

        {/* Alcoholic types */}
        {filterCriteria.filter === "Alcoholic Type" && (
          <Box sx={{ p: 25 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="alcoholictype-select-label">
                Alcoholic Type
              </InputLabel>
              <Select
                labelId="alcoholictype-select-label"
                label="Alcoholic Type"
                value={filterCriteria.criteria}
                onChange={(e) =>
                  filterCriteriaSetter({
                    filter: filterCriteria.filter,
                    criteria: e.target.value,
                  })
                }
              >
                {alcoholicTypes?.map((at) => {
                  return (
                    <MenuItem key={at} value={at}>
                      {capitalizeWords(at)}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Recipe name */}
        {filterCriteria.filter === "Recipe Name" && (
          <Box sx={{ p: 25 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel htmlFor="input-with-icon-adornment">
                Recipe name
              </InputLabel>
              <Input
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <LocalBarIcon />
                  </InputAdornment>
                }
                onChange={(e) =>
                  filterCriteriaSetter({
                    filter: filterCriteria.filter,
                    criteria: e.target.value,
                  })
                }
              />
            </FormControl>
          </Box>
        )}

        <CardContent
          sx={{ textAlign: "center", pt: 10, pb: 25 }}
        >
          <Button
            onClick={() => btnClear_onClick()}
            color="error"
            variant="outlined"
            startIcon={<ClearIcon />}
            sx={{ mr: 7 }}
          >
            Clear
          </Button>
          <Button
            onClick={() => btnFind_onClick()}
            color="primary"
            variant="outlined"
            startIcon={<SearchIcon />}
            sx={{ ml: 7 }}
          >
            Find
          </Button>
        </CardContent>

        {applicationPage === APPLICATION_PAGE.social && (
          <CardContent
            sx={{ textAlign: "center", pt: 10, pb: 25 }}
          >
            <Button
              onClick={()=>loadMyRecipes()}
              variant="outlined"
              startIcon={<EditIcon />}
              sx={{
                mr: 7,
                color: "#81E500",
                backgroundColor: "#81E500",
                "&:hover": {
                  backgroundColor: "#F4FFE6",
                  borderColor: "#81E500",
                },
                borderColor: "#81E500",
              }}
            >
              Curate My Recipes
            </Button>
          </CardContent>
        )}
      </Paper>
    </>
  );
}

export default FilterRecipesComponent;
