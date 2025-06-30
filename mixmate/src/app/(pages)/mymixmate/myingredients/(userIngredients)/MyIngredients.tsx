"use client";
import React, { useEffect, useState, useCallback } from "react";
import FormControl from "@mui/material/FormControl";
import {
  Grid,
  Paper,
  Typography,
  CardContent,
  Box,
  Pagination,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActions } from "@/app/../lib/redux/userInfoSlice";

import AvailableRecipes from "./AvailableRecipes";

import {
  API_DRINK_ROUTES,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import { recipeActions } from "lib/redux/recipeSlice";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import MarqueeAnimation from "@/app/(components)/(shapeComponents)/MarqueeAnimation";
import MyMixMateHeader from "@/app/(components)/MyMixMateHeader";
import IngredientCards from "./IngredientCards";
import { Ingredient } from "interface/ingredient";
interface FilterState {
  searchText: string;
  alcoholic: boolean;
  nonAlcoholic: boolean;
  isUserList: boolean;
}

const MyIngredients = () => {
  // Validate session

  const dispatch = useDispatch();
  const userIngredients: Ingredient[] = useSelector(
    (state: any) => state.userInfo.userIngredients
  );
  const allIngredients: Ingredient[] = useSelector(
    (state: any) => state.recipe.ingredients
  );

  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [filteredDisplayedIngredients, setFilteredDisplayedIngredients] =
    useState<Ingredient[]>([]);
  const [availableRecipesModalOpen, setAvailableRecipesModalOpen] =
    useState(false);
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const [displayedCardItems, setDisplayedCardItems] = useState(null);

  const handleAvailableRecipesModalOpen = () => {
    if (userIngredients.length > 0) {
      setAvailableRecipesModalOpen(true);
    } else {
      setIsWarningModalOpen(true);
    }
  };

  const handleAlcoholCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    let tempFilterState: FilterState;
    if (name === "Alcoholic") {
      tempFilterState = {
        ...filterState,
        alcoholic: checked,
        nonAlcoholic: false,
      };
    } else if (name === "Non_Alcoholic") {
      tempFilterState = {
        ...filterState,
        nonAlcoholic: checked,
        alcoholic: false,
      };
    }
    handleFilterChange(tempFilterState);
  };

  const [filterState, setFilterState] = useState<FilterState>({
    searchText: "",
    alcoholic: false,
    nonAlcoholic: false,
    isUserList: false,
  });

  const updateDisplayedStateOnIndexChange = (index) => {
    const start = (index - 1) * 9;
    const end = index * 9;

    const selectedIngredients: Ingredient[] =
      filteredDisplayedIngredients.slice(start, end);
    const selectedIngredientCards = (
      <IngredientCards
        ingredients={selectedIngredients}
        reloadIngredients={loadIngredients}
        isUserList={filterState.isUserList}
      />
    );
    setDisplayedCardItems(selectedIngredientCards);
  };

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
    updateDisplayedStateOnIndexChange(newPageIndex);
  };

  let onPageIndexChange = (e) => {
    const buttonLabel = e.currentTarget.getAttribute("aria-label");
    if (buttonLabel === "Go to next page" && pageIndex < pageIndexCount) {
      handlePageChange(pageIndex + 1);
    } else if (buttonLabel === "Go to previous page" && pageIndex > 1) {
      handlePageChange(pageIndex - 1);
    } else if (buttonLabel === "Go to first page" && pageIndex > 1) {
      handlePageChange(1);
    } else if (
      buttonLabel === "Go to last page" &&
      pageIndex < pageIndexCount
    ) {
      handlePageChange(pageIndexCount);
    } else if (e.target.innerText) {
      const index = parseInt(e.target.innerText);
      handlePageChange(index);
    } else {
      alert("Invalid page index");
    }
  };

  const handleFilterChange = (tempFilterState: FilterState) => {
    // isUserList?
    try {
      const baseIngredients: Ingredient[] = tempFilterState.isUserList
        ? userIngredients
        : allIngredients;

      //filter by alcohol content
      let filteredIngredients: Ingredient[] = baseIngredients;
      if (tempFilterState.alcoholic) {
        filteredIngredients = filteredIngredients.filter(
          (ingredient) => ingredient.strAlcoholic
        );
      } else if (tempFilterState.nonAlcoholic) {
        filteredIngredients = filteredIngredients.filter(
          (ingredient) => !ingredient.strAlcoholic
        );
      } else if (!tempFilterState.alcoholic && !tempFilterState.nonAlcoholic) {
        filteredIngredients = baseIngredients;
      }

      // searchbox criteria
      let matchedIngredients: Ingredient[];
      if (tempFilterState.searchText.length === 0) {
        matchedIngredients = filteredIngredients;
      } else {
        const searchText = tempFilterState.searchText.toLowerCase();
        matchedIngredients = filteredIngredients.filter((ingredient) =>
          ingredient.strIngredient1.toLowerCase().includes(searchText)
        );
      }

      matchedIngredients = [...matchedIngredients].sort((a, b) => {
        const ingredientA = a.strIngredient1.toUpperCase();
        const ingredientB = b.strIngredient1.toUpperCase();
        if (ingredientA < ingredientB) {
          return -1;
        }
        if (ingredientA > ingredientB) {
          return 1;
        }
        return 0;
      });
      setPageIndex(1);
      setPageIndexCount(Math.ceil(matchedIngredients.length / 9));
      setFilterState(tempFilterState);
      setFilteredDisplayedIngredients(matchedIngredients);
      updateIngredientsState(matchedIngredients);
    } catch (e) {}
  };
  const updateIngredientsState = (ingredients: Ingredient[]) => {
    const selectedIngredients: Ingredient[] = ingredients.slice(0, 9);
    const selectedIngredientCards = (
      <IngredientCards
        ingredients={selectedIngredients}
        reloadIngredients={loadIngredients}
        isUserList={filterState.isUserList}
      />
    );

    setDisplayedCardItems(selectedIngredientCards);
  };
  const handleUserListFilter = () => {
    const tempFilterState: FilterState = {
      ...filterState,
      isUserList: !filterState.isUserList,
    };
    handleFilterChange(tempFilterState);
  };
  const handleSearchboxChange = (e) => {
    const searchText = e.target.value;
    const tempFilterState = { ...filterState, searchText };
    handleFilterChange(tempFilterState);
  };

  const loadUserIngredients = useCallback(() => {
    if (!userIngredients || userIngredients.length < 1) {
      makeRequest(
        API_ROUTES.userIngredients,
        REQ_METHODS.get,
        {},
        (response) => {
          dispatch(
            userInfoActions.setUserIngredients(response.data.ingredients)
          );
        }
      ).catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      });
    }
    dispatch(pageStateActions.setPageLoadingState(false));
  }, [userIngredients, dispatch]);

  const loadIngredients = useCallback(() => {
    dispatch(pageStateActions.setPageLoadingState(true));
    if (!allIngredients || allIngredients.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.ingredients },
        (response) => {
          const updatedIngredients: Ingredient[] = response.data.map((item) => {
            if (item.strIngredient1 === "AÃ±ejo rum") {
              return { ...item, strIngredient1: "Añejo Rum" };
            }
            return item;
          });
          setPageIndexCount(Math.ceil(response.data.length / 9));
          const sortedIngredients: Ingredient[] = updatedIngredients.sort(
            (a, b) => {
              const ingredientA = a.strIngredient1.toUpperCase();
              const ingredientB = b.strIngredient1.toUpperCase();
              if (ingredientA < ingredientB) {
                return -1;
              }
              if (ingredientA > ingredientB) {
                return 1;
              }
              return 0;
            }
          );
          const displayedIngredients = sortedIngredients.slice(0, 9);
          const displayedIngredientCards = (
            <IngredientCards
              ingredients={displayedIngredients}
              reloadIngredients={loadIngredients}
              isUserList={filterState.isUserList}
            />
          );
          setFilteredDisplayedIngredients(sortedIngredients);
          updateIngredientsState(sortedIngredients);
          setDisplayedCardItems(displayedIngredientCards);
          console.log("Ingredients loaded:", sortedIngredients);
          console.log("Displayed card items:", displayedIngredientCards);
          dispatch(recipeActions.setIngredients(sortedIngredients));
        }
      )
        .catch((error) => {
          displayErrorSnackMessage(error, dispatch);
        })
        .finally(() => {
          loadUserIngredients();
        });
    } else {
      loadUserIngredients();
    }
  }, [allIngredients, dispatch, filterState.isUserList, loadUserIngredients]);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  return (
    <Box sx={{ width: "100%" }}>
      <AvailableRecipes
        isSingleIngredient={false}
        open={availableRecipesModalOpen}
        setOpen={handleAvailableRecipesModalOpen}
        setClose={() => setAvailableRecipesModalOpen(false)}
      />
      <Dialog
        open={isWarningModalOpen}
        onClose={() => setIsWarningModalOpen(false)}
      >
        <DialogContent>
          <DialogContentText
            id="sign-in-dialog-description"
            style={{ fontSize: "1.1rem" }}
          >
            Please add some ingredients to your list to view available recipes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsWarningModalOpen(false)} color="primary">
            Ok!
          </Button>
        </DialogActions>
      </Dialog>
      {/* Page body */}
      <MyMixMateHeader title="My Ingredients">
        Unlock a world of personalized possibilities by curating your own
        inventory of ingredients and mixtures, unveiling a tailored selection of
        tantalizing cocktail creations that harmoniously blend the flavors you
        have on hand, empowering you to craft libations that perfectly align
        with your unique tastes and preferences.
      </MyMixMateHeader>
      <Grid
        container
        spacing={2}
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Grid item xs={12} md={6} lg={4}>
          <Paper
            elevation={6}
            sx={{
              margin: 15,
              background: "rgba(26, 26, 46, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: 20,
              boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.25)",
              border: "1px solid rgba(255, 215, 0, 0.2)",
              color: "#fff",
            }}
          >
            <CardContent
              sx={{ textAlign: "center", paddingTop: 20, paddingBottom: 0 }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#ffd700", fontWeight: 700, mb: 2 }}
              >
                Search Ingredients
              </Typography>
            </CardContent>
            {/* Searchbox */}
            <Box sx={{ padding: 2.5 }}>
              <FormControl
                component="fieldset"
                sx={{ m: 1, mb: 2 }}
                variant="standard"
              >
                <FormLabel
                  sx={{
                    color: "#ffd700",
                    fontWeight: 600,
                    mb: 1,
                    fontSize: "0.9rem",
                  }}
                >
                  Filter by Alcoholic Content
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterState.alcoholic}
                        onChange={handleAlcoholCheckboxChange}
                        name="Alcoholic"
                        sx={{
                          color: "#ffd700",
                          "&.Mui-checked": {
                            color: "#ffd700",
                          },
                        }}
                      />
                    }
                    label={
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                        }}
                      >
                        Alcoholic
                      </span>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterState.nonAlcoholic}
                        onChange={handleAlcoholCheckboxChange}
                        name="Non_Alcoholic"
                        sx={{
                          color: "#ffd700",
                          "&.Mui-checked": {
                            color: "#ffd700",
                          },
                        }}
                      />
                    }
                    label={
                      <span
                        style={{
                          color: "#fff",
                          fontWeight: 500,
                          fontSize: "0.9rem",
                        }}
                      >
                        Non-Alcoholic
                      </span>
                    }
                  />
                </FormGroup>
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <TextField
                  label="Search ingredients..."
                  type="string"
                  variant="outlined"
                  value={filterState.searchText}
                  onChange={handleSearchboxChange}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "48px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      color: "#ffd700",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    },
                    sx: { "&.Mui-focused": { color: "#ffd700" } },
                  }}
                  InputProps={{
                    style: {
                      color: "#fff",
                      borderColor: "#ffd700",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                    },
                    sx: {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255, 215, 0, 0.5)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffd700",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffd700",
                      },
                    },
                  }}
                />
              </FormControl>
              <Button
                onClick={handleUserListFilter}
                sx={{
                  color: "#fff",
                  background: filterState.isUserList
                    ? "linear-gradient(90deg, #5CC5E1 60%, #009CC6 100%)"
                    : "linear-gradient(90deg, #ffd700 60%, #ffe066 100%)",
                  fontWeight: 700,
                  fontSize: 14,
                  borderRadius: 99,
                  mt: 2,
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: filterState.isUserList
                      ? "linear-gradient(90deg, #009CC6 60%, #5CC5E1 100%)"
                      : "linear-gradient(90deg, #ffe066 60%, #ffd700 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  },
                }}
              >
                {filterState.isUserList
                  ? "Check Out All Ingredients"
                  : "Filter Out Ingredients In My List"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Available Recipes Button - Made more prominent */}
      <Grid container justifyContent="center" sx={{ mt: 4, mb: 3 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={handleAvailableRecipesModalOpen}
            sx={{
              background:
                "linear-gradient(135deg, #ffd700 0%, #ffe066 50%, #ffd700 100%)",
              color: "#181a2e",
              fontWeight: 800,
              fontSize: 20,
              borderRadius: 99,
              px: 6,
              py: 2,
              boxShadow: "0 8px 32px rgba(255, 215, 0, 0.4)",
              transition: "all 0.3s ease",
              textTransform: "none",
              letterSpacing: 1,
              border: "2px solid rgba(255, 215, 0, 0.5)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #ffe066 0%, #ffd700 50%, #ffe066 100%)",
                color: "#181a2e",
                transform: "translateY(-4px) scale(1.05)",
                boxShadow: "0 12px 40px rgba(255, 215, 0, 0.6)",
                border: "2px solid rgba(255, 215, 0, 0.7)",
              },
            }}
          >
            🍹 Available Recipes with My Ingredients 🍹
          </Button>
        </Grid>
      </Grid>

      {/* Status Indicator - Made more prominent */}
      <Grid container justifyContent="center" sx={{ mb: 3 }}>
        <Grid item>
          <Box
            sx={{
              background: filterState.isUserList
                ? "linear-gradient(90deg, #5CC5E1 60%, #009CC6 100%)"
                : "linear-gradient(90deg, #ffd700 60%, #ffe066 100%)",
              color: "#181a2e",
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 99,
              px: 4,
              py: 2,
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {filterState.isUserList ? (
              <>
                🛒 Currently viewing: <strong>My Ingredients Cart</strong>
              </>
            ) : (
              <>
                📋 Currently viewing: <strong>All Available Ingredients</strong>
              </>
            )}
          </Box>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {displayedCardItems}
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        padding={3}
      >
        <Pagination
          count={pageIndexCount}
          defaultPage={6}
          siblingCount={0}
          boundaryCount={2}
          onChange={onPageIndexChange}
          page={pageIndex}
          variant="outlined"
          shape="rounded"
          color="primary"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              backgroundColor: "#FFFFFF",
              marginBottom: 1,
            },
          }}
        />
      </Box>
      <MarqueeAnimation direction="left" />
    </Box>
  );
};

export default withPageAuthRequired(MyIngredients);
