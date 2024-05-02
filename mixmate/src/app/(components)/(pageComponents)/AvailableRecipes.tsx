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
  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const handleClose = () => {
    props.setOpen(false);
    setPersonName([]);
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const selectedFilterIngredients =
      typeof value === "string" ? value.split(",") : value;
    setPersonName(typeof value === "string" ? value.split(",") : value);

    let filteredRecipes = filteredAllRecipes.filter((recipe) =>
      selectedFilterIngredients.every((ingredient) =>
        Object.keys(recipe).some(
          (key) =>
            key.startsWith("strIngredient") &&
            recipe[key]?.toLowerCase() === ingredient.toLowerCase()
        )
      )
    );
    setFilteredByIngredientsRecipes(filteredRecipes);
  };

  const handleDeleteIngredientFilter = (ingToDelete) => () => {
    console.log(ingToDelete);
    setPersonName((ingredients) =>
      ingredients.filter((ing) => ing !== ingToDelete)
    );
  };

  const [filteredAllRecipes, setFilteredRecipes] = useState([]);
  const [filteredByIngredientsRecipes, setFilteredByIngredientsRecipes] =
    useState([]);
  const [personName, setPersonName] = useState([]);

  const dispatch = useDispatch();
  const userIngredients = useSelector(
    (state: any) => state.userInfo.userIngredients
  );
  let loadAvailableRecipes = () => {
    makeRequest(
      API_ROUTES.availableRecipes,
      REQ_METHODS.get,
      { userId: user.sub },
      (response) => {
        setFilteredRecipes(response.data);
        setFilteredByIngredientsRecipes(response.data);
      },
      (error) => {
        props.showToastMessage("Error", error.message, SEVERITY.warning);
      }
    );
  };

  useEffect(() => {
    loadAvailableRecipes();
    loadUserIngredients();
  }, [props.ingredients]);

  const loadUserIngredients = () => {
    if (userIngredients.length === 0)
      makeRequest(
        API_ROUTES.userIngredients,
        REQ_METHODS.get,
        { userId: user.sub },
        (response) => {
          dispatch(userInfoActions.setUserIngredients(response.data.ingredients));
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
    const btnAddToMyMixMate_onClick = (recipe) => {
      makeRequest(
        API_ROUTES.favourite,
        REQ_METHODS.post,
        { userId: user.sub, recipe },
        (response) => {
          props.showToastMessage("Recipe", response.message, SEVERITY.Success);
        },
        (error) => {
          props.showToastMessage("Recipe", error.message, SEVERITY.Warning);
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
            if (isSet(response.data.drinks)) {
              let drink = response.data.drinks[0];

              // Format ingredients
              let drinkIngredients = [];
              for (let x = 1; x <= 99; x++) {
                let txtIngredient = null;
                let txtMesurement = null;
                if (isSet(drink["strIngredient" + x]))
                  txtIngredient = drink["strIngredient" + x];
                if (isSet(drink["strMeasure" + x]))
                  txtMesurement = drink["strMeasure" + x];

                if (isSet(txtIngredient))
                  if (MatchIngredient(txtIngredient)) {
                    drinkIngredients.push(
                      <Typography className="margin-left-35px included-ingredients">
                        {capitalizeWords(txtIngredient)}{" "}
                        <i>({txtMesurement})</i>
                      </Typography>
                    );
                  } else {
                    drinkIngredients.push(
                      <Typography className="margin-left-35px no-included-ingredients">
                        {txtIngredient} <i>({txtMesurement})</i>
                      </Typography>
                    );
                  }
                else break;
              }

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
                        onClick={() => btnAddToMyMixMate_onClick(drink)}
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
            {drink.strDrink}
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
          {props.ingredients.length === 0
            ? "No Available Recipes"
            : props.ingredients.length === 1
            ? `Available Recipes with ${capitalizeWords(props.ingredients[0])}`
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
                      <Typography variant="h6">Recipes</Typography>
                      <FormControl sx={{ m: 1, width: 300 }}>
                        <InputLabel id="demo-multiple-chip-label">
                          Filter by Ingredients
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          id="demo-multiple-chip"
                          multiple
                          value={personName}
                          onChange={handleChange}
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
                                  // Add hover effect
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
                                personName,
                                theme
                              )}
                            >
                              {ing.strIngredient1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
      </DialogContent>
    </Dialog>
  );
};
export default AvailableRecipes;
