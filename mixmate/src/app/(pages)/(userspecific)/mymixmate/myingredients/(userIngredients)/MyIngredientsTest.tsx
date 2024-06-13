"use client";
import React, { useEffect, useState } from "react";
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
  FormHelperText,
  Button,
  Switch,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActions } from "@/app/../lib/redux/userInfoSlice";

import AvailableRecipes from "./AvailableRecipes";

import {
  API_DRINK_ROUTES,
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
} from "@/app/_utilities/_client/constants";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import { recipeActions } from "lib/redux/recipeSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import MarqueeScroll from "@/app/(components)/MarqueeAnimation";
import MyMixMateHeader from "@/app/(components)/MyMixMateHeader";
import IngredientCards from "./IngredientCards";
import { set } from "@auth0/nextjs-auth0/dist/session";
const MyIngredients = () => {
  // Validate session

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );
  const allIngredients = useSelector((state: any) => state.recipe.ingredients);

  const { user, error, isLoading } = useUser();

  const [pageIndex, setPageIndex] = useState(1);
  const [filteredIngredientsByName, setFilteredIngredientsByName] = useState(
    []
  );
  const [filteredIngredientsByAlcohol, setFilteredIngredientsByAlcohol] =
    useState([]);

  const [filteredDisplayedIngredients, setFilteredDisplayedIngredients] = useState([]);
  const [searchboxValue, setSearchboxValue] = useState("");
  const [availableRecipesModalOpen, setAvailableRecipesModalOpen] =
    useState(false);
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const [displayedCardItems, setDisplayedCardItems] = useState(null);
  const [alcoholicCheckBoxState, setAlcoholicCheckBoxState] = useState({
    Alcoholic: false,
    Non_Alcoholic: false,
  });
  const [
    isUserIngredientListFilterApplied,
    setIsUserIngredientListFilterApplied,
  ] = useState(false);

  console.log(isUserIngredientListFilterApplied);
  const handleAlcoholCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;

    let newState = { Alcoholic: false, Non_Alcoholic: false };

    // const ingredients = isUserIngredientListFilterApplied
    //   ? userIngredients
    //   : allIngredients;
    if (checked) {
      newState =
        name === "Alcoholic"
          ? { Alcoholic: true, Non_Alcoholic: false }
          : { Alcoholic: false, Non_Alcoholic: true };
      let filteredIngredients = allIngredients.filter((ingredient) =>
        name === "Alcoholic"
          ? ingredient.strAlcoholic
          : !ingredient.strAlcoholic
      );
      // if (isUserIngredientListFilterApplied) {
      //   filteredIngredients = filteredIngredients.filter((ingredient) =>
      //     userIngredients.some(
      //       (userIngredient) =>
      //         userIngredient.strIngredient1.toLowerCase() ===
      //         ingredient.strIngredient1.toLowerCase()
      //     )
      //   );
      // }
      updateIngredientsState(filteredIngredients);
      //setFilteredIngredientsByAlcohol(ingredients);
    } else {
      updateIngredientsState(allIngredients);
    }
    setIsUserIngredientListFilterApplied(!isUserIngredientListFilterApplied);
    setPageIndex(1);
    setAlcoholicCheckBoxState(newState);
  };

  const { Alcoholic, Non_Alcoholic } = alcoholicCheckBoxState;

  const updateIngredientsState = (ingredients) => {
    setPageIndexCount(Math.ceil(ingredients.length / 9));

    const selectedIngredients = ingredients.slice(0, 9);
    const selectedIngredientCards = (
      <IngredientCards
        ingredients={selectedIngredients}
        reloadIngredients={loadIngredients}
      />
    );

    setDisplayedCardItems(ingredients);
  };

  const updateDisplayedStateOnIndexChange = (index) => {
    const start = (index - 1) * 9;
    const end = index * 9;

    const selectedIngredients = filteredIngredientsByAlcohol.slice(start, end);
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
    } else if (e.target.innerText) {
      const index = parseInt(e.target.innerText);
      handlePageChange(index);
    } else {
      alert("Invalid page index");
    }
  };

  const handleSearchboxChange = async (e) => {
    await setSearchboxValue(e.target.value);
    const searchText = e.target.value.toLowerCase();

    //when the search box is empty display all ingredients
    if (searchText.length === 0) {
      updateIngredientsState(filteredIngredientsByAlcohol);
      setPageIndex(1);
      return;
    }

    //filter the ingredients based on the search text
    const matchedIngredients = filteredIngredientsByAlcohol.filter(
      (ingredient) =>
        ingredient.strIngredient1.toLowerCase().includes(searchText)
    );
    updateIngredientsState(matchedIngredients);
    setPageIndex(1);
  };

  let loadUserIngredients = () => {
    if (!userIngredients || userIngredients.length < 1) {
      makeRequest(
        API_ROUTES.userIngredients,
        REQ_METHODS.get,
        { userId: user.sub },
        (response) => {
          dispatch(
            userInfoActions.setUserIngredients(response.data.ingredients)
          );

          const toastMessageObject: ToastMessage = {
            open: true,
            message:
              response.data.ingredients.length > 0
                ? response.data.ingredients.length + " ingredient(s) found."
                : "No ingredient(s) found.",
            severity: SEVERITY.Success,
            title: "Ingredients",
          };
          dispatch(pageStateActions.setToastMessage(toastMessageObject));
        }
      )
        .catch((error) => {
          displayErrorSnackMessage(error, dispatch);
        })
        .finally(() => {
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    }
  };

  let loadIngredients = () => {
    dispatch(pageStateActions.setPageLoadingState(true));
    //when the page has not been loaded before and the
    //ingredients are not in the redux store
    if (!allIngredients || allIngredients.length === 0)
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.ingredients },
        (response) => {
          const updatedIngredients = response.data.map((item) => {
            if (item.strIngredient1 === "AÃ±ejo rum") {
              return { ...item, strIngredient1: "Añejo Rum" };
            }
            return item;
          });
          setPageIndexCount(Math.ceil(response.data.length / 9));

          const sortedIngredients = updatedIngredients.sort((a, b) => {
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
          const displayedIngredients = sortedIngredients.slice(0, 9);
          setFilteredIngredientsByName(sortedIngredients);
          setFilteredIngredientsByAlcohol(sortedIngredients);
          const displayedIngredientCards = (
            <IngredientCards
              ingredients={displayedIngredients}
              reloadIngredients={loadIngredients}
            />
          );
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
      const displayedIngredients = allIngredients.slice(0, 9);

      setFilteredIngredientsByName(allIngredients);
      setFilteredIngredientsByAlcohol(allIngredients);
      const displayedIngredientCards = (
        <IngredientCards
          ingredients={displayedIngredients}
          reloadIngredients={loadIngredients}
        />
      );
      setDisplayedCardItems(displayedIngredientCards);
      loadUserIngredients();
    }
  };

  const filterIngredientsInUserList = () => {
    const searchText = searchboxValue.toLowerCase();

    //when the search box is empty display all ingredients
    if (searchText.length === 0) {
      let matchedIngredients;

      //display ingredients in the user list only
      //the isUserIngredientListFilterApplied is set to the opposite for now
      //and will be toggled at the end of the function
      if (!isUserIngredientListFilterApplied) {
        matchedIngredients = filteredIngredientsByAlcohol.filter((ingredient) =>
          userIngredients.some(
            (userIngredient) =>
              userIngredient.strIngredient1.toLowerCase() ===
              ingredient.strIngredient1.toLowerCase()
          )
        );
      } else {
        //display all ingredients
        matchedIngredients = filteredIngredientsByAlcohol;
      }
      setPageIndex(1);
      setPageIndexCount(Math.ceil(matchedIngredients.length / 9));
      setFilteredIngredientsByName(matchedIngredients);
      const selectedIngredients = matchedIngredients.slice(0, 9);
      const selectedIngredientCards = (
        <IngredientCards
          ingredients={selectedIngredients}
          reloadIngredients={loadIngredients}
        />
      );
      setDisplayedCardItems(selectedIngredientCards);
    }
    //filter the ingredients based on the search text
    else {
      if (isUserIngredientListFilterApplied) {
      }
    }
    setIsUserIngredientListFilterApplied(!isUserIngredientListFilterApplied);
  };
  useEffect(() => {
    loadIngredients();
  }, []);

  return (
    <>
      <AvailableRecipes
        isSingleIngredient={false}
        open={availableRecipesModalOpen}
        setOpen={setAvailableRecipesModalOpen}
      />
      {/* Page body */}
      <MyMixMateHeader title="My Ingredients">
        Unlock a world of personalized culinary possibilities by curating your
        own inventory of ingredients, unveiling a tailored selection of
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
                        checked={Alcoholic}
                        onChange={handleAlcoholCheckboxChange}
                        name="Alcoholic"
                      />
                    }
                    label="Alcoholic"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={Non_Alcoholic}
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
                  value={searchboxValue}
                  onChange={handleSearchboxChange}
                  margin="normal"
                />
              </FormControl>
              <Button
                onClick={filterIngredientsInUserList}
                sx={{
                  color: isUserIngredientListFilterApplied
                    ? "#5CC5E1"
                    : "#ACCEFF",
                  paddingTop: 2,
                  fontSize: 16,
                }}
              >
                {isUserIngredientListFilterApplied
                  ? "Check Out All Ingredients"
                  : "Filter Out Ingredients In My List"}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {displayedCardItems}
      </Grid>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Pagination
          count={pageIndexCount}
          defaultPage={6}
          siblingCount={0}
          boundaryCount={2}
          onChange={onPageIndexChange}
          page={pageIndex}
        />
      </Box>
      <MarqueeScroll direction="left" />
    </>
  );
};

export default withPageAuthRequired(MyIngredients);
