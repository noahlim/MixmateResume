"use client";
import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography, CardContent, Box, Pagination } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import WineBarIcon from "@mui/icons-material/WineBar";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActions } from "@/app/../lib/redux/userInfoSlice";
import MyIngredientRow from "./MyIngredientRow";
import LiquorIcon from "@mui/icons-material/Liquor";
import AvailableRecipes from "./AvailableRecipes";
import IngredientRow from "./IngredientRow";
import {
  API_DRINK_ROUTES,
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
  ingredientsByAlcoholic,
} from "@/app/_utilities/_client/constants";
import {
  displayErrorSnackMessage,
  isNotSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import { recipeActions } from "lib/redux/recipeSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import MarqueeScroll from "@/app/(components)/MarqueeAnimation";
import MyMixMateHeader from "@/app/(components)/MyMixMateHeader";
import BlogSection from "@/app/(components)/(shapeComponents)/BlogSection";
import IngredientCard from "./IngredientCard";
const MyIngredients = () => {
  // Validate session

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );

  const { user, error, isLoading } = useUser();

  const [pageIndex, setPageIndex] = useState(1);
  const [allIngredients, setAllIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  // const [displayedIngredients, setDisplayedIngredients] = useState([]);
  const [searchboxValue, setSearchboxValue] = useState("");
  const [availableRecipesModalOpen, setAvailableRecipesModalOpen] =
    useState(false);
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const [displayedCardItems, setDisplayedCardItems] = useState(null);

  const updateDisplayedIngredients = (index) => {
    const start = (index - 1) * 9;
    const end = index * 9;
    const ingredients =
      searchboxValue.length > 0 ? filteredIngredients : allIngredients;

    const selectedIngredients = ingredients.slice(0, 9);
    const selectedIngredientCards = (
      <IngredientCard ingredients={selectedIngredients} />
    );
    setDisplayedCardItems(selectedIngredientCards);
  };

  const handlePageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
    updateDisplayedIngredients(newPageIndex);
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

    if (searchText.length === 0) {
      setPageIndexCount(Math.ceil(allIngredients.length / 9));
      const selectedIngredients = allIngredients.slice(0, 9);
      const selectedIngredientCards = (
        <IngredientCard ingredients={selectedIngredients} />
      );
      setDisplayedCardItems(selectedIngredientCards);
      setFilteredIngredients(allIngredients);
      setPageIndex(1);
      return;
    }
    const matchedIngredients = allIngredients.filter((ingredient) =>
      ingredient.toLowerCase().includes(searchText)
    );
    setPageIndexCount(Math.ceil(matchedIngredients.length / 9));
    setFilteredIngredients(matchedIngredients);
    const selectedIngredients = matchedIngredients.slice(0, 9);
    const selectedIngredientCards = (
      <IngredientCard ingredients={selectedIngredients} />
    );
    setDisplayedCardItems(selectedIngredientCards);
  };

  let loadUserIngredients = () => {
    dispatch(pageStateActions.setPageLoadingState(false));
    if (!userIngredients || userIngredients.length < 1) {
      makeRequest(
        API_ROUTES.userIngredients,
        REQ_METHODS.get,
        { userId: user.sub },
        (response) => {
          console.log(response);
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
        setPageIndexCount(Math.ceil(response.data.length / 10));

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
        setAllIngredients(sortedIngredients);
        const displayedIngredients = sortedIngredients.slice(0, 9);
        console.log(displayedIngredients);
        const displayedIngredientCards = (
          <IngredientCard ingredients={displayedIngredients} />
        );
        setDisplayedCardItems(displayedIngredientCards);
        dispatch(recipeActions.setIngredients(sortedIngredients));
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        //dispatch(pageStateActions.setPageLoadingState(false));
        loadUserIngredients();
      });
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
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ margin: 15 }}>
            <CardContent
              style={{ textAlign: "center", paddingTop: 25, paddingBottom: 0 }}
            >
              <Typography variant="h6">Search Ingredients</Typography>
            </CardContent>

            {/* Searchbox */}
            <div style={{ padding: 25 }}>
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
            </div>
          </Paper>
          <div style={{ paddingLeft: 25, paddingRight: 55 }}>
            {displayedCardItems}
          </div>
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={4} // Margin top of 4 (adjust as needed)
      >
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
