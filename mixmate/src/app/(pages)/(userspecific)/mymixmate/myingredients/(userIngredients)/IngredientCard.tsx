import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { capitalizeWords } from "@/app/_utilities/_client/utilities";
import Image from "next/image";
const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  boxShadow: theme.shadows[5],
  transition: "box-shadow 0.3s ease, filter 0.3s ease, transform 0.3s ease",
  background: "linear-gradient(to bottom, #D5EEFF, 50%, transparent 70%)", // Replace #color1 and #color2 with your desired colors
  "&:hover": {
    boxShadow: theme.shadows[8],
    transform: "translateY(-10px)",
  },
}));
import { LuCupSoda } from "react-icons/lu";
import { LiaCocktailSolid } from "react-icons/lia";
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingInlineStart: "1rem",
}));

const IngredientCard = ({ ingredients }) => {
  const [, setTrigger] = useState(0); // Create a state to trigger re-render

  const handleIngredientsChange = () => {
    setTrigger((prevTrigger) => prevTrigger + 1); // Increment the state to trigger re-render
  };

  useEffect(() => {
    handleIngredientsChange(); // Call the function when ingredients change
  }, [ingredients, handleIngredientsChange]);
  return (
    <Container maxWidth="lg" sx={{ padding: 3 }}>
      <Box mb={4}></Box>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {ingredients.map((ingredient, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard
              sx={{
                backgroundColor: "#F5F5F5",
              }}
            >
              <Image
                src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
                  ingredient.strIngredient1
                )}.png`}
                alt={ingredient.strIngredient1}
                height={400}
                width={400}
              />
              <StyledCardContent>
                <Grid container style={{ marginTop: "60px" }}>
                  <Grid item xs={12}>
                    <Typography color="#1C4683" style={{ fontSize: "14px" }}>
                      {capitalizeWords(ingredient.strIngredient1)}
                    </Typography>
                  </Grid>
                </Grid>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default IngredientCard;
