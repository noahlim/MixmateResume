import {
  Box,
  Typography,
  TextField,
  Paper,
  CardContent,
  Autocomplete,
  OutlinedInput,
  Chip,
  FormHelperText,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import {
  capitalizeWords,
  isNotSet,
  isSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import {
  API_DRINK_ROUTES,
  API_ROUTES,
  APPLICATION_PAGE,
  REQ_METHODS,
  SEVERITY,
  FILTER_CRITERIA,
} from "@/app/_utilities/_client/constants";
import { useDispatch, useSelector } from "react-redux";
import { recipeActions } from "lib/redux/recipeSlice";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { FaLemon } from "react-icons/fa";
import { SelectChangeEvent } from "@mui/material/Select";
import { Theme, useTheme } from "@mui/material/styles";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function FilterForm({
  recipeAllRecipes,
  setRecipesFiltered,
  filterCriteriaSetter,
  filterCriteria,
  loadFilteredRecipes,
  onFilterClear,
  applicationPage,
  loadMyRecipes = null,
}) {
  const capitalizedRecipes = recipeAllRecipes.map((recipe) => ({
    ...recipe, // Preserve other properties
    label: capitalizeWords(recipe.label), // Capitalize the label property
  }));

  const dispatch = useDispatch();
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );

  const [filterAndCriteria, setFilterAndCriteria] = useState<
    Array<{ filter: string; criteria: string }>
  >([]);
  const theme = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGlasses, setSelectedGlasses] = useState<string[]>([]);
  const [selectedAlcoholic, setSelectedAlcohlic] = useState<string[]>([]);
  //   const [ingredientFilters, setIngredientFilters] = useState<Array<{ filter: string; criteria: string }>>(null);
  //   const [alcoholicFilters, setAlcoholicFilters] = useState<Array<{ filter: string; criteria: string }>>(null);
  //   const [glassFilters, setGlassFilters] = useState<Array<{ filter: string; criteria: string }>>(null);
  //   const [categoryFilters, setCategoryFilters] = useState<Array<{ filter: string; criteria: string }>>(null);

  const [recipeName, setRecipeName] = useState<string>("");
  const [selectedIngredientsList, setSelectedIngredientList] = useState<
    string[]
  >([]);
  const [selectedIngredientsInput, setSelectedIngredientsInput] =
    useState<string>();
  const [isIngredientStringValid, setIsIngredientStringValid] =
    useState<boolean>(true);

  const onFilterChange = (event: any, filter: string) => {
    switch (filter) {
      case FILTER_CRITERIA.recipeName:
        handleRecipeNameChange(event);
        break;
      case FILTER_CRITERIA.ingredient:
        handleIngredientsChange(event);
        break;
      case FILTER_CRITERIA.category:
        handleCategoryChange(event);
        break;
      case FILTER_CRITERIA.glass:
        handleGlassChange(event);
        break;
      case FILTER_CRITERIA.alcoholic:
        handleAlcoholicChange(event);
        break;
    }
  };
  const filterUpdate = (
    filterInput: any,
    filterType: string,
    isDelete: boolean = false
  ) => {
    console.log(filterInput, filterType, isDelete);
    const newfilterAndCriteria = [];

    //adding recipe name filter to the filter list
    if (isDelete && filterType === FILTER_CRITERIA.recipeName) {
      setRecipeName("");
    } else if (!isDelete && filterType === FILTER_CRITERIA.recipeName) {
      newfilterAndCriteria.push(filterInput);
      setRecipeName(filterInput.criteria);
    } else if (recipeName.length > 0) {
      newfilterAndCriteria.push({
        filter: filterType,
        criteria: recipeName,
      });
    }

    //updating ingredient filters
    //
    let ingredientFilterList;

    //handling delete case
    if (isDelete && filterType === FILTER_CRITERIA.ingredient) {
      ingredientFilterList = [...selectedIngredientsList];
      ingredientFilterList = ingredientFilterList.filter(
        (ingredient) => ingredient.toLowerCase() !== filterInput.toLowerCase()
      );
      setSelectedIngredientList(ingredientFilterList);
      setSelectedIngredientsInput(ingredientFilterList.join(","));

      //handling add case
    } else if (!isDelete && filterType === FILTER_CRITERIA.ingredient) {
      ingredientFilterList = filterInput;
      setSelectedIngredientList(filterInput);
    } else ingredientFilterList = selectedIngredientsList;

    if (ingredientFilterList.length > 0)
      ingredientFilterList.forEach((ingredient) => {
        newfilterAndCriteria.push({
          filter: FILTER_CRITERIA.ingredient,
          criteria: ingredient,
        });
      });

    //updating category filters
    //
    let categoryFilterList;

    //handling delete case
    if (isDelete && filterType === FILTER_CRITERIA.category) {
      categoryFilterList = [...selectedCategories];
      categoryFilterList = categoryFilterList.filter(
        (cat) => cat.toLowerCase() !== filterInput.toLowerCase()
      );
      setSelectedCategories(categoryFilterList);

      //handling add case
    } else if (!isDelete && filterType === FILTER_CRITERIA.category) {
      categoryFilterList = filterInput;
      setSelectedCategories(filterInput);
    } else categoryFilterList = selectedCategories;

    if (categoryFilterList.length > 0)
      categoryFilterList.forEach((cat) => {
        newfilterAndCriteria.push({
          filter: FILTER_CRITERIA.category,
          criteria: cat,
        });
      });

    //updating glass filters
    //
    let glassFilterList;

    //handling delete case
    if (isDelete && filterType === FILTER_CRITERIA.glass) {
      glassFilterList = [...selectedGlasses];
      glassFilterList = glassFilterList.filter(
        (glass) => glass.toLowerCase() !== filterInput.toLowerCase()
      );
      setSelectedGlasses(glassFilterList);

      //handling add case
    } else if (!isDelete && filterType === FILTER_CRITERIA.glass) {
      glassFilterList = filterInput;
      setSelectedGlasses(filterInput);
    } else glassFilterList = selectedGlasses;

    if (glassFilterList.length > 0)
      glassFilterList.forEach((glass) => {
        newfilterAndCriteria.push({
          filter: FILTER_CRITERIA.glass,
          criteria: glass,
        });
      });

    //updating alcoholic filters
    //
    let alcoholicFilterList;

    //handling delete case
    if (isDelete && filterType === FILTER_CRITERIA.alcoholic) {
      alcoholicFilterList = [...selectedAlcoholic];
      alcoholicFilterList = alcoholicFilterList.filter(
        (alc) => alc.toLowerCase() !== filterInput.toLowerCase()
      );
      setSelectedAlcohlic(alcoholicFilterList);

      //handling add case
    } else if (!isDelete && filterType === FILTER_CRITERIA.alcoholic) {
      alcoholicFilterList = filterInput;
      setSelectedAlcohlic(filterInput);
    } else alcoholicFilterList = selectedAlcoholic;

    if (alcoholicFilterList.length > 0)
      alcoholicFilterList.forEach((alc) => {
        newfilterAndCriteria.push({
          filter: FILTER_CRITERIA.alcoholic,
          criteria: alc,
        });
      });

    //finally adding the new filter to the filter list
    setFilterAndCriteria(newfilterAndCriteria);
  };

  const handleRecipeNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipeName(event.target.innerText);

    const newFilterCriteria = {
      filter: FILTER_CRITERIA.recipeName,
      criteria: event.target.innerText,
    };
    filterUpdate(newFilterCriteria, FILTER_CRITERIA.recipeName);
  };
  const handleIngredientsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;

    // Regular expression to match allowed characters (including spaces, -, ., and ')
    const allowedChars = /^[a-zA-Z0-9 ,-]*$/;

    // Check for consecutive commas
    const hasConsecutiveCommas = /,,/.test(newValue);

    let isValid = allowedChars.test(newValue) && !hasConsecutiveCommas;
    setIsIngredientStringValid(isValid);

    // Always update the input value
    setSelectedIngredientsInput(newValue);

    let ingredients = [];
    ingredients = newValue
      .split(",")
      .map((ingredient) => ingredient.trim())
      .filter(
        (ingredient) => ingredient !== "" && allowedChars.test(ingredient)
      );
    if (isValid) {
      if (newValue === "") {
        setSelectedIngredientList([]);
      } else {
        if (ingredients.length > 0) {
          setSelectedIngredientList(ingredients);
        } else {
          setIsIngredientStringValid(false);
        }
      }
    }

    filterUpdate(ingredients, FILTER_CRITERIA.ingredient); //updating the filter list
  };
  const handleCategoryChange = (
    event: SelectChangeEvent<typeof selectedCategories>
  ) => {
    const {
      target: { value },
    } = event;
    const newCategories = typeof value === "string" ? value.split(",") : value;

    filterUpdate(newCategories, FILTER_CRITERIA.category); //updating the filter list
  };

  const handleGlassChange = (
    event: SelectChangeEvent<typeof selectedGlasses>
  ) => {
    const {
      target: { value },
    } = event;
    const newGlasses = typeof value === "string" ? value.split(",") : value;

    filterUpdate(newGlasses, FILTER_CRITERIA.glass); //updating the filter list
  };

  const handleAlcoholicChange = (
    event: SelectChangeEvent<typeof selectedAlcoholic>
  ) => {
    const {
      target: { value },
    } = event;
    const newValue = typeof value === "string" ? value.split(",") : value;

    filterUpdate(newValue, FILTER_CRITERIA.alcoholic); //updating the filter list
  };

  let loadAlcoholicTypes = () => {
    if (alcoholicTypes.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.alcoholicTypes },
        (response) => {
          const updatedAlcoholicTypes = response.data.drinks
            .map((x) => {
              x.strAlcoholic;
              x.label = x.strAlcoholic;
              return x;
            })
            .sort();
          dispatch(recipeActions.setAlcoholicTypes(updatedAlcoholicTypes));
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
              let tempIngredient = item;
              if (item.strIngredient1 === "AÃ±ejo rum") {
                tempIngredient = { ...item, strIngredient1: "Añejo Rum" };
              }
              tempIngredient.label = tempIngredient.strIngredient1;
              return tempIngredient;
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
          const updatedGlasses = response.data.drinks
            .map((x) => x.strGlass)
            .sort();
          dispatch(recipeActions.setGlasses(updatedGlasses));
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

  useEffect(() => {
    let loadCategories = () => {
      dispatch(pageStateActions.setPageLoadingState(true));
      if (categories.length === 0) {
        makeRequest(
          API_ROUTES.drinks,
          REQ_METHODS.get,
          { criteria: API_DRINK_ROUTES.drinkCategories },
          (response) => {
            dispatch(
              recipeActions.setCategories(
                response.data.drinks.map((x) => x.strCategory).sort()
              )
            );
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
    loadCategories();
    //eslint-disable-next-line
  }, []);

  return (
    <Box>
      <>
        {filterAndCriteria.map((filter, index) => {
          return (
            <Chip
              onDelete={() => {
                filterUpdate(filter.criteria, filter.filter, true);
              }}
              sx={{
                backgroundColor: "#FFFFFF",
                m: 0.3,
                "& .MuiChip-label": {
                  fontSize: "12px",
                  fontWeight: "bold",
                },
              }}
              variant="outlined"
              key={index}
              label={`${capitalizeWords(filter.filter)} : ${capitalizeWords(filter.criteria)}`}
              className={spaceGrotesk.className}
            />
          );
        })}
      </>
      <Paper elevation={3} style={{ margin: 15 }}>
        <CardContent
          style={{ textAlign: "center", paddingTop: 25, paddingBottom: 0 }}
        >
          <Typography variant="h6">Search By...</Typography>
        </CardContent>
        <Box sx={{ p: 2.5 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Autocomplete
              disablePortal
              options={recipeAllRecipes}
              renderInput={(params) => (
                <TextField {...params} label="Recipe Name" />
              )}
              onChange={(event) => {
                onFilterChange(event, FILTER_CRITERIA.recipeName);
              }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              label="Ingredients, separated by commas"
              variant="outlined"
              onChange={(event) => {
                onFilterChange(event, FILTER_CRITERIA.ingredient);
              }}
              value={selectedIngredientsInput}
              error={!isIngredientStringValid}
            />
            {!isIngredientStringValid && (
              <FormHelperText sx={{ color: "red" }}>
                Ingredient can only Latin alphabets, numbers, and commas -
                separate them with commas when adding multiple. (e.g. "Vodka,
                Gin")
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Glass</InputLabel>

            <Select
              multiple
              value={selectedGlasses}
              onChange={(event) => {
                onFilterChange(event, FILTER_CRITERIA.glass);
              }}
              input={<OutlinedInput sx={{ color: "black" }} label="Glass" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              sx={{ mb: 3 }}
            >
              {glasses.map((gl, index) => (
                <MenuItem
                  key={index}
                  value={gl}
                  style={getStyles(gl, selectedCategories, theme)}
                >
                  {gl}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>

            <Select
              multiple
              value={selectedCategories}
              onChange={(event) => {
                onFilterChange(event, FILTER_CRITERIA.category);
              }}
              input={<OutlinedInput sx={{ color: "black" }} label="Category" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              sx={{ mb: 3 }}
            >
              {categories.map((cat, index) => (
                <MenuItem
                  key={index}
                  value={cat}
                  style={getStyles(cat, selectedCategories, theme)}
                >
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-multiple-chip-label">Alcoholic</InputLabel>

            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={selectedAlcoholic}
              onChange={(event) => {
                onFilterChange(event, FILTER_CRITERIA.alcoholic);
              }}
              input={
                <OutlinedInput
                  sx={{ color: "black" }}
                  id="select-multiple-chip"
                  label="Alcoholic"
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
              sx={{ mb: 3 }}
            >
              {alcoholicTypes.map((alc, index) => (
                <MenuItem key={index} value={alc.label}>
                  {alc.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
    </Box>
  );
}

export default FilterForm;
