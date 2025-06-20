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
    //when the page has not been loaded before and the
    //ingredients are not in the redux store
    if (!allIngredients || allIngredients.length === 0)
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
            />
          );
          setFilteredDisplayedIngredients(sortedIngredients);
          setDisplayedCardItems(displayedIngredientCards);
          dispatch(recipeActions.setIngredients(sortedIngredients));
        }
      )
        .catch((error) => {
          displayErrorSnackMessage(error, dispatch);
        })
        .finally(() => {
          loadUserIngredients();
        });
    //when the page has been loaded before and the ingredients
    //are already in the redux store
    else {
      if (!displayedCardItems || displayedCardItems.length === 0) {
        const displayedIngredients = allIngredients.slice(0, 9);

        const displayedIngredientCards = (
          <IngredientCards
            ingredients={displayedIngredients}
            reloadIngredients={loadIngredients}
          />
        );
        setDisplayedCardItems(displayedIngredientCards);
      }
      loadUserIngredients();
    }
    //eslint-disable-next-line
  }, [allIngredients, displayedCardItems, dispatch, loadUserIngredients]);

  useEffect(() => {
    loadIngredients();
  }, [loadIngredients]);

  return (
    <>
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
        <Grid item xs={12} md={8} lg={6}>
          <Paper elevation={3} style={{ margin: 15 }}>
            <CardContent
              style={{ textAlign: "center", paddingTop: 25, paddingBottom: 0 }}
            >
              <Typography variant="h6">Search Ingredients</Typography>
            </CardContent>

            {/* Searchbox */}
            <Box sx={{ padding: 2 }}>
              <FormControl
                component="fieldset"
                sx={{ m: 1 }}
                variant="standard"
              >
                <FormLabel>
                  Filter the ingredients By Alcoholic Content
                </FormLabel>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterState.alcoholic}
                        onChange={handleAlcoholCheckboxChange}
                        name="Alcoholic"
                      />
                    }
                    label="Alcoholic"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filterState.nonAlcoholic}
                        onChange={handleAlcoholCheckboxChange}
                        name="Non_Alcoholic"
                      />
                    }
                    label="Non-Alcoholic"
                  />
                </FormGroup>
              </FormControl>
              <FormControl variant="standard" fullWidth>
                <TextField
                  label="Search..."
                  type="string"
                  variant="outlined"
                  value={filterState.searchText}
                  onChange={handleSearchboxChange}
                  margin="normal"
                />
              </FormControl>
              <Button
                onClick={handleUserListFilter}
                sx={{
                  color: filterState.isUserList ? "#5CC5E1" : "#ACCEFF",
                  paddingTop: 2,
                  fontSize: 16,
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
      <Grid
        item
        xs={9}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Button
          variant="contained"
          onClick={handleAvailableRecipesModalOpen}
          sx={{
            backgroundColor: "#FFFFFF !important",
            "&:hover": {
              backgroundColor: "#E8E8E8 !important",
            },
            "&:focus": {
              backgroundColor: "#CDCDCD !important",
            },
          }}
        >
          Check out the available recipes!
        </Button>
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
    </>
  );
};

export default withPageAuthRequired(MyIngredients);
