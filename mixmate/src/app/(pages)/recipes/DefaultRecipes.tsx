"use client";
import React, { useEffect, useState } from "react";
import {
  API_ROUTES,
  API_DRINK_ROUTES,
  REQ_METHODS,
  APPLICATION_PAGE,
} from "@/app/_utilities/_client/constants";
import {
  displayErrorSnackMessage,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { Typography, CardContent, Pagination, Box } from "@mui/material";
import RecipeRow from "@/app/(components)/RecipeRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { SEVERITY } from "@/app/_utilities/_client/constants";
import { useSelector, useDispatch } from "react-redux";
import { recipeActions } from "lib/redux/recipeSlice";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { useUser } from "@auth0/nextjs-auth0/client";
import FilterRecipesComponent from "@/app/(components)/FilterRecipesComponent";
import MarqueeAnimation from "@/app/(components)/(shapeComponents)/MarqueeAnimation";
import MyMixMateHeader from "@/app/(components)/MyMixMateHeader";

function DefaultRecipesComponent() {
  // Validate session
  const { user, error, isLoading } = useUser();

  const allRecipes = useSelector((state: any) => state.recipe.recipes);
  const [recipesFiltered, setRecipesFiltered] = useState([]);
  const [filter, setFilter] = useState<{
    filter: string;
    criteria: string;
  }>({ filter: "", criteria: "" });

  const dispatch = useDispatch();

  //pagination
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const displayedRecipes = recipesFiltered?.slice(startIndex, endIndex);

  let loadAllRecipes = () => {
    dispatch(pageStateActions.setPageLoadingState(true));
    if (!allRecipes || allRecipes.length === 0) {
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.allRecipes },
        (response) => {
          dispatch(recipeActions.setRecipes(response.data));
          setRecipesFiltered(response.data);
        }
      )
        .catch((error) => {
          displayErrorSnackMessage(error, dispatch);
        })
        .finally(() => {
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    } else {
      dispatch(pageStateActions.setPageLoadingState(false));
      setRecipesFiltered(allRecipes);
    }
  };

  const loadFilteredRecipes = () => {
    dispatch(pageStateActions.setPageLoadingState(true));

    if (!allRecipes || allRecipes.length === 0) {
      loadAllRecipes();
      dispatch(pageStateActions.setPageLoadingState(false));
    } else {
      let filteredRecipes = allRecipes.filter((recipe) => {
        if (filter.filter === "Category") {
          return recipe.strCategory === filter.criteria;
        } else if (filter.filter === "Alcoholic") {
          return recipe.strAlcoholic === filter.criteria;
        } else if (filter.filter === "Glass") {
          return recipe.strGlass === filter.criteria;
        } else if (filter.filter === "Ingredient") {
          return recipe.ingredients.some(
            (ing) =>
              ing.ingredient.toLowerCase() === filter.criteria.toLowerCase()
          );
        } else {
          return recipe.strDrink
            .toLowerCase()
            .includes(filter.criteria.toLowerCase());
        }
      });
      setRecipesFiltered(filteredRecipes);
      dispatch(pageStateActions.setPageLoadingState(false));
    }
  };

  useEffect(() => {
    loadAllRecipes();
  }, []);

  // Recipe actions
  let handleAddToFavorite = (recipe) => {
    // Get user
    if (!user) {
      dispatch(pageStateActions.setAuthenticatedModalOpen(true));
      return;
    }

    dispatch(pageStateActions.setPageLoadingState(true));
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.post,
      { userId: user.sub, recipe: recipe },
      (response) => {
        const toastMessageObject: ToastMessage = {
          open: true,
          title: "Recipe",
          severity: SEVERITY.Success,
          message: response.message,
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

  const onFilterClear = () => {
    setRecipesFiltered(allRecipes);
  };
  return (
    <>
      <MyMixMateHeader title="Classic Recipes">
        Step into the world of mixology with confidence! This curated collection
        of classic and innovative cocktails serves as your personal recipe
        starter pack, providing a foundation for endless exploration and
        delicious experimentation.
      </MyMixMateHeader>
      <Grid container spacing={2} sx={{ mt: 10 }}>
        <Grid item xs={12} md={3}>
          <FilterRecipesComponent
            recipeAllRecipes={allRecipes}
            loadFilteredRecipes={loadFilteredRecipes}
            setRecipesFiltered={setRecipesFiltered}
            filterCriteriaSetter={setFilter}
            filterCriteria={filter}
            onFilterClear={onFilterClear}
            applicationPage={APPLICATION_PAGE.recipes}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <div style={{ paddingLeft: 25, paddingRight: 25 }}>
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
                      <Typography variant="h6">Recipes</Typography>
                    </CardContent>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedRecipes?.length > 0 ? (
                  displayedRecipes?.map((drink) => (
                    <RecipeRow
                      key={drink.idDrink}
                      drink={drink}
                      handleAddToFavorite={handleAddToFavorite}
                    />
                  ))
                ) : (
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
                      No Results Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Grid>
      </Grid>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin={4}
      >
        <Pagination
          shape="rounded"
          variant="outlined"          
          showFirstButton
          showLastButton
          defaultPage={6}
          siblingCount={0}
          boundaryCount={2}          
          color="primary"
          count={Math.ceil(recipesFiltered?.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
          sx={{
            "& .MuiPaginationItem-root": {
              backgroundColor:"#FFFFFF",
              marginBottom: 1
            },
          }}
        />
      </Box>
      <MarqueeAnimation direction="left" />
    </>
  );
}

export default DefaultRecipesComponent;
