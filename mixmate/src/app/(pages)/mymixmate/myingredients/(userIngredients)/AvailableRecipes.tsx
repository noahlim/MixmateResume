import React, { useState, useEffect, useCallback } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import RecipeRow from "./RecipeRow";
import {
  capitalizeWords,
  makeRequest,
  displayErrorSnackMessage,
} from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "@/app/_utilities/_client/constants";
import { useDispatch, useSelector } from "react-redux";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { Pagination } from "@mui/material";
import { pageStateActions } from "lib/redux/pageStateSlice";
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

const AvailableRecipes = ({
  isSingleIngredient,
  open,
  setOpen,
  setClose,
  ingredient = null,
}) => {
  const theme = useTheme();

  const [pageIndexCount, setPageIndexCount] = useState(1);
  const [filteredAllRecipes, setFilteredRecipes] = useState([]);
  const [filteredByIngredientsRecipes, setFilteredByIngredientsRecipes] =
    useState([]);
  const [ingredientName, setIngredientName] = useState([]);
  const [page, setPage] = useState(1);
  const [openRowId, setOpenRowId] = useState(null);

  const handleRowOpen = (rowId) => {
    setOpenRowId((prevOpenRowId) => (prevOpenRowId === rowId ? null : rowId));
  };

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleIngredientsFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setPage(1);
    //selecting the ingredient(s) in the input component
    //the selectedFilterIngredients are strings
    const selectedFilterIngredients =
      typeof value === "string" ? value.split(",") : value;
    setIngredientName(typeof value === "string" ? value.split(",") : value);
    const filteredRecipes = findRecipesWithAllIngredients(
      filteredAllRecipes,
      selectedFilterIngredients
    );
    setPageIndexCount(Math.ceil(filteredRecipes.length / 10));

    // Calculate the start and end indices for the slice based on the current page index
    const startIndex = 0;
    const endIndex = 10;
    const filteredRecipesByIndex = filteredRecipes.slice(startIndex, endIndex);

    setFilteredByIngredientsRecipes(filteredRecipesByIndex);
  };

  function findRecipesWithAllIngredients(recipes, selectedFilterIngredients) {
    // Filter recipes that contain all selected ingredients
    const filteredRecipes = recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((ingredient) =>
        ingredient.ingredient.toLowerCase()
      );

      return selectedFilterIngredients.every((ingredient) =>
        recipeIngredients.includes(ingredient.toLowerCase())
      );
    });

    // Sort the filteredRecipes array by the strDrink property
    filteredRecipes.sort((a, b) => {
      const drinkA = a.strDrink.toLowerCase();
      const drinkB = b.strDrink.toLowerCase();

      if (drinkA < drinkB) return -1;
      if (drinkA > drinkB) return 1;
      return 0;
    });
    return filteredRecipes;
  }

  const handleClose = () => {
    setClose();
    setIngredientName([]);
  };
  let onPageIndexChange = (e) => {
    const buttonLabel = e.currentTarget.getAttribute("aria-label");
    dispatch(pageStateActions.setPageLoadingState(true));

    if (buttonLabel === "Go to next page") {
      setPage(page + 1);
      loadAvailableRecipes(page + 1);
    } else if (buttonLabel === "Go to previous page" || page > 1) {
      setPage(page - 1);
      loadAvailableRecipes(page - 1);
    } else if (e.target.innerText) {
      setPage(parseInt(e.target.innerText));
      loadAvailableRecipes(parseInt(e.target.innerText));
    } else {
      alert("Invalid page index");
    }
  };

  let loadAvailableRecipes = (pageIndex = 1) => {
    const startIndex = (pageIndex - 1) * 10;
    const endIndex = startIndex + 10;

    const filteredRecipesByIndex = filteredAllRecipes.slice(
      startIndex,
      endIndex
    );
    setFilteredByIngredientsRecipes(filteredRecipesByIndex);
    dispatch(pageStateActions.setPageLoadingState(false));
  };
  let loadAllAvailableRecipes = useCallback((pageIndex = 1) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    const criteria = isSingleIngredient
      ? {
          singleIngredient: isSingleIngredient,
          ingredient: ingredient.strIngredient1,
        }
      : {};
    makeRequest(
      API_ROUTES.availableRecipes,
      REQ_METHODS.get,
      criteria,
      (response) => {
        setFilteredRecipes(response.data);

        setPageIndexCount(Math.ceil(response.data.length / 10));
        const startIndex = (pageIndex - 1) * 10;
        const endIndex = startIndex + 10;

        const filteredRecipesByIndex = response.data.slice(
          startIndex,
          endIndex
        );
        setFilteredByIngredientsRecipes(filteredRecipesByIndex);
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (open) {
      loadAllAvailableRecipes();
    }
    //eslint-disable-next-line
  }, [userIngredients, open, loadAllAvailableRecipes]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          background: "rgba(26, 26, 46, 0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid #ffd70044",
          borderRadius: "20px",
          color: "#fff",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
        },
      }}
    >
      <DialogTitle>
        <Typography
          paddingRight="20px"
          sx={{
            fontSize: "1.2em",
            fontFamily: "inherit",
            color: "#ffd700",
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          {userIngredients.length === 0
            ? "No Available Recipes"
            : userIngredients.length === 1
            ? `Available Recipes with ${capitalizeWords(
                userIngredients[0].strIngredient1
              )}`
            : "Available Recipes with your Current Ingredients"}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#ffd700",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          paddingX: 2,
          overflowY: "auto",
          maxHeight: "calc(100vh - 96px)",
          color: "#fff",
          "&:first-of-type": {
            paddingTop: 0,
          },
        }}
      >
        <Grid container justifyContent="center" alignItems="stretch">
          <Grid item xs={12}>
            <Table aria-label="collapsible table" sx={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    colSpan={2}
                    sx={{
                      background: "rgba(26,26,46,0.85)",
                      borderBottom: "1px solid #ffd70044",
                    }}
                  >
                    <CardContent
                      style={{
                        textAlign: "center",
                        paddingTop: 10,
                        paddingBottom: 0,
                        background: "none",
                        color: "#fff",
                      }}
                    >
                      <Box
                        display="flow"
                        justifyContent="center"
                        alignItems="center"
                        margin={2}
                      >
                        <Typography
                          variant="h6"
                          sx={{ color: "#ffd700", fontWeight: 700 }}
                        >
                          Recipes
                        </Typography>
                        <FormControl sx={{ m: 1, width: "100%" }}>
                          {!isSingleIngredient && (
                            <>
                              <InputLabel
                                id="demo-multiple-chip-label"
                                sx={{ color: "#ffd700" }}
                              >
                                Filter by Ingredients
                              </InputLabel>
                              <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={ingredientName}
                                onChange={handleIngredientsFilterChange}
                                input={
                                  <OutlinedInput
                                    id="select-multiple-chip"
                                    label="Filter by Ingredients"
                                    sx={{ color: "#fff" }}
                                  />
                                }
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((value) => (
                                      <Chip
                                        key={value}
                                        label={value}
                                        sx={{
                                          background: "#ffd700",
                                          color: "#181a2e",
                                          fontWeight: 700,
                                        }}
                                      />
                                    ))}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                                sx={{
                                  color: "#fff",
                                  ".MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#ffd700",
                                  },
                                  "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    { borderColor: "#ffd700" },
                                }}
                              >
                                {userIngredients.map((ing) => (
                                  <MenuItem
                                    key={ing.strIngredient1}
                                    value={ing.strIngredient1}
                                    style={getStyles(
                                      ing.strIngredient1,
                                      ingredientName,
                                      theme
                                    )}
                                  >
                                    {ing.strIngredient1}
                                  </MenuItem>
                                ))}
                              </Select>
                            </>
                          )}
                        </FormControl>
                      </Box>
                    </CardContent>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredByIngredientsRecipes?.map((drink) => (
                  <RecipeRow
                    key={drink.idDrink}
                    drink={drink}
                    isOpen={openRowId === drink.idDrink}
                    onRowOpen={() => handleRowOpen(drink.idDrink)}
                  />
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={5}
          marginX={2}
        >
          <Pagination
            shape="rounded"
            variant="outlined"
            count={pageIndexCount}
            page={page}
            defaultPage={1}
            boundaryCount={10}
            onChange={onPageIndexChange}
            sx={{
              "& .MuiPaginationItem-root": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                color: "#ffd700",
                fontWeight: 600,
                border: "1px solid rgba(255, 215, 0, 0.3)",
                "&:hover": {
                  backgroundColor: "#ffd700",
                  color: "#181a2e",
                },
                "&.Mui-selected": {
                  backgroundColor: "#ffd700",
                  color: "#181a2e",
                  fontWeight: 700,
                },
              },
              "& .MuiPaginationItem-icon": {
                color: "#ffd700",
              },
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default AvailableRecipes;
