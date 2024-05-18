"use client";
import React, { useEffect, useState } from "react";
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
import { Typography, Button, Backdrop, CircularProgress } from "@mui/material";
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
const RecipeById = ({ params }) => {
  const recipeId = params.recipeid;
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const fetchRecipeDetails = async () => {
    makeRequest(
      API_ROUTES.sharedRecipeById,
      REQ_METHODS.get,
      { recipeid: recipeId },
      (response) => {
        console.log(response);

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
              console.log(response.data);
            }
          );
        } else {
          setRecipeAndIngredients(response.data);
        }
      }
    );
  };
  const setRecipeAndIngredients = (drinkData) => {
    setRecipe(drinkData);
    if (drinkData.ingredients.length > 0) {
      setIngredients(
        drinkData.ingredients.map((ing, index) => {
          if (ing.ingredient && ing.measure) {
            return (
              <Typography className="margin-left-35px" key={index}>
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
  }, []);
  if (!recipe) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => 9999 }} open={!recipe}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <TableRow sx={{ "& > *": { borderTop: 0 } }}>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
        <Box sx={{ margin: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <Image
                style={{ borderRadius: "7%" }}
                src={
                  recipe.strDrinkThumb
                    ? recipe.strDrinkThumb
                    : "not-found-icon.png"
                }
                alt="Drink"
                height={700}
                width={700}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={8}>
              <div className="text-tangerine text-55px margin-left-35px">
                {recipe.strDrink}
              </div>

              {/* Category */}
              <FormControl variant="standard">
                <InputLabel htmlFor="input-with-icon-adornment">
                  Category
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <ClassIcon />
                    </InputAdornment>
                  }
                  value={recipe.strCategory}
                />
              </FormControl>
              <br />
              <br />

              {/* Alcoholic type */}
              <FormControl variant="standard">
                <InputLabel htmlFor="input-with-icon-adornment">
                  Alcoholic type
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocalBarIcon />
                    </InputAdornment>
                  }
                  value={recipe.strAlcoholic}
                />
              </FormControl>
              <br />
              <br />

              {/* Glass type */}
              <FormControl variant="standard">
                <InputLabel htmlFor="input-with-icon-adornment">
                  Glass
                </InputLabel>
                <Input
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <LocalDrinkIcon />
                    </InputAdornment>
                  }
                  value={recipe.strGlass}
                />
              </FormControl>
              <br />
              <br />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <InputLabel>Ingredients:</InputLabel>
              {ingredients}
              <br></br>
              <InputLabel>How to prepare:</InputLabel>
              <Typography className="margin-left-35px">
                {recipe.strInstructions}
              </Typography>
            </Grid>
            <Grid
              xs
              item
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ padding: 4 }}
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
          </Grid>
        </Box>
      </TableCell>
    </TableRow>
  );
  //return <h1>{params.recipeid}</h1>;
};

export default RecipeById;
