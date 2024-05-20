'use client';
import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
  Typography,
  CardContent,
  Box,
  Pagination,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import WineBarIcon from "@mui/icons-material/WineBar";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActions } from "@/lib/redux/userInfoSlice";
import MyIngredientRow from "./MyIngredientRow";
import LiquorIcon from "@mui/icons-material/Liquor";
import AvailableRecipes from "./AvailableRecipes";
import IngredientRow from "./IngredientRow";
import {
  API_DRINK_ROUTES,
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
  ingredientsByAlcoholic,
} from "@/app/_utilities/_client/constants";
import {
  displayErrorSnackMessage,
  isNotSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import { recipeActions } from "lib/redux/recipeSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
function MyIngredients() {
  // Validate session

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );

  const { user, error, isLoading } = useUser();

  const [allIngredients, setAllIngredients] = useState([]);
  const [filteredIngredients, setFilteredIngredients] = useState([]);
  const [searchboxValue, setSearchboxValue] = useState("");
  const [availableRecipesModalOpen, setAvailableRecipesModalOpen] =
    useState(false);
  const [pageIndexCount, setPageIndexCount] = useState(1);

  let onPageIndexChange = (e) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    loadNextIngredients(parseInt(e.target.innerText));
  };

  let loadNextIngredients = (pageIndex = 1) => {
    setFilteredIngredients(
      allIngredients.slice((pageIndex - 1) * 10, pageIndex * 10)
    );
    dispatch(pageStateActions.setPageLoadingState(false));
  };

  let loadUserIngredients = () => {
    dispatch(pageStateActions.setPageLoadingState(false));
    if (isNotSet(userIngredients)) {
      makeRequest(
        API_ROUTES.userIngredients,
        REQ_METHODS.get,
        { userId: user.sub },
        (response) => {
          dispatch(
            userInfoActions.setUserIngredients(response.data.ingredients)
          );

          const toastMessageObject: ToastMessage = {
            open: true,
            message: response.data.length
              ? response.data.length + " ingredient(s) found."
              : "No ingredient(s) found.",
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
          loadUserIngredients();
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    }
  };

  let loadIngredients = () => {
    dispatch(pageStateActions.setPageLoadingState(true));
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.ingredients },
      (response) => {
        const updatedIngredients = response.data.drinks.map((item) => {
          if (item.strIngredient1 === "AÃ±ejo rum") {
            return { ...item, strIngredient1: "Añejo Rum" };
          }
          return item;
        });
        console.log(response.data);
        setPageIndexCount(Math.ceil(response.data.drinks.length / 10));
        
        const sortedIngredients = updatedIngredients
          .map((x) => x.strIngredient1)
          .sort();
        setAllIngredients(sortedIngredients);
        setFilteredIngredients(sortedIngredients.slice(0, 10));
        dispatch(recipeActions.setIngredients(updatedIngredients));
      }
    )
      .catch((error) => {
        displayErrorSnackMessage(error, dispatch);
      })
      .finally(() => {
        //dispatch(pageStateActions.setPageLoadingState(false));
        loadUserIngredients();
      });
  };

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
      <AvailableRecipes
        isSingleIngredient={false}
        open={availableRecipesModalOpen}
        setOpen={setAvailableRecipesModalOpen}
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
                {userIngredients === undefined ||
                userIngredients.length === 0 ? (
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
                      if (
                        ingredientsByAlcoholic.Alcoholic.includes(
                          ing.strIngredient1
                        )
                      )
                        isAlcoholic_ = true;
                      return (
                        <MyIngredientRow
                          ingredient={ing}
                          key={ing}
                          isAlcoholic={isAlcoholic_}
                          loadIngredients={loadIngredients}
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
                    <IngredientRow key={ing} ingredient={ing} />
                  ))}
              </TableBody>
            </Table>
          </div>
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={4} // Margin top of 4 (adjust as needed)
      >
        <Pagination
          shape="rounded"
          variant="outlined"
          count={pageIndexCount}
          defaultPage={1}
          siblingCount={0}
          boundaryCount={2}
          onChange={onPageIndexChange}
        />
      </Box>
    </>
  );
}

export default MyIngredients;
