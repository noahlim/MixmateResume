import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import {
  isNotSet,
  isSet,
  capitalizeWords,
  makeRequest,
  displayErrorSnackMessage,
} from "@/app/_utilities/_client/utilities";
import {
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
} from "@/app/_utilities/_client/constants";
import { useDispatch, useSelector } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { userInfoActions } from "lib/redux/userInfoSlice";
// import Image from "next/image";
import { ToastMessage } from "interface/toastMessage";
import { Sarabun, Vollkorn } from "next/font/google";
const vollkorn = Vollkorn({ subsets: ["latin"], weight: "variable" });
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });

function RecipeRow({ drink, isOpen, onRowOpen }) {
  // Variables
  const [rowOpen, setRowOpen] = useState(false);
  const [drinkInfo, setDrinkInfo] = useState(null);
  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );

  const isIngredientInList = (ingredient) => {
    for (let word of userIngredients) {
      if (word.strIngredient1.toLowerCase() == ingredient.toLowerCase()) {
        return true;
      }
    }
    return false;
  };

  const handleAddIngredientToList = async (ingredient) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    // Check if ingredient already exists
    const matchedIngredients = userIngredients.find(
      (ing) => ing.strIngredient1.toLowerCase() === ingredient.toLowerCase()
    );

    if (matchedIngredients !== undefined) {
      const toastMessageObject: ToastMessage = {
        open: true,
        message: "Selected Ingredient already exists on your list!",
        severity: SEVERITY.Warning,
        title: "Ingredients",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
      dispatch(pageStateActions.setPageLoadingState(false));
      return;
    }

    // Add the new ingredient to the database
    const ingredientToAdd = {
      strIngredient1: ingredient,
      strIngredientThumb: `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
        ingredient
      )}.png`,
      strAlcoholic: false, // Default to non-alcoholic, can be updated later
    };

    makeRequest(
      API_ROUTES.userIngredients,
      REQ_METHODS.post,
      { ingredient: ingredientToAdd },
      (response) => {
        const toastMessageObject: ToastMessage = {
          open: true,
          message: response.message,
          severity: SEVERITY.Success,
          title: "Ingredients",
        };
        const tempIngredients = [...userIngredients];
        tempIngredients.push(ingredientToAdd);
        // Add the new item to the redux state
        dispatch(userInfoActions.setUserIngredients(tempIngredients));
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };

  const handleAddToFavourites = (recipe) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.post,
      { recipe },
      (response) => {
        const toastMessageObject: ToastMessage = {
          message: response.message,
          severity: SEVERITY.Success,
          title: "Recipe",
          open: true,
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
  };
  useEffect(() => {
    // Only fetch if drinkInfo is not already set
    if (!drinkInfo) {
      let loadDrinkInfo = () => {
        dispatch(pageStateActions.setPageLoadingState(true));
        makeRequest(
          API_ROUTES.drinkbyid,
          REQ_METHODS.get,
          { drinkid: drink._id },
          (response) => {
            let drinkDetails = null;
            if (isSet(response.data)) {
              let drink = response.data;
              // Format ingredients
              let drinkIngredients = [];
              drink.ingredients.forEach((ingredient) => {
                let txtIngredient = ingredient.ingredient
                  ? ingredient.ingredient
                  : "N/A";
                let txtMesurement = ingredient.measure
                  ? ingredient.measure
                  : "N/A";
                let ingredientTypography = (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      className={vollkorn.className}
                      sx={{ color: "#fff" }}
                    >
                      {capitalizeWords(txtIngredient)} <i>({txtMesurement})</i>
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddIngredientToList(txtIngredient)}
                      sx={{
                        color: "#ffd700",
                        borderColor: "#ffd700",
                        fontSize: "0.75rem",
                        padding: "2px 8px",
                        minWidth: "auto",
                        "&:hover": {
                          backgroundColor: "rgba(255, 215, 0, 0.1)",
                          borderColor: "#ffd700",
                        },
                      }}
                    >
                      Add to My List
                    </Button>
                  </Box>
                );
                drinkIngredients.push(ingredientTypography);
              });
              drinkDetails = (
                <Box marginTop={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <img
                        src={
                          drink.strDrinkThumb
                            ? drink.strDrinkThumb
                            : "/not-found-icon.png"
                        }
                        alt="Drink"
                        width={700}
                        height={700}
                        style={{ borderRadius: "7%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <Typography
                        sx={{
                          fontSize: "30px",
                          textShadow: "3px 3px 3px rgba(0,0,0,0.5)",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                        className={vollkorn.className}
                      >
                        {drink.strDrink}
                      </Typography>

                      {/* Category */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "250px",
                          mb: 3,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ mb: 0.5, color: "#ffd700", fontWeight: 600 }}
                        >
                          Category
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "2px solid #ffd700",
                          }}
                        >
                          <ClassIcon
                            sx={{
                              mr: 1,
                              color: "#ffd700",
                              fontSize: 20,
                            }}
                          />
                          <Typography variant="body1" sx={{ color: "#fff" }}>
                            {drink.strCategory}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Alcoholic type */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          width: "250px",
                          mb: 3,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{ mb: 0.5, color: "#ffd700", fontWeight: 600 }}
                        >
                          Alcoholic type
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "2px solid #ffd700",
                            pb: 0.5,
                          }}
                        >
                          <LocalBarIcon
                            sx={{
                              mr: 1,
                              color: "#ffd700",
                              fontSize: 20,
                            }}
                          />
                          <Typography variant="body1" sx={{ color: "#fff" }}>
                            {drink.strAlcoholic}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Glass type */}
                      <FormControl variant="standard">
                        <InputLabel
                          htmlFor="input-with-icon-adornment"
                          sx={{ color: "#ffd700" }}
                        >
                          Glass
                        </InputLabel>
                        <Input
                          className={vollkorn.className}
                          startAdornment={
                            <InputAdornment position="start">
                              <LocalDrinkIcon sx={{ color: "#ffd700" }} />
                            </InputAdornment>
                          }
                          value={drink.strGlass}
                          sx={{
                            color: "#fff",
                            "& .MuiInput-input": {
                              color: "#fff",
                            },
                            "& .MuiInput-underline:before": {
                              borderBottomColor: "#ffd700",
                            },
                            "& .MuiInput-underline:after": {
                              borderBottomColor: "#ffd700",
                            },
                          }}
                        />
                      </FormControl>
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontWeight="bold"
                        sx={{ color: "#ffd700", fontSize: "20px" }}
                        className={sarabun.className}
                      >
                        Ingredients:
                      </Typography>
                      {drinkIngredients}
                      <br></br>
                      <Typography
                        fontWeight="bold"
                        sx={{ color: "#ffd700", fontSize: "20px" }}
                        className={sarabun.className}
                      >
                        Preparing Instructions
                      </Typography>
                      <Typography
                        sx={{
                          color: "#fff",
                          fontSize: "15px",
                          lineHeight: 1.6,
                        }}
                        className={sarabun.className}
                      >
                        {drink.strInstructions}
                      </Typography>
                    </Grid>
                    <Grid
                      xs
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ padding: 4 }}
                    >
                      <Button
                        onClick={() => handleAddToFavourites(drink)}
                        variant="contained"
                        startIcon={<FavoriteIcon />}
                        sx={{
                          color: "#fff",
                          background:
                            "linear-gradient(90deg, #ffd700 60%, #ffe066 100%)",
                          fontWeight: 700,
                          borderRadius: 99,
                          px: 3,
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #ffe066 60%, #ffd700 100%)",
                          },
                        }}
                      >
                        Add to My Favorites
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              );
            } else {
              drinkDetails = (
                <Box sx={{ margin: 5 }}>
                  <Typography variant="h6" gutterBottom>
                    Recipe not found
                  </Typography>
                </Box>
              );
            }
            setDrinkInfo(drinkDetails);
          }
        )
          .catch((error) => {
            displayErrorSnackMessage(error, dispatch);
            dispatch(pageStateActions.setPageLoadingState(false));
          })
          .finally(() => {
            dispatch(pageStateActions.setPageLoadingState(false));
          });
      };
      loadDrinkInfo();
    }
    // eslint-disable-next-line
  }, [isOpen]);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderColor: "blue", border: 0 } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={onRowOpen}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ color: "#fff", fontWeight: 600 }}
        >
          {capitalizeWords(drink.strDrink)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            {drinkInfo}
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
export default RecipeRow;
