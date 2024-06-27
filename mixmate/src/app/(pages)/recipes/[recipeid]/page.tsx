"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  API_ROUTES,
  APPLICATION_PAGE,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import {
  capitalizeWords,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import {
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Paper,
} from "@mui/material";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Lilita_One, Sarabun, Vollkorn } from "next/font/google";
const vollkorn = Vollkorn({ subsets: ["latin"], weight: "variable" });
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });
const RecipeById = ({ params }) => {
  const recipeId = params.recipeid;
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const fetchRecipeDetails = useCallback(() => {
    makeRequest(
      API_ROUTES.sharedRecipeById,
      REQ_METHODS.get,
      { recipeid: recipeId },
      (response) => {
        if (response.message === "Recipe not found") {
          makeRequest(
            API_ROUTES.drinkbyid,
            REQ_METHODS.get,
            { drinkid: recipeId },
            (response) => {
              if (response.message === "Drink not found") {
                notFound();
              }
              setRecipeAndIngredients(response.data);
            }
          );
        } else {
          setRecipeAndIngredients(response.data);
        }
      }
    );
  }, [recipeId]);
  const setRecipeAndIngredients = (drinkData) => {
    setRecipe(drinkData);
    if (drinkData.ingredients.length > 0) {
      setIngredients(
        drinkData.ingredients.map((ing, index) => {
          if (ing.ingredient && ing.measure) {
            return (
              <Typography
                key={index}
                sx={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "100%",
                }}
              >
                {capitalizeWords(ing.ingredient)} <i>({ing.measure})</i>
              </Typography>
            );
          }
        })
      );
    }
  };
  // Format ingredients

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]);
  if (!recipe) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => 9999 }} open={!recipe}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        m: 5,
      }}
    >
      <Paper sx={{ width: { xs: "90%", md: "80%" }, p: 3 }}>
        <Box>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", lg: "start" },
              alignContent: { xs: "center", lg: "start" },
            }}
          >
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 4,
              }}
            >
              <Typography
                sx={{
                  fontSize: "30px",
                  textShadow: "3px 3px 3px #F8F8F8",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "100%",
                }}
                className={vollkorn.className}
              >
                {recipe.strDrink}
                
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} lg={4}>
              <Image
                style={{ borderRadius: "7%" }}
                src={
                  recipe.strDrinkThumb
                    ? recipe.strDrinkThumb
                    : "/not-found-icon.png"
                }
                alt="Drink"
                height={700}
                width={700}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              {/* Category */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: {xs:"200px", md:"250px"},
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
                    pb: 0.5,
                  }}
                >
                  <ClassIcon
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography variant="body1">{recipe.strCategory}</Typography>
                </Box>
              </Box>

              {/* Alcoholic type */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: {xs:"200px", md:"250px"},
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
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography variant="body1">{recipe.strAlcoholic}</Typography>
                </Box>
              </Box>

              {/* Glass type */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: {xs:"200px", md:"250px"},
                  mb: 5 
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 0.5 }}
                >
                  Glass
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "2px solid #e0e0e0",
                    pb: 0.5,
                  }}
                >
                  <LocalDrinkIcon
                    sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                  />
                  <Typography variant="body1">{recipe.strGlass}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Ingredients:</InputLabel>
              {ingredients}
              <br></br>
              <InputLabel>How to prepare:</InputLabel>
              <Typography
                className={sarabun.className}
                fontSize="18px"
                sx={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                  maxWidth: "100%",
                }}
              >
                {recipe.strInstructions}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: 4,
            }}
          >
            <Button
              onClick={() => router.push(APPLICATION_PAGE.home)}
              color="primary"
              variant="outlined"
              startIcon={<FavoriteIcon />}
            >
              Find More Exciting Recipes in MixMate!
            </Button>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default RecipeById;
