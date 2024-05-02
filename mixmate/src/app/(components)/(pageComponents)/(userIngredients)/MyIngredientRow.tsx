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
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import ClearIcon from "@mui/icons-material/Clear";
import AvailableRecipes from "../AvailableRecipes";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeWords, isNotSet } from "@/app/_utilities/_client/utilities";
import { userInfoActions } from "lib/redux/userInfoSlice";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import WineBarIcon from "@mui/icons-material/WineBar";
import ShoppingItemCardGridDialog from "./ShoppingItemCard/ShoppingItemCardGrid";
import { useUser } from "@auth0/nextjs-auth0/client";
import { API_ROUTES, REQ_METHODS, SEVERITY } from "@/app/_utilities/_client/constants";
import { makeRequest } from "@/app/_utilities/_client/utilities";

function MyIngredientRow(props) {
  const { user, error, isLoading } = useUser();
  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );

  // Variables
  const { ingredient, showToastMessage } = props;
  const [rowOpen, setRowOpen] = useState(false);
  const [ingredientInfo, setIngredientInfo] = useState(null);
  const [modalDeleteIngredientOpen, setModalDeleteIngredientOpen] =
    useState(false);
  const [modalViewRecipesOpen, setModalViewRecipesOpen] = useState(false);
  const [shoppingListDialogOpen, setShoppingListDialogOpen] = useState(false);

  const [ingredientProducts, setIngredientProducts] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);

  let ingredientDetails = null;

  const onModalOpenClick = () => {
    setModalViewRecipesOpen(true);
  };

  const fetchStockInfoFromWeb = async (ingredient) => {
    if (!isDataFetched) {
      props.setLoadingPage(true);

      const apiEndpoint = props.isAlcoholic
        ? API_ROUTES.lcboItems
        : API_ROUTES.walmartItems;

      makeRequest(
        apiEndpoint,
        REQ_METHODS.get,
        { query: ingredient },
        (response) => {
          setIngredientProducts(response.data);
          setIsDataFetched(true);
          props.setLoadingPage(false);
        }
      ).catch((error) => {
        showToastMessage("Error", error.message, SEVERITY.warning);
      });
   
    }
    setShoppingListDialogOpen(true);
  };
  const deleteIngredientFromList = async (ingredient) => {
    let tempIngredients = [...userIngredients];
    tempIngredients = tempIngredients.filter(
      (ing) => ing.strIngredient1 !== ingredient
    );

    //deleting the item from the redux state
    dispatch(userInfoActions.setUserIngredients(tempIngredients));

    makeRequest(API_ROUTES.userIngredients, REQ_METHODS.delete,
      { userId:user.sub, ingredient: ingredient }, 
      (response) => {
        if (response.isOk) {
          showToastMessage(
            "Ingredients",
            ingredient + " has been deleted from the list!",
            SEVERITY.Success
          );
        } 
      }

    ).catch((error) => {  
      showToastMessage(
        "Ingredients",
        "Error deleting ingredient from the list.",
        SEVERITY.Error
      );
    
    });

    setModalDeleteIngredientOpen(false);
  };

  // Functions
  let loadIngredientInfo = () => {
    let verifiedIngredient = capitalizeWords(ingredient);
    if (isNotSet(ingredientInfo)) {
      ingredientDetails = (
        <Box sx={{ position: "relative", margin: 3 }}>
          <Tooltip title="Delete from the list" placement="top">
            <IconButton
              color="error"
              onClick={() => setModalDeleteIngredientOpen(verifiedIngredient)}
              sx={{ position: "absolute", top: 0, right: 0 }}
            >
              <DeleteForeverIcon />
            </IconButton>
          </Tooltip>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4}>
              <img
                style={{ width: "90%", borderRadius: "7%" }}
                src={`https://www.thecocktaildb.com/images/ingredients/${encodeURIComponent(
                  verifiedIngredient
                )}.png`}
                alt={verifiedIngredient}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={8}>
              <div className="text-tangerine text-55px margin-left-35px">
                {verifiedIngredient}
              </div>
            </Grid>
          </Grid>

          <Grid
            item
            xs
            display="flow"
            justifyContent="center"
            alignItems="center"
            sx={{ padding: 4 }}
          >
            <Button
              onClick={() => onModalOpenClick()}
              color="primary"
              variant="contained"
              startIcon={<DeleteIcon />}
              style={{ margin: 20 }}
            >
              View Available Recipes
            </Button>
            <Button
              onClick={() => {
                fetchStockInfoFromWeb(verifiedIngredient);
              }}
              color="success"
              variant="contained"
              startIcon={
                props.isAlcoholic ? <WineBarIcon /> : <ShoppingCartIcon />
              }
              style={{ margin: 20 }}
            >
              {props.isAlcoholic
                ? "View Items on LCBO"
                : "View Items on Walmart"}
            </Button>
          </Grid>
        </Box>
      );
    }
    setIngredientInfo(ingredientDetails);
    setRowOpen(!rowOpen);
  };

  return (
    <React.Fragment>
      <Dialog
        onClose={() => setModalDeleteIngredientOpen(false)}
        open={modalDeleteIngredientOpen}
      >
        <DialogTitle>Deleting {ingredient} from the list</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {ingredient} from the list?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => deleteIngredientFromList(ingredient)}
            color="error"
            variant="contained"
            startIcon={<DeleteForeverIcon />}
          >
            Yes
          </Button>
          <Button
            onClick={() => setModalDeleteIngredientOpen(false)}
            color="primary"
            variant="contained"
            startIcon={<ClearIcon />}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <ShoppingItemCardGridDialog
        open={shoppingListDialogOpen}
        onClose={() => setShoppingListDialogOpen(false)}
        products={ingredientProducts}
        ing={ingredient}
        isAlcoholic_={props.isAlcoholic}
      />
      <AvailableRecipes
        open={modalViewRecipesOpen}
        setOpen={setModalViewRecipesOpen}
        ingredients={[ingredient]}
        showToastMessage={showToastMessage}
      />
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
    </React.Fragment>
  );
}
export default MyIngredientRow;
