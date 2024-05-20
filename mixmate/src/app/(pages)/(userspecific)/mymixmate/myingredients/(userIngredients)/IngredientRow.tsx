import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { userInfoActions } from "@/app/../lib/redux/userInfoSlice";
import {
  isNotSet,
  capitalizeWords,
  displayErrorSnackMessage,
} from "@/app/_utilities/_client/utilities";
import { SEVERITY } from "@/app/_utilities/_client/constants";
import { Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "@/app/_utilities/_client/constants";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import Image from "next/image";
const IngredientRow = (props) => {
  const { user, error, isLoading } = useUser();

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );
  const { ingredient } = props;
  const [rowOpen, setRowOpen] = useState(false);
  const [ingredientInfo, setIngredientInfo] = useState(null);
  let ingredientDetails = null;
  const addIngredientToList = async (ingredient) => {
    const matchedIngredients = userIngredients.find(
      (ing) => ing.strIngredient1 === ingredient
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
      return;
    }
    const tempIngredients = [...userIngredients];
    tempIngredients.push({
      strIngredient1: ingredient,
      strIngredientThumb: `https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
        ingredient
      )}.png`,
    });
    //adding the new item to the redux state
    dispatch(userInfoActions.setUserIngredients(tempIngredients));

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
  // Functions
  let loadIngredientInfo = () => {
    if (isNotSet(ingredientInfo)) {
      // Load drink info
      ingredientDetails = (
        <Box sx={{ margin: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <Image
                style={{ borderRadius: "7%" }}
                src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
                  ingredient
                )}.png`} 
                alt={ingredient}
                height={700}
                width={700}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={8}>
              <div className="text-tangerine text-55px margin-left-35px">
                {ingredient}
              </div>
            </Grid>
          </Grid>
          <Grid
            xs
            display="flow"
            justifyContent="center"
            alignItems="center"
            sx={{ padding: 4 }}
          >
            <Button
              onClick={() => addIngredientToList(ingredient)}
              color="primary"
              variant="outlined"
              startIcon={<AddIcon />}
              style={{ margin: 20 }}
            >
              Add To My List
            </Button>
          </Grid>
        </Box>
      );
    }
    setIngredientInfo(ingredientDetails);
    // Done
    setRowOpen(!rowOpen);
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ width: "15%" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => loadIngredientInfo()}
          >
            {rowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ width: "85%" }}>
          <Typography style={{ fontSize: "1.2em" }} color="black">
            {capitalizeWords(ingredient)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow sx={{ "& > *": { borderTop: 0 } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
          <Collapse in={rowOpen} timeout="auto" unmountOnExit>
            {ingredientInfo}
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
export default React.memo(IngredientRow);
