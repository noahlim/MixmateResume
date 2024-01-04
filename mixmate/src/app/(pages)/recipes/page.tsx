"use client";
import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  API_ROUTES,
  API_DRINK_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import {
  makeRequest,
  isNotSet,
  isSet,
} from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Typography, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { APPLICATION_PAGE, SEVERITY } from "@/app/_utilities/_client/constants";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { capitalizeWords } from "@/app/_utilities/_client/utilities";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector, useDispatch } from "react-redux";
import { recipeActions } from "redux/recipeSlice";
import { AlertColor } from "@mui/material/Alert";

function Recipes() {
  // Validate session
  const { user, error, isLoading } = useUser();
  const router = useRouter();
  const recipeAllRecipes = useSelector((state: any) => state.recipe.recipes);

  // Toast Message
  const [openToasMessage, setOpenToasMessage] = useState(false);
  const [toast_severity, setToast_severity] = useState<AlertColor>("info");
  const [toast_title, setToast_title] = useState("");
  const [toast_message, setToast_message] = useState("");
  const showToastMessage = (title, message, severity = SEVERITY.Info) => {
    setToast_severity(severity);
    setToast_title(title);
    setToast_message(message);
    setOpenToasMessage(true);
  };

  // Variables
  const [loadingPage, setLoadingPage] = useState(true);

  const [selectedFilter, setSelectedFilter] = useState("");

  const [recipeCategories, setRecipeCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [recipeGlasses, setRecipeGlasses] = useState(null);
  const [selectedGlass, setSelectedGlass] = useState("");

  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const [recipeAlcoholicTypes, setRecipeAlcoholicTypes] = useState(null);
  const [selectedAlcoholicType, setSelectedAlcoholicType] = useState("");


  const [recipesFiltered, setRecipesFiltered] = useState(null);

  let [recipeName, setRecipeName] = useState("");
  const dispatch = useDispatch();

  // Loading recipe options
  let loadAllRecipes = () => {
    if (recipeAllRecipes.length === 0)
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        { criteria: API_DRINK_ROUTES.alcoholicTypes },
        (response) => {
          dispatch(recipeActions.setRecipes(response.data));
          setRecipesFiltered(response.data);

          // Done
          setLoadingPage(false);
        }
      );
  };
  let loadAlcoholicTypes = () =>
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.alcoholicTypes },
      (response) => {
        if (response.isOk) {
          setRecipeAlcoholicTypes(
            response.data.drinks.map((x) => x.strAlcoholic).sort()
          );
          loadAllRecipes();
        }
      }
    );
  let loadIngredients = () =>
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.ingredients },
      (response) => {
        if (response.isOk) {
          const updatedIngredients = response.data.drinks.map((item) => {
            if (item.strIngredient1 === "AÃ±ejo rum") {
              return { ...item, strIngredient1: "Añejo Rum" };
            }
            return item;
          });
          setRecipeIngredients(updatedIngredients.map((x) => x.strGlass).sort());
          loadAlcoholicTypes();
        }
      }
    );
  let loadGlasses = () =>
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.glassTypes },
      (response) => {
        if (response.isOk) {
          setRecipeGlasses(response.data.drinks.map((x) => x.strGlass).sort());
          loadIngredients();
        }
      }
    );

  let loadCategories = () =>
    makeRequest(
      API_ROUTES.drinks,
      REQ_METHODS.get,
      { criteria: API_DRINK_ROUTES.drinkCategories },
      (response) => {
        if (response.isOk) {
          setRecipeCategories(
            response.data.drinks.map((x) => x.strCategory).sort()
          );
          loadGlasses();
        }
      }
    );

  useEffect(() => {
    loadCategories();
  }, []);
  useEffect(() => {
    if (!isLoading && !user) {
      router.push(APPLICATION_PAGE.root);
    }
  }, [isLoading, user, router]);
  // Filter recipes controls
  let filterBy_onChange = (value) => {
    setSelectedFilter(value);
    setSelectedCategory("");
    setSelectedGlass("");
    setSelectedIngredient("");
    setSelectedAlcoholicType("");
    setRecipeName("");
  };
  let btnClear_onClick = () => {
    setSelectedFilter("");
    setSelectedCategory("");
    setSelectedGlass("");
    setSelectedIngredient("");
    setSelectedAlcoholicType("");
    setRecipeName("");
    setRecipesFiltered(recipeAllRecipes);
  };
  let btnFind_onClick = () => {
    if (
      selectedCategory !== "" ||
      selectedGlass !== "" ||
      selectedIngredient !== "" ||
      selectedAlcoholicType !== "" ||
      recipeName !== ""
    ) {
      // setLoadingPage(true);
      makeRequest(
        API_ROUTES.drinks,
        REQ_METHODS.get,
        {
          criteria: API_DRINK_ROUTES.filteredDrinks,
          category: selectedCategory,
          glass: selectedGlass,
          ingredient: selectedIngredient,
          alcoholic: selectedAlcoholicType,
          recipename: recipeName,
        },
        (response) => {
          // Reload results
          if (response.isOk) {
            setRecipesFiltered(response.data);
            showToastMessage(
              "Recipes",
              response.data.length + " recipe(s) found!",
              SEVERITY.Success
            );
          } else {
            setRecipesFiltered(null);
            showToastMessage("Recipes", "No recipes found", SEVERITY.Warning);
          }

          setLoadingPage(false);
        }
      );
    } else
      showToastMessage("Filter", "No criteria to search", SEVERITY.Warning);
  };

  // Recipe actions
  let btnAddToMyMixMate_onClick = (recipeId) => {
    // Get user
    if (!user) {
      showToastMessage(
        "Please Log In",
        "You must be logged in to use Favourite Features",
        SEVERITY.Warning
      );
    }

    setLoadingPage(true);
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.post,
      { user: user, recipeId: recipeId },
      (response) => {
        if (response.isOk)
          showToastMessage("Recipe", response.message, SEVERITY.Success);
        else showToastMessage("Recipe", response.message, SEVERITY.Warning);
        setLoadingPage(false);
      }
    );
  };

  function RecipeRow(props) {
    // Variables
    const { drink } = props;
    const [rowOpen, setRowOpen] = useState(false);
    const [drinkInfo, setDrinkInfo] = useState(null);

    // Functions
    let loadDrinkInfo = () => {
      if (isNotSet(drinkInfo)) {
        // Load drink info

        makeRequest(
          API_ROUTES.drinkid,
          REQ_METHODS.get,
          { drinkid: drink.idDrink },
          (response) => {
            let drinkDetails = null;
            if (isSet(response.data.drinks)) {
              let drinkFetched = response.data;
              const drinkIngredients = [];

              // Format ingredients
              if (drink.ingredients.length > 0) {
                drinkFetched.ingredients.forEach((ing) => {
                  if (ing.ingredient && ing.measure) {
                    drinkIngredients.push(
                      <Typography className="margin-left-35px">
                        {capitalizeWords(ing.ingredient)} <i>({ing.measure})</i>
                      </Typography>
                    );
                  }
                });
              }

              drinkDetails = (
                <Box sx={{ margin: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <img
                        style={{ width: "90%", borderRadius: "7%" }}
                        src={drinkFetched.strDrinkThumb}
                      ></img>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <div className="text-tangerine text-55px margin-left-35px">
                        {drinkFetched.strDrink}
                      </div>

                      {/* Category */}
                      <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                          Category
                        </InputLabel>
                        <Input
                          id="input-with-icon-adornment"
                          startAdornment={
                            <InputAdornment position="start">
                              <ClassIcon />
                            </InputAdornment>
                          }
                          value={drinkFetched.strCategory}
                        />
                      </FormControl>
                      <br />
                      <br />

                      {/* Alcoholic type */}
                      <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                          Alcoholic type
                        </InputLabel>
                        <Input
                          id="input-with-icon-adornment"
                          startAdornment={
                            <InputAdornment position="start">
                              <LocalBarIcon />
                            </InputAdornment>
                          }
                          value={drinkFetched.strAlcoholic}
                        />
                      </FormControl>
                      <br />
                      <br />

                      {/* Glass type */}
                      <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                          Glass
                        </InputLabel>
                        <Input
                          id="input-with-icon-adornment"
                          startAdornment={
                            <InputAdornment position="start">
                              <LocalDrinkIcon />
                            </InputAdornment>
                          }
                          value={drinkFetched.strGlass}
                        />
                      </FormControl>
                      <br />
                      <br />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <InputLabel>Ingredients:</InputLabel>
                      {drinkIngredients}
                      <br></br>
                      <InputLabel>How to prepare:</InputLabel>
                      <Typography className="margin-left-35px">
                        {drinkFetched.strInstructions}
                      </Typography>
                    </Grid>
                    <Grid
                      xs
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ padding: 4 }}
                    >
                      <Button
                        onClick={() =>
                          btnAddToMyMixMate_onClick(drinkFetched.idDrink)
                        }
                        color="primary"
                        variant="contained"
                        startIcon={<FavoriteIcon />}
                      >
                        Add to Favorites
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              );
            } else {
              drinkDetails = (
                <Box sx={{ margin: 5 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Recipe not found
                  </Typography>
                </Box>
              );
            }
            setDrinkInfo(drinkDetails);
          }
        );

        // Done
        setRowOpen(!rowOpen);
      }

      return (
        <React.Fragment>
          <TableRow sx={{ "& > *": { borderColor: "blue", border: 0 } }}>
            <TableCell>
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => loadDrinkInfo()}
              >
                {rowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
            <TableCell component="th" scope="row">
              {capitalizeWords(drink.strDrink)}
            </TableCell>
          </TableRow>
          <TableRow sx={{ "& > *": { borderTop: 0 } }}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={2}>
              <Collapse in={rowOpen} timeout="auto" unmountOnExit>
                {drinkInfo}
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    };

    return (
      <>
        {/* Toast message */}
        <Snackbar
          open={openToasMessage}
          autoHideDuration={5000}
          onClose={() => setOpenToasMessage(false)}
        >
          <Alert severity={toast_severity}>
            <AlertTitle>{toast_title}</AlertTitle>
            {toast_message}
          </Alert>
        </Snackbar>

        {/* Loading */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loadingPage}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Page body */}
        <Grid container spacing={2} style={{ marginTop: 10 }}>
          <Grid item xs={12} sm={3}>
            <Paper elevation={3} style={{ margin: 15 }}>
              <CardContent
                style={{
                  textAlign: "center",
                  paddingTop: 25,
                  paddingBottom: 0,
                }}
              >
                <Typography variant="h6">Filter recipes</Typography>
              </CardContent>

              {/* Filters */}
              <div style={{ padding: 25 }}>
                <FormControl variant="standard" fullWidth>
                  <InputLabel id="filter-select-label">Filter by</InputLabel>
                  <Select
                    labelId="filter-select-label"
                    label="Filter by"
                    value={selectedFilter}
                    onChange={(e) => filterBy_onChange(e.target.value)}
                  >
                    {[
                      "Alcoholic Type",
                      "Category",
                      "Glass",
                      "Ingredient",
                      "Recipe Name",
                    ].map((f) => {
                      return (
                        <MenuItem key={f} value={f}>
                          {f}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>

              {/* Categories */}
              {selectedFilter === "Category" && (
                <div style={{ padding: 25 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      label="Category"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      {recipeCategories?.map((cat) => {
                        return (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Glasses */}
              {selectedFilter === "Glass" && (
                <div style={{ padding: 25 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="glass-select-label">Glass</InputLabel>
                    <Select
                      labelId="glass-select-label"
                      label="Glass"
                      value={selectedGlass}
                      onChange={(e) => setSelectedGlass(e.target.value)}
                    >
                      {recipeGlasses?.map((glass) => {
                        return (
                          <MenuItem key={glass} value={glass}>
                            {glass}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Ingredients */}
              {selectedFilter === "Ingredient" && (
                <div style={{ padding: 25 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="ingredient-select-label">
                      Ingredient
                    </InputLabel>
                    <Select
                      labelId="ingredient-select-label"
                      label="Ingredient"
                      value={selectedIngredient}
                      onChange={(e) => setSelectedIngredient(e.target.value)}
                    >
                      {recipeIngredients?.map((ingre) => {
                        return (
                          <MenuItem key={ingre} value={ingre}>
                            {ingre}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Alcoholic types */}
              {selectedFilter === "Alcoholic Type" && (
                <div style={{ padding: 25 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="alcoholictype-select-label">
                      Alcoholic Type
                    </InputLabel>
                    <Select
                      labelId="alcoholictype-select-label"
                      label="Alcoholic Type"
                      value={selectedAlcoholicType}
                      onChange={(e) => setSelectedAlcoholicType(e.target.value)}
                    >
                      {recipeAlcoholicTypes?.map((at) => {
                        return (
                          <MenuItem key={at} value={at}>
                            {at}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              )}

              {/* Recipe name */}
              {selectedFilter === "Recipe Name" && (
                <div style={{ padding: 25 }}>
                  <FormControl variant="standard" fullWidth>
                    <InputLabel htmlFor="input-with-icon-adornment">
                      Recipe name
                    </InputLabel>
                    <Input
                      id="input-with-icon-adornment"
                      startAdornment={
                        <InputAdornment position="start">
                          <LocalBarIcon />
                        </InputAdornment>
                      }
                      onChange={(e) => (recipeName = e.target.value)}
                    />
                  </FormControl>
                </div>
              )}

              <CardContent
                style={{
                  textAlign: "center",
                  paddingTop: 10,
                  paddingBottom: 25,
                }}
              >
                <Button
                  onClick={() => btnClear_onClick()}
                  color="error"
                  variant="contained"
                  startIcon={<ClearIcon />}
                  style={{ marginRight: 7 }}
                >
                  Clear
                </Button>
                <Button
                  onClick={() => btnFind_onClick()}
                  color="primary"
                  variant="contained"
                  startIcon={<SearchIcon />}
                  style={{ marginLeft: 7 }}
                >
                  Find
                </Button>
              </CardContent>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={9}>
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
                        <Typography variant="h6">Recipes</Typography>
                      </CardContent>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipesFiltered?.map((drink) => (
                    <RecipeRow key={drink.idDrink} drink={drink} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default Recipes;
