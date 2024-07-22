import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";

import {
  displayErrorSnackMessage,
  isNotSet,
  isSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Divider, TableBody, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import {
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
  APPLICATION_PAGE,
} from "@/app/_utilities/_client/constants";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomKey } from "../_utilities/_server/util";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { ToastMessage } from "interface/toastMessage";
import { set } from "@auth0/nextjs-auth0/dist/session";

function AddEditRecipe_Component({
  openModal,
  closeModal,
  recipeId,
  reloadPage,
  applicationPage,
}) {
  const dispatch = useDispatch();
  const alcoholicTypes = useSelector(
    (state: any) => state.recipe.alcoholicTypes
  );
  const categories = useSelector((state: any) => state.recipe.categories);
  const glasses = useSelector((state: any) => state.recipe.glasses);
  const [newIngredient, setNewIngredient] = useState("");
  const [newMeasure, setNewMeasure] = useState("");
  const [originalListIngredients, setOriginalListIngredients] = useState([]);
  const [originalListMueasure, setOriginalListMeasure] = useState([]);
  const [currentRecipeRowObjectId, setCurrentRecipeRowObjectId] =
    useState(null);
  const [currentRecipeRowId, setCurrentRecipeRowId] = useState(null);
  const [currentRecipeType, setCurrentRecipeType] = useState(null);
  const [currentRecipeName, setCurrentRecipeName] = useState("");
  const [currentRecipeImage, setCurrentRecipeImage] = useState<File>(null);
  const [currentRecipeCategory, setCurrentRecipeCategory] = useState("");
  const [currentRecipeAlcoholicType, setCurrentRecipeAlcoholicType] =
    useState("");
  const [currentRecipeGlass, setCurrentRecipeGlass] = useState("");
  const [currentRecipeIngredients, setCurrentRecipeIngredients] = useState([]);
  const [currentRecipeMeasure, setCurrentRecipeMeasure] = useState([]);
  const [currentRecipeInstructions, setCurrentRecipeInstructions] =
    useState("");
  const [currentRecipeVisibility, setCurrentRecipeVisibility] = useState(
    applicationPage === APPLICATION_PAGE.social ? "public" : "private"
  );
  const [imageTypeLimitationText, setImageTypeLimitationText] = useState("");
  useEffect(() => {
    // Load data if recipe ID exist
    let loadRecipeIfExist = () => {
      if (isSet(recipeId)) {
        dispatch(pageStateActions.setPageLoadingState(true));
        makeRequest(
          API_ROUTES.sharedRecipeById,
          REQ_METHODS.get,
          { recipeid: recipeId },
          (response) => {
            setCurrentRecipeRowId(response.data.idDrink);
            setCurrentRecipeRowObjectId(response.data._id);
            setCurrentRecipeName(response.data.strDrink);
            setCurrentRecipeImage(response.data.strDrinkThumb);
            setCurrentRecipeCategory(response.data.strCategory);
            setCurrentRecipeAlcoholicType(response.data.strAlcoholic);
            setCurrentRecipeGlass(response.data.strGlass);
            const ingredients = [];
            const measures = [];
            response.data.ingredients.forEach((ing) => {
              ingredients.push(ing.ingredient);
              measures.push(ing.measure);
            });
            setCurrentRecipeIngredients(ingredients);
            setCurrentRecipeMeasure(measures);
            setCurrentRecipeInstructions(response.data.strInstructions);
            setCurrentRecipeVisibility(response.data.visibility);
            dispatch(pageStateActions.setPageLoadingState(false));
          }
        )
          .catch((error) => {
            displayErrorSnackMessage(error, dispatch);
          })
          .finally(() => {
            dispatch(pageStateActions.setPageLoadingState(false));
          });
      }

      return recipeId;
    };
    loadRecipeIfExist();
    //eslint-disable-next-line
  }, [openModal, recipeId]);
  // Modal events
  let closeNewRecipeModal_onClick = () => {
    setNewIngredient("");
    setNewMeasure("");
    setOriginalListIngredients([]);
    setOriginalListMeasure([]);

    setCurrentRecipeRowId(null);
    setCurrentRecipeType(null);
    setCurrentRecipeName("");
    setCurrentRecipeImage(null);
    setCurrentRecipeCategory("");
    setCurrentRecipeAlcoholicType("");
    setCurrentRecipeGlass("");
    setCurrentRecipeIngredients([]);
    setCurrentRecipeMeasure([]);
    setCurrentRecipeInstructions("");
    setImageTypeLimitationText("");
    dispatch(pageStateActions.setPageLoadingState(false));
    closeModal();
  };
  let fileSelectImage_onChange = (file) => {
    if (file) {
      // Check if the file type starts with 'image/'

      if (!file.type.startsWith("image/")) {
        setImageTypeLimitationText("Please select an image file.");
        dispatch(pageStateActions.setPageLoadingState(false));
      }

      // Optional: Check file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setImageTypeLimitationText(
          "File is too large. Please select an image smaller than 5MB."
        );
        dispatch(pageStateActions.setPageLoadingState(false));
      }
      setImageTypeLimitationText("");
      setCurrentRecipeImage(file);
    } else {
      setImageTypeLimitationText("");
    }
  };

  let handleAddNewIngredientButtonClick = () => {
    // Validations
    let toastMessageObject: ToastMessage;
    if (isNotSet(newIngredient)) {
      toastMessageObject = {
        open: true,
        message: "Enter a new ingredient name",
        severity: SEVERITY.Warning,
        title: "Ingredients",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
    } else {
      let addNewIngredientToList = currentRecipeIngredients;
      addNewIngredientToList.push(newIngredient);
      setCurrentRecipeIngredients(addNewIngredientToList);
      setNewIngredient("");

      let addNewMeasureToList = currentRecipeMeasure;
      addNewMeasureToList.push(newMeasure);
      setCurrentRecipeMeasure(addNewMeasureToList);
      setNewMeasure("");
      toastMessageObject = {
        open: true,
        message: "Ingredient added",
        severity: SEVERITY.Success,
        title: "Ingredients",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
    }
  };
  let handleRemoveIngredientButtonClick = (index) => {
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

    const toastMessageObject: ToastMessage = {
      open: true,
      message: "Ingredient removed.",
      severity: SEVERITY.Success,
      title: "Ingredients",
    };
    dispatch(pageStateActions.setToastMessage(toastMessageObject));
  };
  let handleAddNewOrEditRecipeButtonClick = async () => {
    let toastMessageObject: ToastMessage;

    // Validate data
    if (isNotSet(currentRecipeName)) {
      toastMessageObject = {
        open: true,
        message: "Recipe name is required",
        severity: SEVERITY.Warning,
        title: "New Recipe",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
      return;
    } else if (
      isNotSet(currentRecipeIngredients) ||
      currentRecipeIngredients.length === 0
    ) {
      toastMessageObject = {
        open: true,
        message: "Add at least one ingredient",
        severity: SEVERITY.Warning,
        title: "New Recipe",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
      return;
    } else if (isNotSet(currentRecipeInstructions)) {
      toastMessageObject = {
        open: true,
        message: "Write the instructions to prepare your recipe",
        severity: SEVERITY.Warning,
        title: "New Recipe",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
      return;
    } else if (isNotSet(currentRecipeImage)) {
      toastMessageObject = {
        open: true,
        message: isNotSet(imageTypeLimitationText)
          ? "Select an image for your recipe"
          : imageTypeLimitationText,
        severity: SEVERITY.Warning,
        title: "New Recipe",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
      return;
      //validate only if the recipes is created for the first time
    } else if (!recipeId && !currentRecipeImage.type.startsWith("image/")) {
      setImageTypeLimitationText("Please select an image file.");
      toastMessageObject = {
        open: true,
        message: "Please select an image file.",
        severity: SEVERITY.Warning,
        title: "Image Error",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
      dispatch(pageStateActions.setPageLoadingState(false));

      return;
    } // 5MB
    else if (!recipeId && currentRecipeImage.size > 5 * 1024 * 1024) {
      setImageTypeLimitationText(
        "File is too large. Please select an image smaller than 5MB."
      );
      toastMessageObject = {
        open: true,
        message: "File is too large. Please select an image smaller than 5MB.",
        severity: SEVERITY.Warning,
        title: "Image Error",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
      dispatch(pageStateActions.setPageLoadingState(false));

      return;
    } else if (
      currentRecipeType === "Favorite" &&
      JSON.stringify(currentRecipeIngredients) ===
        JSON.stringify(originalListIngredients) &&
      JSON.stringify(currentRecipeMeasure) ===
        JSON.stringify(originalListMueasure)
    ) {
      toastMessageObject = {
        open: true,
        message: "List of ingredients cannot be the same",
        severity: SEVERITY.Warning,
        title: "New Recipe",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
    }
    //validated!
    else {
      dispatch(pageStateActions.setPageLoadingState(true));
      //if the recipe is newly created, or if from favorite page, create a copy of the recipe
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
        let fileName = "";
        if (
          currentRecipeImage &&
          currentRecipeImage.type.startsWith("image/") &&
          currentRecipeImage.size < 5 * 1024 * 1024
        ) {
          setImageTypeLimitationText("");
          const formData = new FormData();
          formData.append("file", currentRecipeImage);
          await makeRequest(
            API_ROUTES.image,
            REQ_METHODS.post,
            formData,
            (response) => {
              if (response.message === "File has been added to the storage.") {
                fileName = response.data;
              }
            }
          )
            .catch((error) => {
              displayErrorSnackMessage(error, dispatch);
            })
            .finally(() => {
              dispatch(pageStateActions.setPageLoadingState(false));
            });
        }

        if (fileName === "") {
          dispatch(pageStateActions.setPageLoadingState(false));
          return;
        }
        let newRecipeInfo = {
          idDrink: generateRandomKey(12),
          strDrink: currentRecipeName,
          strDrinkThumb: fileName,
          strCategory: currentRecipeCategory,
          strAlcoholic: currentRecipeAlcoholicType,
          strInstructions: currentRecipeInstructions,
          strGlass: currentRecipeGlass,
          ingredients: ingredientsArray,
          visibility: currentRecipeVisibility,
        };

        //if image is not included, only send {recipe:newRecipeInfo}
        //as body, if image is included filename and image will be sent too
        makeRequest(
          API_ROUTES.recipeShare,
          REQ_METHODS.post,
          {
            recipe: newRecipeInfo,
            filename: fileName,
          },
          (response) => {
            closeNewRecipeModal_onClick();
            const toastMessageObject: ToastMessage = {
              open: true,
              message: newRecipeInfo.strDrink + " added!",
              severity: SEVERITY.Success,
              title: "New Recipe",
            };
            dispatch(pageStateActions.setToastMessage(toastMessageObject));

            // Reload recipes list
            reloadPage();
          }
        )
          .catch((error) => {
            displayErrorSnackMessage(error, dispatch);
          })
          .finally(() => {
            dispatch(pageStateActions.setPageLoadingState(false));
          });
      } else {
        //if image has been updated the currentRecipeImage will be a file,
        //else it will be a string
        let fileName = "";
        if (currentRecipeImage.type) {
          if (
            currentRecipeImage &&
            currentRecipeImage.type.startsWith("image/") &&
            currentRecipeImage.size < 5 * 1024 * 1024
          ) {
            setImageTypeLimitationText("");
            const formData = new FormData();
            formData.append("file", currentRecipeImage);
            await makeRequest(
              API_ROUTES.image,
              REQ_METHODS.post,
              formData,
              (response) => {
                if (
                  response.message === "File has been added to the storage."
                ) {
                  fileName = response.data;
                }
              }
            )
              .catch((error) => {
                displayErrorSnackMessage(error, dispatch);
              })
              .finally(() => {
                dispatch(pageStateActions.setPageLoadingState(false));
              });
          }
        }
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
          _id: currentRecipeRowObjectId,
          idDrink: currentRecipeRowId,
          strDrink: currentRecipeName,
          strDrinkThumb: isNotSet(fileName) ? currentRecipeImage : fileName,
          strCategory: currentRecipeCategory,
          strAlcoholic: currentRecipeAlcoholicType,
          strInstructions: currentRecipeInstructions,
          strGlass: currentRecipeGlass,
          ingredients: ingredientsArray,
          visibility: currentRecipeVisibility,
        };

        makeRequest(
          API_ROUTES.recipeShare,
          REQ_METHODS.put,
          { recipe: newRecipeInfo },
          (response) => {
            closeNewRecipeModal_onClick();
            const toastMessageObject: ToastMessage = {
              open: true,
              message: newRecipeInfo.strDrink + " updated!",
              severity: SEVERITY.Success,
              title: "New Recipe",
            };
            dispatch(pageStateActions.setToastMessage(toastMessageObject));

            reloadPage();
          }
        )
          .catch((error) => {
            displayErrorSnackMessage(error, dispatch);
          })
          .finally(() => {
            dispatch(pageStateActions.setPageLoadingState(false));
          });
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
          {
            <>
              <FormControl variant="standard" fullWidth>
                <InputLabel id="new-category-select-label">Category</InputLabel>
                <Select
                  value={currentRecipeCategory}
                  labelId="new-category-select-label"
                  label="Category"
                  onChange={(e) => setCurrentRecipeCategory(e.target.value)}
                >
                  {categories?.map((cat, index) => {
                    return (
                      <MenuItem key={index} value={cat}>
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
                  onChange={(e) =>
                    setCurrentRecipeAlcoholicType(e.target.value)
                  }
                >
                  {alcoholicTypes?.map((alc, index) => {
                    return (
                      <MenuItem key={index} value={alc.strAlcoholic}>
                        {alc.strAlcoholic}
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
                  {glasses?.map((glass, index) => {
                    // const label =
                    // typeof glass === "string" ? glass : glass?.toString() || "";
                    return (
                      <MenuItem key={index} value={glass}>
                        {glass}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </>
          }
          <br />
          <br />
          <label className="file-input-label">
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => fileSelectImage_onChange(e.target.files[0])}
            />
          </label>
          <br />

          <Typography variant="caption" color="error">
            {imageTypeLimitationText}
          </Typography>
          <Divider sx={{ m: "30px 10px 0px 0px" }} />
          <DialogTitle>Preparation</DialogTitle>
          <Table>
            <TableBody>
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
                    onClick={() => handleAddNewIngredientButtonClick()}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              {currentRecipeIngredients?.map((ingredient, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell colSpan={2}>
                      <Typography className="margin-left-35px">
                        {ingredient} <i>({currentRecipeMeasure[index]})</i>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleRemoveIngredientButtonClick(index)}
                        color="error"
                      >
                        <ClearIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
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
            onClick={() => handleAddNewOrEditRecipeButtonClick()}
            color="success"
            variant="outlined"
            startIcon={<BorderColorIcon />}
          >
            {recipeId ? "Save Changes" : "Add New Recipe"}
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
