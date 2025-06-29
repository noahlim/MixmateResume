import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tooltip,
  IconButton,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  capitalizeWords,
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
// import Image from "next/image";
import { LuCupSoda } from "react-icons/lu";
import { LiaCocktailSolid } from "react-icons/lia";
import { Sarabun } from "next/font/google";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WineBarIcon from "@mui/icons-material/WineBar";
import { pageStateActions } from "@lib/redux/pageStateSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastMessage } from "interface/toastMessage";
import {
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
} from "@/app/_utilities/_client/constants";
import { userInfoActions } from "@lib/redux/userInfoSlice";
import ShoppingItemCardGridDialog from "./ShoppingItemCard/ShoppingItemCardGrid";
const StyledCard = styled(Card)<{ isalcoholic: string }>(
  ({ theme, isalcoholic }) => ({
    margin: theme.spacing(2),
    boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
    transition: "box-shadow 0.3s ease, filter 0.3s ease, transform 0.3s ease",
    background: "rgba(26, 26, 46, 0.7)",
    backdropFilter: "blur(12px)",
    borderRadius: 18,
    border:
      isalcoholic === "true"
        ? "2px solid var(--accent-teal)"
        : "2px solid var(--accent-gold)",
    color: "#fff",
    "&:hover": {
      boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
      transform: "translateY(-8px) scale(1.03)",
      borderColor: "var(--accent-purple)",
    },
  })
);
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });
const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingInlineStart: "1rem",
}));
const IngredientCard = ({
  ingredient,
  reloadIngredients,
  isUserList = false,
}) => {
  const [ingredientProducts, setIngredientProducts] = useState([]);
  const [shoppingListDialogOpen, setShoppingListDialogOpen] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const dispatch = useDispatch();

  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );

  const fetchStockInfoFromWeb = async () => {
    if (!isDataFetched) {
      dispatch(pageStateActions.setPageLoadingState(true));

      const apiEndpoint = ingredient.strAlcoholic
        ? API_ROUTES.lcboItems
        : API_ROUTES.nofrillsItems;

      makeRequest(
        apiEndpoint,
        REQ_METHODS.get,
        { query: ingredient.strIngredient1 },
        (response) => {
          setIngredientProducts(response.data);
          setIsDataFetched(true);
        }
      )
        .catch((error) => {
          displayErrorSnackMessage(error, dispatch);
        })
        .finally(() => {
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    }
    setShoppingListDialogOpen(true);
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
      { ingredient: ingredient.strIngredient1 },
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
      { ingredient: ingredient },
      (response) => {
        const toastMessageObject: ToastMessage = {
          open: true,
          message: response.message,
          severity: SEVERITY.Success,
          title: "Ingredients",
        };
        const tempIngredients = [...userIngredients];
        tempIngredients.push({
          strIngredient1: ingredient.strIngredient1 || "",
          strIngredientThumb: `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
            ingredient.strIngredient1 || ""
          )}.png`,

          strAlcoholic: ingredient.strAlcoholic || false,
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

  return (
    <Grid item xs={12} sm={6} md={4}>
      <ShoppingItemCardGridDialog
        open={shoppingListDialogOpen}
        onClose={() => setShoppingListDialogOpen(false)}
        products={ingredientProducts}
        ing={ingredient}
      />
      <StyledCard
        isalcoholic={
          ingredient.strAlcoholic ? ingredient.strAlcoholic.toString() : "false"
        }
        sx={{
          p: 2,
          background: "rgba(26, 26, 46, 0.7)",
          color: "#fff",
          borderRadius: 3,
          minHeight: 160,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {ingredient.strAlcoholic ? (
              <WineBarIcon sx={{ color: "var(--accent-teal)" }} />
            ) : (
              <LuCupSoda size={24} color="var(--accent-gold)" />
            )}
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#ffd700" }}>
              {capitalizeWords(ingredient.strIngredient1)}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <img
            src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
              ingredient.strIngredient1 || ""
            )}.png`}
            alt={ingredient.strIngredient1}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: "#fff",
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <Typography variant="body2" sx={{ color: "#fff" }}>
            {ingredient.strAlcoholic ? "Alcoholic" : "Non-Alcoholic"}
          </Typography>
        </Box>
        {isUserList && (
          <Box sx={{ mb: 1 }}>
            <Chip
              label="In My List"
              sx={{ background: "#ffd700", color: "#181a2e", fontWeight: 700 }}
            />
          </Box>
        )}
        <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
          {/* Add to My List button - only show for non-user ingredients */}
          {!isUserList && (
            <Button
              variant="contained"
              size="small"
              sx={{
                color: "#181a2e",
                background: "linear-gradient(90deg, #ffd700 60%, #ffe066 100%)",
                borderRadius: 99,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #ffe066 60%, #ffd700 100%)",
                },
              }}
              startIcon={<AddIcon sx={{ color: "#181a2e" }} />}
              onClick={() => addIngredientToList(ingredient)}
            >
              Add to My List
            </Button>
          )}

          {/* Remove from My List button - only show for user ingredients */}
          {isUserList && (
            <Button
              variant="contained"
              size="small"
              sx={{
                color: "#fff",
                background: "linear-gradient(90deg, #ef4444 60%, #dc2626 100%)",
                borderRadius: 99,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #dc2626 60%, #ef4444 100%)",
                },
              }}
              startIcon={<ClearIcon sx={{ color: "#fff" }} />}
              onClick={() => deleteIngredientFromList(ingredient)}
            >
              Remove from My List
            </Button>
          )}

          {/* Find in Store button */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              color: "#fff",
              borderColor: "var(--accent-gold)",
              background: "rgba(255, 215, 0, 0.08)",
              borderRadius: 99,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                background: "rgba(255, 215, 0, 0.18)",
                borderColor: "var(--accent-gold)",
              },
            }}
            startIcon={
              <ShoppingCartIcon sx={{ color: "var(--accent-gold)" }} />
            }
            onClick={fetchStockInfoFromWeb}
          >
            Find in Store
          </Button>
        </Box>
      </StyledCard>
    </Grid>
  );
};

export default IngredientCard;
