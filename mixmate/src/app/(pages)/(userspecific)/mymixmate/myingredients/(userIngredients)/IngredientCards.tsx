import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  capitalizeWords,
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Image from "next/image";
import { LuCupSoda } from "react-icons/lu";
import { LiaCocktailSolid } from "react-icons/lia";
import { Sarabun } from "next/font/google";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { pageStateActions } from "@lib/redux/pageStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastMessage } from "interface/toastMessage";
import {
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
} from "@/app/_utilities/_client/constants";
import { userInfoActions } from "@lib/redux/userInfoSlice";
import { useUser } from "@auth0/nextjs-auth0/client";

const StyledCard = styled(Card)<{ isalcoholic: string }>(
  ({ theme, isalcoholic }) => ({
    margin: theme.spacing(2),
    boxShadow: theme.shadows[5],
    transition: "box-shadow 0.3s ease, filter 0.3s ease, transform 0.3s ease",
    background:
      isalcoholic === "true"
        ? "linear-gradient(to bottom, transparent, 50%, #67A1FF 70%)"
        : "linear-gradient(to bottom, transparent, 50%, #A5D6A7 70%)",
    "&:hover": {
      boxShadow: theme.shadows[8],
      transform: "translateY(-10px)",
    },
  })
);
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingInlineStart: "1rem",
}));

const IngredientCards = ({ ingredients, reloadIngredients }) => {
  const [, setTrigger] = useState(0);

  const { user, error, isLoading } = useUser();

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );
  const addIngredientToList = async (ingredient) => {
    const matchedIngredients = userIngredients.find(
      (ing) => ing.strIngredient1 === ingredient.strIngredient1
    );
    dispatch(pageStateActions.setPageLoadingState(true));
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

    //adding the new ingredient to the database
    makeRequest(
      API_ROUTES.userIngredients,
      REQ_METHODS.post,
      { userId: user.sub, ingredient: ingredient },
      (response) => {
        const toastMessageObject: ToastMessage = {
          open: true,
          message: "Ingredient added to the list!",
          severity: SEVERITY.Success,
          title: "Ingredients",
        };
        const tempIngredients = [...userIngredients];
        tempIngredients.push({
          strIngredient1: ingredient.strIngredient1,
          strIngredientThumb: `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
            ingredient.strIngredient1
          )}.png`,

          strAlcoholic: ingredient.strAlcoholic,
        });
        //adding the new item to the redux state
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
  const deleteIngredientFromList = async (ingredient) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    let tempIngredients = [...userIngredients];
    tempIngredients = tempIngredients.filter(
      (ing) => ing.strIngredient1 !== ingredient.strIngredient1
    );

    //deleting the item from the redux state
    dispatch(userInfoActions.setUserIngredients(tempIngredients));

    makeRequest(
      API_ROUTES.userIngredients,
      REQ_METHODS.delete,
      { userId: user.sub, ingredient: ingredient.strIngredient1 },
      (response) => {
        const toastMessageObject: ToastMessage = {
          message: response.message,
          severity: SEVERITY.Success,
          title: "Ingredients",
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));

        reloadIngredients();
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
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard
              sx={{
                backgroundColor: "#F5F5F5",
              }}
              //to prevent error, convert boolean to string
              isalcoholic={ingredient.strAlcoholic.toString()}
            >
              <Box
                sx={{ display: "flex", justifyContent: "end", padding: "10px" }}
              >
                <Tooltip
                  title={`This item is ${
                    ingredient.strAlcoholic ? "alcoholic." : "is non-alcoholic."
                  }`}
                >
                  <IconButton>
                    {ingredient.strAlcoholic ? (
                      <LiaCocktailSolid size={30} color="#B50000" />
                    ) : (
                      <LuCupSoda size={30} color="#419DFF" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
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
                    <Typography
                      color="#FBFBFB"
                      style={{ fontSize: "25px" }}
                      className={sarabun.className}
                    >
                      {capitalizeWords(ingredient.strIngredient1)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    {userIngredients.find(
                      (ing) => ing.strIngredient1 === ingredient.strIngredient1
                    ) ? (
                      <Button
                        onClick={() => deleteIngredientFromList(ingredient)}
                        color="secondary"
                        variant="outlined"
                        startIcon={<ClearIcon />}
                        sx={{
                          backgroundColor: "#FF5B5B !important",
                          "&:hover": {
                            backgroundColor: "#FF4B4B !important",
                          },
                          "&:focus": {
                            backgroundColor: "#FF7C7C !important",
                          },
                        }}
                      >
                        Remove From My List
                      </Button>
                    ) : (
                      <Button
                        onClick={() => addIngredientToList(ingredient)}
                        color="primary"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        sx={{
                          backgroundColor: "#FFFFFF !important",
                          "&:hover": {
                            backgroundColor: "#DFDFDF !important",
                          },
                          "&:focus": {
                            backgroundColor: "#DADADA !important",
                          },
                        }}
                      >
                        Add To My List
                      </Button>
                    )}
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

export default IngredientCards;
