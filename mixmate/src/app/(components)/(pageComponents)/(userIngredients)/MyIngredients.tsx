import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography, CardContent, AlertColor } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import WineBarIcon from "@mui/icons-material/WineBar";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActions } from "../../../../lib/redux/userInfoSlice";
import MyIngredientRow from "./MyIngredientRow";
import LiquorIcon from "@mui/icons-material/Liquor";
import AvailableRecipes from "../AvailableRecipes";
import IngredientRow from "./IngredientRow";
import {
  API_DRINK_ROUTES,
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
  ingredientsByAlcoholic,
} from "@/app/_utilities/_client/constants";
import { makeRequest } from "@/app/_utilities/_client/utilities";
import { recipeActions } from "lib/redux/recipeSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
function MyIngredients() {
  // Validate session

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );
  // Toast Message
  const [openToastMessage, setOpenToastMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>(
    SEVERITY.Info
  );
  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");
  const showToastMessage = (
    title: string,
    message: string,
    severity: AlertColor = SEVERITY.Info
  ) => {
    setToast_severity(severity);
    setToast_title(title);
    setToast_message(message);
    setOpenToastMessage(true);
  };

  // Variables
  const [loadingPage, setLoadingPage] = useState(true);

  const { user, error, isLoading } = useUser();

  const [allIngredients, setAllIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchboxValue, setSearchboxValue] = useState("");
  const [availableRecipesModalOpen, setAvailableRecipesModalOpen] =
    useState(false);
  let loadUserIngredients = () => {
    if (userIngredients.length === 0 || userIngredients === undefined) {
      makeRequest(
        API_ROUTES.userIngredients,
        REQ_METHODS.get,
        { userId: user.sub },
        (response) => {
          console.log(response);
          dispatch(userInfoActions.setUserIngredients(response.data.ingredients));
          showToastMessage(
            "Ingredients",
            response.data.length
              ? response.data.length
              : "0" + " ingredient(s) found!",
            SEVERITY.Success
          );
        },
        (error) => {
          showToastMessage("Error", error.message, SEVERITY.warning);
        }
      );     
    }
    setLoadingPage(false);

  };
  // Loading recipe options

  let loadIngredients = () =>
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.ingredients },
      (response) => {
        console.log(response);
        
          const updatedIngredients = response.data.drinks.map((item) => {
            if (item.strIngredient1 === "AÃ±ejo rum") {
              return { ...item, strIngredient1: "Añejo Rum" };
            }
            return item;
          });
        
          const sortedIngredients = updatedIngredients
            .map((x) => x.strIngredient1)
            .sort();
          setAllIngredients(sortedIngredients);
          setFilteredIngredients(sortedIngredients);
          dispatch(recipeActions.setIngredients(updatedIngredients));
          if (userIngredients.length === 1) {
            console.log("calling loadUserIngredients");
            loadUserIngredients();
          } else {
            setLoadingPage(false);
          }
        
      },
      (error) => {
        showToastMessage("Error", error.message, SEVERITY.warning);
      }
    );

  useEffect(() => {
    loadIngredients();
  }, []);

  const handleSearchboxChange = async (e) => {
    await setSearchboxValue(e.target.value);
    const searchText = e.target.value.toLowerCase();

    const matchedIngredients = allIngredients.filter((ingredient) =>
      ingredient.strIngredient1.toLowerCase().includes(searchText)
    );

    setFilteredIngredients(matchedIngredients);
  };

  return (
    <>
      {/* Toast message */}
      <Snackbar
        open={openToastMessage}
        autoHideDuration={5000}
        onClose={() => setOpenToastMessage(false)}
      >
        <Alert severity={toast_severity}>
          <AlertTitle>{toast_title}</AlertTitle>
          {toast_message}
        </Alert>
      </Snackbar>

      {/* Loading */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loadingPage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <AvailableRecipes
        open={availableRecipesModalOpen}
        setOpen={setAvailableRecipesModalOpen}
        ingredients={userIngredients}
        showToastMessage={showToastMessage}
      />
      {/* Page body */}
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        <Grid item xs={12} sm={5}>
          {/*User Ingredients*/}
          <div style={{ paddingLeft: 25, paddingRight: 25, marginBottom: 50 }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <CardContent
                      style={{
                        textAlign: "center",
                        paddingTop: 25,
                        paddingBottom: 0,
                      }}
                    >
                      <Typography variant="h6">My Ingredients</Typography>
                      <LiquorIcon />
                    </CardContent>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userIngredients === undefined || userIngredients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      sx={{
                        fontSize: "1.6em",
                        fontFamily: '"Arial", sans-serif',
                        textAlign: "center",
                        padding: "20px",
                        color: "skyblue",
                      }}
                    >
                      Currently your list is empty! Please add your ingredients
                      from the list.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {userIngredients.map((ing) => {
                      let isAlcoholic_ = false;
                      if (ingredientsByAlcoholic.Alcoholic.includes(ing))
                        isAlcoholic_ = true;
                      return (
                        <MyIngredientRow
                          ingredient={ing}
                          showToastMessage={showToastMessage}
                          key={ing}
                          isAlcoholic={isAlcoholic_}
                          setLoadingPage={setLoadingPage}
                        />
                      );
                    })}
                    <TableRow>
                      <TableCell sx={{ width: "15%" }}>
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => setAvailableRecipesModalOpen(true)}
                          sx={{
                            fontSize: "1.1em",
                          }}
                        >
                          <WineBarIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          fontSize: "1.1em",
                          color: "skyblue",
                          fontFamily: '"Arial", sans-serif',
                          fontWeight: "bold",
                        }}
                      >
                        View All Available Recipes with Current Ingredients
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ "& > *": { borderTop: 0 } }}>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={2}
                      ></TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </Grid>

        <Grid item xs={12} sm={7}>
          <Paper elevation={3} style={{ margin: 15 }}>
            <CardContent
              style={{ textAlign: "center", paddingTop: 25, paddingBottom: 0 }}
            >
              <Typography variant="h6">Search Ingredients</Typography>
            </CardContent>

            {/* Filters */}
            <div style={{ padding: 25 }}>
              <FormControl variant="standard" fullWidth>
                <TextField
                  label="Search..."
                  type="string"
                  variant="outlined"
                  value={searchboxValue}
                  onChange={handleSearchboxChange}
                  margin="normal"
                />
              </FormControl>
            </div>
          </Paper>
          <div style={{ paddingLeft: 25, paddingRight: 55 }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <CardContent
                      style={{
                        textAlign: "center",
                        paddingTop: 25,
                        paddingBottom: 0,
                      }}
                    >
                      <Typography variant="h6">Ingredients</Typography>
                    </CardContent>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIngredients
                  .sort((a, b) => {
                    const ingredientA = a.toUpperCase();
                    const ingredientB = b.toUpperCase();
                    if (ingredientA < ingredientB) return -1;
                    if (ingredientA > ingredientB) return 1;
                    return 0;
                  })
                  .map((ing) => (
                    <IngredientRow
                      key={ing}
                      ingredient={ing}
                      showToastMessage={showToastMessage}
                      setLoadingPage={setLoadingPage}
                    />
                  ))}
              </TableBody>
            </Table>
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default MyIngredients;
