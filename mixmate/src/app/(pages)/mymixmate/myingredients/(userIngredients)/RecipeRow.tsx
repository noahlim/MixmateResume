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
    let loadDrinkInfo = () => {
      if (isNotSet(drinkInfo)) {
        dispatch(pageStateActions.setPageLoadingState(true));
        // Load drink info
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

                let ingredientTypography = isIngredientInList(txtIngredient) ? (
                  <Typography
                    className={vollkorn.className}
                    sx={{ backgroundColor: "orange" }}
                  >
                    {capitalizeWords(txtIngredient)} <i>({txtMesurement})</i>
                  </Typography>
                ) : (
                  <Typography className={vollkorn.className}>
                    {capitalizeWords(txtIngredient)} <i>({txtMesurement})</i>
                  </Typography>
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
                          textShadow: "3px 3px 3px #F8F8F8",
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
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Category
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "2px solid #e0e0e0",
                          }}
                        >
                          <ClassIcon
                            sx={{
                              mr: 1,
                              color: "text.secondary",
                              fontSize: 20,
                            }}
                          />
                          <Typography variant="body1">
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
                          color="text.secondary"
                          sx={{ mb: 0.5 }}
                        >
                          Alcoholic type
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "2px solid #e0e0e0",
                            pb: 0.5,
                          }}
                        >
                          <LocalBarIcon
                            sx={{
                              mr: 1,
                              color: "text.secondary",
                              fontSize: 20,
                            }}
                          />
                          <Typography variant="body1">
                            {drink.strAlcoholic}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Glass type */}
                      <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                          Glass
                        </InputLabel>
                        <Input
                          className={vollkorn.className}
                          startAdornment={
                            <InputAdornment position="start">
                              <LocalDrinkIcon />
                            </InputAdornment>
                          }
                          value={drink.strGlass}
                        />
                      </FormControl>
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontWeight="bold"
                        sx={{ color: "black", fontSize: "20px" }}
                        className={sarabun.className}
                      >
                        Ingredients:
                      </Typography>
                      {drinkIngredients}
                      <br></br>
                      <Typography
                        fontWeight="bold"
                        sx={{ color: "black", fontSize: "20px" }}
                        className={sarabun.className}
                      >
                        Preparing Instructions
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        sx={{ color: "black", fontSize: "15px" }}
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
                        variant="outlined"
                        startIcon={<FavoriteIcon />}
                        sx={{
                          color: "black",
                          backgroundColor: "#FFA1A1 !important",
                          "&:hover": {
                            backgroundColor: "#FF5F5F !important",
                          },
                          "&:focus": {
                            backgroundColor: "#E91A1A !important",
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
      }

      // Done
      setRowOpen(!rowOpen);
    };
    loadDrinkInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderColor: "blue", border: 0 } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={onRowOpen}>
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
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
