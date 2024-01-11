import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import { doPost, isNotSet, isSet, makeRequest } from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  APPLICATION_PAGE,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import BorderColorIcon from "@mui/icons-material/BorderColor";

function AddEditRecipe_Component(props) {
  const {
    openModal,
    closeModal,
    recipeCategories,
    recipeAlcoholicTypes,
    recipeGlasses,
    showToastMessage,
    setLoadingPage,
    recipeId,
    reloadPage,
  } = props;

  const [recipeIdLoaded, setRecipeIdLoaded] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const [newMeasure, setNewMeasure] = useState("");
  const [originalListIngredients, setOriginalListIngredients] = useState([]);
  const [originalListMueasure, setOriginalListMeasure] = useState([]);

  const [currentRecipeRowId, setCurrentRecipeRowId] = useState(null);
  const [currentRecipeType, setCurrentRecipeType] = useState(null);
  const [currentRecipeName, setCurrentRecipeName] = useState("");
  const [currentRecipeImage, setCurrentRecipeImage] = useState<
    string | ArrayBuffer
  >("");
  const [currentRecipeCategory, setCurrentRecipeCategory] = useState("");
  const [currentRecipeAlcoholicType, setCurrentRecipeAlcoholicType] =
    useState("");
  const [currentRecipeGlass, setCurrentRecipeGlass] = useState("");
  const [currentRecipeIngredients, setCurrentRecipeIngredients] = useState([]);
  const [currentRecipeMeasure, setCurrentRecipeMeasure] = useState([]);
  const [currentRecipeInstructions, setCurrentRecipeInstructions] =
    useState("");

  // Load data if recipe ID exist
  let loadRecipeIfExist = () => {
    // if(isSet(recipeId) && recipeIdLoaded === false)
    // {

    //     doPost(API.CustomRecipes.getRecipeById, {userNickname: userSession, recipeId: recipeId}, (response) =>
    //     {
    //         if(response.isOk)
    //         {
    //             setOriginalListIngredients(response.data.recipeIngredients.map(x => x));
    //             setOriginalListMeasure(response.data.recipeMeasure.map(x => x));

    //             setCurrentRecipeRowId(response.data._id);
    //             setCurrentRecipeType(response.data.type);
    //             setCurrentRecipeName(response.data.recipeName);
    //             setCurrentRecipeImage(response.data.recipePicture);
    //             setCurrentRecipeCategory(response.data.recipeCategory);
    //             setCurrentRecipeAlcoholicType(response.data.recipeAlcoholicType);
    //             setCurrentRecipeGlass(response.data.recipeGlass);
    //             setCurrentRecipeIngredients(response.data.recipeIngredients);
    //             setCurrentRecipeMeasure(response.data.recipeMeasure);
    //             setCurrentRecipeInstructions(response.data.recipeInstructions);
    //             setRecipeIdLoaded(true);
    //         }
    //     });
    // }

    return recipeId;
  };
  const [currentRecipeId, setCurrentRecipeId] = useState(loadRecipeIfExist());

  // Modal events
  let closeNewRecipeModal_onClick = () => {
    setRecipeIdLoaded(false);
    setNewIngredient("");
    setNewMeasure("");
    setOriginalListIngredients([]);
    setOriginalListMeasure([]);

    setCurrentRecipeRowId(null);
    setCurrentRecipeType(null);
    setCurrentRecipeName("");
    setCurrentRecipeImage("");
    setCurrentRecipeCategory("");
    setCurrentRecipeAlcoholicType("");
    setCurrentRecipeGlass("");
    setCurrentRecipeIngredients([]);
    setCurrentRecipeMeasure([]);
    setCurrentRecipeInstructions("");

    closeModal();
  };
  let fleSelectImagr_onChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setCurrentRecipeImage(base64);
    };
    reader.readAsDataURL(file);
  };
  let btnAddNewIngredient_onClick = () => {
    // Validations
    if (isNotSet(newIngredient))
      showToastMessage(
        "Ingredients",
        "Enter a new ingredient name",
        SEVERITY.Warning
      );
    else {
      let addNewIngredientToList = currentRecipeIngredients;
      addNewIngredientToList.push(newIngredient);
      setCurrentRecipeIngredients(addNewIngredientToList);
      setNewIngredient("");

      let addNewMeasureToList = currentRecipeMeasure;
      addNewMeasureToList.push(newMeasure);
      setCurrentRecipeMeasure(addNewMeasureToList);
      setNewMeasure("");

      showToastMessage("Ingredients", "Ingredient added", SEVERITY.Success);
    }
  };
  let btnRemoveIngredient_onClick = (index) => {
    let newIngredientsList = [];
    currentRecipeIngredients.forEach((x, i) =>
      i !== index ? newIngredientsList.push(x) : null
    );
    setCurrentRecipeIngredients(newIngredientsList);

    let newMeasureList = [];
    currentRecipeMeasure.forEach((x, i) =>
      i !== index ? newMeasureList.push(x) : null
    );
    setCurrentRecipeMeasure(newMeasureList);

    showToastMessage("Ingredients", "Ingredient removed", SEVERITY.Success);
  };
  let btnAddNewRecipe_onClick = () => {
    // Validate data
    if (isNotSet(currentRecipeName))
      showToastMessage(
        "New Recipe",
        "Recipe name is required",
        SEVERITY.Warning
      );
    else if (
      isNotSet(currentRecipeIngredients) ||
      currentRecipeIngredients.length === 0
    )
      showToastMessage(
        "New Recipe",
        "Add at least one ingredient",
        SEVERITY.Warning
      );
    else if (isNotSet(currentRecipeInstructions))
      showToastMessage(
        "New Recipe",
        "Write the instructions to prepare your recipe",
        SEVERITY.Warning
      );
    else if (
      currentRecipeType === "Favorite" &&
      JSON.stringify(currentRecipeIngredients) ===
        JSON.stringify(originalListIngredients) &&
      JSON.stringify(currentRecipeMeasure) ===
        JSON.stringify(originalListMueasure)
    )
      showToastMessage(
        "New Recipe",
        "List of ingredients cannot be the same",
        SEVERITY.Warning
      );
    else {
      setLoadingPage(true);
      if (isNotSet(currentRecipeRowId) || currentRecipeType === "Favorite") {
        const ingredientsArray = [];
        // Add new recipe
        for (let i = 0; i < currentRecipeIngredients.length; i++) {
          if (currentRecipeIngredients[i] && currentRecipeMeasure[i])
            ingredientsArray.push({
              ingredient: currentRecipeIngredients[i],
              measure: currentRecipeMeasure[i],
            });
        }
        let newRecipeInfo = {
          strDrink: currentRecipeName,
          strDrinkThumb: currentRecipeImage,
          strCategory: currentRecipeCategory,
          strAlcoholic: currentRecipeAlcoholicType,
          strInstructions: currentRecipeInstructions,
          strGlass: currentRecipeGlass,
          ingredients: ingredientsArray,
        };
        makeRequest(API_ROUTES.recipeShare, REQ_METHODS.post, {recipe: newRecipeInfo}, (response)=>{
            if (response.isOk) {
                closeNewRecipeModal_onClick();
                showToastMessage(
                  "New Recipe",
                  newRecipeInfo.strDrink + " added!",
                  SEVERITY.Success
                );
    
                // Reload recipes list
                reloadPage();
              } else
                showToastMessage("New Recipe", response.message, SEVERITY.Error);
    
              setLoadingPage(false);
        })
      } else {
        // Update recipe info
        const ingredientsArray = [];

        for (let i = 0; i < currentRecipeIngredients.length; i++) {
            if (currentRecipeIngredients[i] && currentRecipeMeasure[i])
              ingredientsArray.push({
                ingredient: currentRecipeIngredients[i],
                measure: currentRecipeMeasure[i],
              });
          }
        let newRecipeInfo = {
          _id: currentRecipeRowId,          
          strDrink: currentRecipeName,
          strDrinkThumb: currentRecipeImage,
          strCategory: currentRecipeCategory,
          strAlcoholic: currentRecipeAlcoholicType,
          strInstructions: currentRecipeInstructions,
          strGlass: currentRecipeGlass,
          ingredients: ingredientsArray,
        };

        makeRequest(API_ROUTES.recipeShare, REQ_METHODS.put, {recipe: newRecipeInfo}, (response)=>{
            if (response.isOk) {
                closeNewRecipeModal_onClick();
                showToastMessage(
                  "New Recipe",
                  newRecipeInfo.strDrink + " added!",
                  SEVERITY.Success
                );
    
                // Reload recipes list
                reloadPage();
              } else
                showToastMessage("New Recipe", response.message, SEVERITY.Error);
    
              setLoadingPage(false);
        })
      }
    }
  };

  return (
    <>
      {/* Add new recipe Modal */}
      <Dialog onClose={() => closeNewRecipeModal_onClick()} open={openModal}>
        <DialogTitle>About the recipe</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={currentRecipeName}
            onChange={(e) => setCurrentRecipeName(e.target.value)}
          />
          <br />
          <br />
          <FormControl variant="standard" fullWidth>
            <InputLabel id="new-category-select-label">Category</InputLabel>
            <Select
              value={currentRecipeCategory}
              labelId="new-category-select-label"
              label="Category"
              onChange={(e) => setCurrentRecipeCategory(e.target.value)}
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
          <br />
          <br />
          <FormControl variant="standard" fullWidth>
            <InputLabel id="new-alcoholic-type-select-label">
              Alcoholic type
            </InputLabel>
            <Select
              value={currentRecipeAlcoholicType}
              labelId="new-alcoholic-type-select-label"
              label="Alcoholic type"
              onChange={(e) => setCurrentRecipeAlcoholicType(e.target.value)}
            >
              {recipeAlcoholicTypes?.map((cat) => {
                return (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl variant="standard" fullWidth>
            <InputLabel id="new-glass-select-label">Glass</InputLabel>
            <Select
              value={currentRecipeGlass}
              labelId="new-glass-select-label"
              label="Glass"
              onChange={(e) => setCurrentRecipeGlass(e.target.value)}
            >
              {recipeGlasses?.map((cat) => {
                return (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <br />
          <br />
          <label className="file-input-label">
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => fleSelectImagr_onChange(e.target.files[0])}
            />
            LOAD IMAGE
          </label>
        </DialogContent>
        <DialogTitle>Preparation</DialogTitle>
        <DialogContent>
          <Table>
            <TableRow>
              <TableCell>
                <TextField
                  margin="dense"
                  label="Ingredient"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  margin="dense"
                  label="Measure"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={newMeasure}
                  onChange={(e) => setNewMeasure(e.target.value)}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => btnAddNewIngredient_onClick()}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>
              </TableCell>
            </TableRow>
            {currentRecipeIngredients?.map((ingredient, index) => {
              return (
                <TableRow>
                  <TableCell colSpan={2}>
                    <Typography className="margin-left-35px">
                      {ingredient} <i>({currentRecipeMeasure[index]})</i>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => btnRemoveIngredient_onClick(index)}
                      color="error"
                    >
                      <ClearIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>
          <TextField
            margin="dense"
            label="How to prepare"
            type="text"
            fullWidth
            variant="standard"
            value={currentRecipeInstructions}
            onChange={(e) => setCurrentRecipeInstructions(e.target.value)}
          />
          <br />
          <br />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => btnAddNewRecipe_onClick()}
            color="success"
            variant="outlined"
            startIcon={<BorderColorIcon />}
          >
            {recipeId ? "Edit recipe" : "Add new recipe"}
          </Button>
          <Button
            onClick={() => closeNewRecipeModal_onClick()}
            color="error"
            variant="outlined"
            startIcon={<ClearIcon />}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddEditRecipe_Component;
