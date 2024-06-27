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
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
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
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

function FilterComponent({
  recipeAllRecipes,
  setFilterAndCriteria,
  filterAndCriteria,
  onFilterClear,
  applicationPage,
  filterUpdate,
  selectedCategories,
  setSelectedCategories,
  selectedGlasses,
  setSelectedGlasses,
  selectedAlcoholic,
  setSelectedAlcohlic,
  setSelectedIngredientList,
  selectedIngredientsList,
  selectedIngredientsInput,
  setSelectedIngredientsInput,
  recipeName,
  setRecipeName,
  isIngredientStringValid,
  setIsIngredientStringValid,
  filteringLogic,
  setFilteringLogic,
}) {
  const dispatch = useDispatch();
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );
  const theme = useTheme();

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

  const handleClearFilter = () => {
    setSelectedCategories([]);
    setSelectedGlasses([]);
    setSelectedAlcohlic([]);
    setSelectedIngredientList([]);
    setSelectedIngredientsInput("");
    setRecipeName(null);
    onFilterClear();
  };

  const handleRecipeNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecipeName(event);

    const newFilterCriteria = {
      filter: FILTER_CRITERIA.recipeName,
      criteria: event,
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
      <Accordion defaultExpanded sx={{ b: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            display: "flex",
            justifyContent: "center",
            "& .MuiAccordionSummary-content": {
              display: "flex",
              justifyContent: "center",
              flex: "1 0 auto",
              marginLeft: "24px",
            },
          }}
        >
          <Typography
            className={spaceGrotesk.className}
            sx={{ textAlign: "center", fontWeight: "bold" }}
          >
            Search By..
          </Typography>
        </AccordionSummary>

        <Box sx={{ p: 2.5 }}>
          <FormControl>
            <RadioGroup
              row
              onChange={setFilteringLogic}
              value={filteringLogic}
            >
              <FormControlLabel value="Or" control={<Radio />} label="Or" />
              <FormControlLabel value="And" control={<Radio />} label="And" />
            </RadioGroup>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Autocomplete
              disablePortal
              options={recipeAllRecipes}
              value={
                recipeName
                  ? recipeAllRecipes.find(
                      (recipe) =>
                        recipe.strDrink.toLowerCase() ===
                        recipeName.toLowerCase()
                    ) || null
                  : null
              }
              getOptionLabel={(option) => option.strDrink}
              renderInput={(params) => (
                <TextField {...params} label="Recipe Name" />
              )}
              onChange={(event, newValue) => {
                onFilterChange(
                  newValue ? newValue.strDrink : null,
                  FILTER_CRITERIA.recipeName
                );
              }}
              isOptionEqualToValue={(option, value) =>
                option.strDrink.toLowerCase() ===
                (value?.strDrink || value).toLowerCase()
              }
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
        <CardContent
          style={{ textAlign: "center", paddingTop: 10, paddingBottom: 25 }}
        >
          <Button
            onClick={handleClearFilter}
            color="error"
            variant="outlined"
            startIcon={<ClearIcon />}
          >
            Clear
          </Button>
        </CardContent>
      </Accordion>
    </Box>
  );
}

export default FilterComponent;
