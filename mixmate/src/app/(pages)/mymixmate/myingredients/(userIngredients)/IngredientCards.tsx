import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
} from "@mui/material";

import IngredientCard from "./IngredientCard";


const IngredientCards = ({ ingredients, reloadIngredients }) => {
  const [, setTrigger] = useState(0);

  useEffect(() => {
    setTrigger((prevTrigger) => prevTrigger + 1);// Call the function when ingredients change
  }, [ingredients]);
  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {ingredients.map((ingredient, index) => (
          <IngredientCard key={index} ingredient={ingredient} reloadIngredients={reloadIngredients}/>
        ))}
      </Grid>
    </Container>
  );
};

export default IngredientCards;
