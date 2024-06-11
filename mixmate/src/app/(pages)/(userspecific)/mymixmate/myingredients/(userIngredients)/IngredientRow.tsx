import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Collapse from "@mui/material/Collapse";

import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { userInfoActions } from "@/app/../lib/redux/userInfoSlice";
import {
  isNotSet,
  capitalizeWords,
  displayErrorSnackMessage,
} from "@/app/_utilities/_client/utilities";
import { SEVERITY } from "@/app/_utilities/_client/constants";
import { Card, Paper, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { API_ROUTES, REQ_METHODS } from "@/app/_utilities/_client/constants";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { Sarabun } from "next/font/google";
import Image from "next/image";

const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });
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
      // Load ingredient info
    }
    setIngredientInfo(ingredientDetails);
    // Done
    setRowOpen(!rowOpen);
  };

  useEffect(() => {
    loadIngredientInfo();
  }, []);
  return (
    <>
      <TableRow sx={{ "& > *": { borderTop: 0 } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
            <Card elevation={2} sx={{ margin: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
                    <Image
                      style={{ borderRadius: "7%" }}
                      src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
                        ingredient
                      )}.png`}
                      alt={ingredient}
                      height={400}
                      width={400}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={8}>
                  <Typography
                    className={sarabun.className}
                    sx={{ fontSize: "2em", margin: "10px" }}
                  >
                    {capitalizeWords(ingredient)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                xs={12}
                display="flex"
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
            </Card>
        </TableCell>
      </TableRow>
    </>
  );
};
export default React.memo(IngredientRow);
