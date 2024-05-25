"use client";
import React, { useState } from "react";
import { isSet } from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import TableRow from "@mui/material/TableRow";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import { capitalizeWords } from "@/app/_utilities/_client/utilities";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Image from "next/image";
import { Lilita_One, Sarabun } from "next/font/google";
const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: "400",
});
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });

function RecipeRow(props) {
  // Variables
  const { drink } = props;

  // Load drink info
  let drinkInfo;
  if (isSet(drink)) {
    const drinkIngredients = [];

    // Format ingredients
    if (drink.ingredients.length > 0) {
      drink.ingredients.forEach((ing, index) => {
        if (ing.ingredient && ing.measure) {
          drinkIngredients.push(
            <Typography
              className={sarabun.className}
              fontSize="17px"
              key={index}
            >
              {capitalizeWords(ing.ingredient)} <i>({ing.measure})</i>
            </Typography>
          );
        }
      });
    }

    drinkInfo = (
      <Box
        sx={{
          widhth: "90%",
          padding: 3,
          backgroundImage: "url(/recipebackground.png)",
          borderRadius: "10%",
          borderWidth: 1,
          borderStyle: "dotted",
          borderColor: "#AB3900",
        }}
      >
        <Grid container spacing={1}>
          <Grid
            item
            xs={12}
            md={6}
            lg={4}
            display="flex"
            justifyContent="center"
          >
            <Image
              src={
                drink.strDrinkThumb
                  ? drink.strDrinkThumb
                  : "/not-found-icon.png"
              }
              alt="Drink"
              width={250}
              height={250}
              style={{ borderRadius: "7%", boxShadow: "5px 5px 5px #AB3900" }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <Typography
              sx={{ fontSize: "30px", textShadow: "2px 2px 2px #F8F8F8"}}
              className={lilitaOne.className}              
            >
              {capitalizeWords(drink.strDrink)}
            </Typography>

            {/* Category */}
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">
                Category
              </InputLabel>
              <Input
                className={sarabun.className}
                startAdornment={
                  <InputAdornment position="start">
                    <ClassIcon />
                  </InputAdornment>
                }
                value={drink.strCategory}
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
                className={sarabun.className}
                startAdornment={
                  <InputAdornment position="start">
                    <LocalBarIcon />
                  </InputAdornment>
                }
                value={drink.strAlcoholic}
              />
            </FormControl>
            <br />
            <br />

            {/* Glass type */}
            <FormControl variant="standard">
              <InputLabel htmlFor="input-with-icon-adornment">Glass</InputLabel>
              <Input
                className={sarabun.className}
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
            <InputLabel>Ingredients:</InputLabel>
            {drinkIngredients}
            <br></br>
            <InputLabel>How to prepare:</InputLabel>
            <Typography className={sarabun.className} fontSize="18px">
              {drink.strInstructions}
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
              onClick={() => props.btnAddToMyMixMate_onClick(drink)}
              color="primary"
              variant="contained"              
              startIcon={<FavoriteIcon />}
              sx={{                
                backgroundColor: "#4BF4FF !important",
                "&:hover": {
                  backgroundColor: "#00CBD8 !important",
                },
                "&:focus": {
                  backgroundColor: "#00A3AD !important",
                },
              }}
            >
              Add to Favorites
            </Button>
          </Grid>
        </Grid>
      </Box>
    );
  } else {
    drinkInfo = (
      <Box sx={{ margin: 5 }}>
        <Typography variant="h6" gutterBottom component="div">
          Recipe not found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableRow sx={{ "& > *": { borderTop: 0 }, paddingTop: "20px" }}>
        <TableCell sx={{}} colSpan={2}>
          {drinkInfo}
        </TableCell>
      </TableRow>
    </>
  );
}
export default RecipeRow;
