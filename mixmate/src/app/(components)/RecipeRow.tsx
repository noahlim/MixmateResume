"use client";
import React, { useState } from "react";
import { isSet } from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import { capitalizeWords } from "@/app/_utilities/_client/utilities";
import FavoriteIcon from "@mui/icons-material/Favorite";

function RecipeRow(props) {
  // Variables
  const { drink } = props;
  const [rowOpen, setRowOpen] = useState(false);
  const [drinkInfo, setDrinkInfo] = useState(null);
  // Functions
  let loadDrinkInfo = () => {
    // Load drink info
    let drinkDetails;
    if (isSet(drink)) {
      const drinkIngredients = [];

      // Format ingredients
      if (drink.ingredients.length > 0) {
        drink.ingredients.forEach((ing, index) => {
          if (ing.ingredient && ing.measure) {
            drinkIngredients.push(
              <Typography className="margin-left-35px" key={index}>
                {capitalizeWords(ing.ingredient)} <i>({ing.measure})</i>
              </Typography>
            );
          }
        });
      }

      drinkDetails = (
        <Box sx={{ margin: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <img
                style={{ width: "90%", borderRadius: "7%" }}
                src={drink.strDrinkThumb}
              ></img>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={8}>
              <div className="text-tangerine text-55px margin-left-35px">
                {drink.strDrink}
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
                  id="input-with-icon-adornment"
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
                  value={drink.strGlass}
                />
              </FormControl>
              <br />
              <br />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <InputLabel>Ingredients:</InputLabel>
              {drinkIngredients}
              <br></br>
              <InputLabel>How to prepare:</InputLabel>
              <Typography className="margin-left-35px">
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
                variant="outlined"
                startIcon={<FavoriteIcon />}
              >
                Add to Favorites
              </Button>
            </Grid>
          </Grid>
        </Box>
      );
    } else {
      drinkDetails = (
        <Box sx={{ margin: 5 }}>
          <Typography variant="h6" gutterBottom component="div">
            Recipe not found
          </Typography>
        </Box>
      );
    }
    setDrinkInfo(drinkDetails);

    // Done
    setRowOpen(!rowOpen);
  };
  return (
    <>
      <TableRow sx={{ "& > *": { borderColor: "blue", border: 0 } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => loadDrinkInfo()}
          >
            {rowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {capitalizeWords(drink.strDrink)}
        </TableCell>
      </TableRow>
      <TableRow sx={{ "& > *": { borderTop: 0 } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={rowOpen} timeout="auto" unmountOnExit>
            {drinkInfo}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
export default RecipeRow;
