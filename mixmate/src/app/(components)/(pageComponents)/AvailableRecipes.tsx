import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import CardContent from "@mui/material/CardContent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import {
  isNotSet,
  isSet,
  capitalizeWords,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import {
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
} from "@/app/_utilities/_client/constants";
import { useDispatch, useSelector } from "react-redux";
import { userInfoActions } from "../../../lib/redux/userInfoSlice";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@mui/material/styles";
import { useUser } from "@auth0/nextjs-auth0/client";
import Chip from "@mui/material/Chip";
import { Pagination } from "@mui/material";
import { pageStateActions } from "lib/redux/pageStateSlice";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const AvailableRecipes = (props) => {
  const theme = useTheme();
  const { user, error, isLoading } = useUser();
  const [pageIndexCount, setPageIndexCount] = useState(1);
  const [filteredAllRecipes, setFilteredRecipes] = useState([]);
  const [filteredByIngredientsRecipes, setFilteredByIngredientsRecipes] =
    useState([]);
  const [ingredientName, setIngredientName] = useState([]);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  function findRecipesWithAllIngredients(recipes, selectedFilterIngredients) {
    console.log(selectedFilterIngredients);

    // Filter recipes that contain all selected ingredients
    const filteredRecipes = recipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((ingredient) =>
        ingredient.ingredient.toLowerCase()
      );

      return selectedFilterIngredients.every((ingredient) =>
        recipeIngredients.includes(ingredient.toLowerCase())
      );
    });

    // Sort the filteredRecipes array by the strDrink property
    filteredRecipes.sort((a, b) => {
      const drinkA = a.strDrink.toLowerCase();
      const drinkB = b.strDrink.toLowerCase();

      if (drinkA < drinkB) return -1;
      if (drinkA > drinkB) return 1;
      return 0;
    });
    console.log(filteredRecipes);
    return filteredRecipes;
  }

  const handleClose = () => {
    props.setOpen(false);
    setIngredientName([]);
  };
  let onPageIndexChange = (e) => {
    const buttonLabel = e.currentTarget.getAttribute("aria-label");
    props.dispatch(pageStateActions.setPageLoadingState(true));

    if (buttonLabel === "Go to next page") {
      setPage(page + 1);
      loadAvailableRecipes(page + 1);
    } else if (buttonLabel === "Go to previous page" || page > 1) {
      setPage(page - 1);
      loadAvailableRecipes(page - 1);
    } else if (e.target.innerText) {
      setPage(parseInt(e.target.innerText));
      loadAvailableRecipes(parseInt(e.target.innerText));
    } else {
      alert("Invalid page index");
    }
  };

  let loadAvailableRecipes = (pageIndex = 1) => {
    const startIndex = (pageIndex - 1) * 10;
    const endIndex = startIndex + 10;

    const filteredRecipesByIndex = filteredAllRecipes.slice(
      startIndex,
      endIndex
    );
    setFilteredByIngredientsRecipes(filteredRecipesByIndex);
    dispatch(pageStateActions.setPageLoadingState(false));
  };
  let loadAllAvailableRecipes = (pageIndex = 1) => {
    const criteria = props.isSingleIngredient  ? {
      userId: user.sub,
      singleIngredient: props.isSingleIngredient,
      ingredient: props.ingredient.strIngredient1,
    } : {userId: user.sub};
    makeRequest(
      API_ROUTES.availableRecipes,
      REQ_METHODS.get,
      criteria,
      (response) => {
        setFilteredRecipes(response.data);

        setPageIndexCount(Math.ceil(response.data.length / 10));
        const startIndex = (pageIndex - 1) * 10;
        const endIndex = startIndex + 10;

        const filteredRecipesByIndex = response.data.slice(
          startIndex,
          endIndex
        );
        setFilteredByIngredientsRecipes(filteredRecipesByIndex);
      },
      (error) => {
        props.showToastMessage("Error", error.message, SEVERITY.warning);
      }
    );
  };

  const handleIngredientsFilterChange = (event) => {
    const {
      target: { value },
    } = event;
    setPage(1);
    const selectedFilterIngredients =
      typeof value === "string" ? value.split(",") : value;
    setIngredientName(typeof value === "string" ? value.split(",") : value);
    const filteredRecipes = findRecipesWithAllIngredients(
      filteredAllRecipes,
      selectedFilterIngredients
    );
    //setFilteredRecipes(filteredRecipes);
    setPageIndexCount(Math.ceil(filteredRecipes.length / 10));

    // Calculate the start and end indices for the slice based on the current page index
    const startIndex = 0;
    const endIndex = 10;
    const filteredRecipesByIndex = filteredRecipes.slice(startIndex, endIndex);

    setFilteredByIngredientsRecipes(filteredRecipesByIndex);
  };

  // const handleDeleteIngredientFilter = (ingToDelete) => () => {
  //   console.log(ingToDelete);
  //   setIngredientName((ingredients) =>
  //     ingredients.filter((ing) => ing !== ingToDelete)
  //   );
  // };

  useEffect(() => {
    loadUserIngredients();

    if (props.open) {
      loadAllAvailableRecipes();
    }
  }, [userIngredients, props.open]);

  const loadUserIngredients = () => {
    if (userIngredients.length === 0)
      makeRequest(
        API_ROUTES.userIngredients,
        REQ_METHODS.get,
        { userId: user.sub },
        (response) => {
          dispatch(
            userInfoActions.setUserIngredients(response.data.ingredients)
          );
        }
      );
  };

  function MatchIngredient(ingredient) {
    const userIngredients = useSelector(
      (state: any) => state.userInfo.userIngredients
    );
    for (let word of userIngredients) {
      if (word.strIngredient1.toLowerCase() == ingredient.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  function RecipeRow(props) {
    // Variables
    const { drink } = props;
    const [rowOpen, setRowOpen] = useState(false);
    const [drinkInfo, setDrinkInfo] = useState(null);
    const handleAddToFavourites = (recipe) => {
      makeRequest(
        API_ROUTES.favourite,
        REQ_METHODS.post,
        { userId: user.sub, recipe },
        (response) => {
          props.showToastMessage("Recipe", response.message, SEVERITY.Success);
        },
        (error) => {
          alert(error.message);
        }
      );
    };
    // Functions
    let loadDrinkInfo = () => {
      if (isNotSet(drinkInfo)) {
        // Load drink info
        makeRequest(
          API_ROUTES.drinkbyid,
          REQ_METHODS.get,
          { drinkid: drink._id },
          (response) => {
            let drinkDetails = null;
            if (isSet(response.data)) {
              let drink = response.data;

              // Format ingredients
              let drinkIngredients = [];
              drink.ingredients.forEach((ingredient) => {
                let txtIngredient = ingredient.ingredient
                  ? ingredient.ingredient
                  : "N/A";
                let txtMesurement = ingredient.measure
                  ? ingredient.measure
                  : "N/A";

                drinkIngredients.push(
                  <Typography className="margin-left-35px included-ingredients">
                    {capitalizeWords(txtIngredient)} <i>({txtMesurement})</i>
                  </Typography>
                );
              });

              drinkDetails = (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <img
                        style={{ width: "100%", borderRadius: "7%" }}
                        src={drink.strDrinkThumb}
                      ></img>
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <div className="text-tangerine text-55px margin-left-35px">
                        {drink.strDrink}
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
                          value={drink.strCategory}
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
                          value={drink.strAlcoholic}
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
                          value={drink.strGlass}
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
                        {drink.strInstructions}
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
                        onClick={() => handleAddToFavourites(drink)}
                        color="primary"
                        variant="outlined"
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
          },
          (error) => {
            props.showToastMessage("Error", error.message, SEVERITY.warning);
          }
        );
      }

      // Done
      setRowOpen(!rowOpen);
    };

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
  }
  return (
    <Dialog
      open={props.open}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "600px",
          position: "relative",
          "@media (min-width: 600px)": {
            width: "60%",
          },
        },
      }}
    >
      <DialogTitle>
        <Typography
          paddingRight="20px"
          sx={{
            fontSize: "1em",
            fontFamily: '"Arial", sans-serif',
            color: "skyblue",
          }}
        >
          {userIngredients.length === 0
            ? "No Available Recipes"
            : userIngredients.length === 1 
            ? `Available Recipes with ${capitalizeWords(
                userIngredients[0].strIngredient1
              )}`
            : "Available Recipes with your Current Ingredients"}
        </Typography>
        <IconButton
          onClick={() => handleClose()}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          paddingX: 2,
          overflowY: "auto",
          maxHeight: "calc(100vh - 96px)",
          "&:first-of-type": {
            paddingTop: 0,
          },
        }}
      >
        <Grid container justifyContent="center" alignItems="stretch">
          <Grid item xs={12}>
            <Table aria-label="collapsible table" sx={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" colSpan={2}>
                    <CardContent
                      style={{
                        textAlign: "center",
                        paddingTop: 10,
                        paddingBottom: 0,
                      }}
                    >
                      <Box
                        display="flow"
                        justifyContent="center"
                        alignItems="center"
                        margin={2}
                      >
                        <Typography variant="h6">Recipes</Typography>
                        <FormControl sx={{ m: 1, width: "100%" }}>
                          {!props.isSingleIngredient && (<>
                          <InputLabel id="demo-multiple-chip-label">
                            Filter by Ingredients
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={ingredientName}
                            onChange={handleIngredientsFilterChange}
                            input={
                              <OutlinedInput
                                id="select-multiple-chip"
                                label="Filter by Ingredients"
                              />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip
                                    key={value}
                                    label={value}
                                  />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                          >
                            {userIngredients.map((ing) => (
                              <MenuItem
                                key={ing.strIngredient1}
                                value={ing.strIngredient1}
                                style={getStyles(
                                  ing.strIngredient1,
                                  ingredientName,
                                  theme
                                )}
                              >
                                {ing.strIngredient1}
                              </MenuItem>
                            ))}
                          </Select></>)}
                        </FormControl>
                      </Box>
                    </CardContent>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredByIngredientsRecipes?.map((drink) => (
                  <RecipeRow key={drink.idDrink} drink={drink} />
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          marginTop={5}
          marginX={2}
        >
          <Pagination
            shape="rounded"
            variant="outlined"
            count={pageIndexCount}
            page={page}
            defaultPage={1}
            boundaryCount={10}
            onChange={onPageIndexChange}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default AvailableRecipes;
