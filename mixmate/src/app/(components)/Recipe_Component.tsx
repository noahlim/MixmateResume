import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  APPLICATION_PAGE,
  MIXMATE_DOMAIN,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Tooltip from "@mui/material/Tooltip";
import {
  capitalizeWords,
  displayErrorSnackMessage,
  isNotSet,
  isSet,
  makeRequest,
  formatDateTime,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import { Typography, TextField, Divider, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import InputAdornment from "@mui/material/InputAdornment";
import { useTheme } from "@mui/material/styles";
import AddEditRecipe_Component from "./AddEditRecipe_Component";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  EmailIcon,
  EmailShareButton,
  XIcon,
} from "react-share";
import { useDispatch } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import { ToastMessage } from "interface/toastMessage";
import RecipeComponentRow from "./RecipeComponentRow";
import SharingDialog from "./SharingDialog";

function Recipe_Component({ applicationPage, recipes, reloadRecipes }) {
  const dispatch = useDispatch();

  const isEditablePage =
    applicationPage === APPLICATION_PAGE.favourites ||
    applicationPage === APPLICATION_PAGE.myRecipes;

  const { user, error, isLoading } = useUser();

  const [sharingUrl, setSharingUrl] = useState("");
  // Delete recipes
  const [modalDeleteRecipeOpen, setModalDeleteRecipeOpen] = useState(false);
  const [infoRecipeToDelete, setInfoRecipeToDelete] = useState(null);
  let handleModalDelteRecipeOpen = (id, recipeName) => {
    setInfoRecipeToDelete({ _id: id, recipeName });
    setModalDeleteRecipeOpen(true);
  };
  const [openAddEditRecipeModal, setOpenAddEditRecipemodal] = useState(false);
  const [selectedRecipeIdAddEdit, setSelectedRecipeIdAddEdit] = useState(null);

  const theme = useTheme();

  let handleAddEditRecipeModalOpen = (selectedRecipeId) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    setSelectedRecipeIdAddEdit(selectedRecipeId);
    setOpenAddEditRecipemodal(true);
  };
  let modalAddEditRecipe_onClose = () => {
    setSelectedRecipeIdAddEdit(null);
    setOpenAddEditRecipemodal(false);
  };

  let btnRemoveReview_onClick = (reviewid) => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.recipeReviews,
      REQ_METHODS.delete,
      { _id: reviewid },
      (response) => {
        const toastMessageObject: ToastMessage = {
          title: "Reviews",
          message: response.message,
          severity: SEVERITY.Success,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
        reloadRecipes();
      }
    )
      .catch((err) => {
        displayErrorSnackMessage(err, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };
  let handleRemoveRecipeClick = () => {
    if (applicationPage === APPLICATION_PAGE.favourites) {
      dispatch(pageStateActions.setPageLoadingState(true));

      makeRequest(
        API_ROUTES.favourite,
        REQ_METHODS.delete,
        { userId: user.sub, _id: infoRecipeToDelete._id },
        (response) => {
          const toastMessageObject: ToastMessage = {
            title: "Favorites",
            message: response.message,
            severity: SEVERITY.Success,
            open: true,
          };
          dispatch(pageStateActions.setToastMessage(toastMessageObject));
          setInfoRecipeToDelete(null);
          setModalDeleteRecipeOpen(false);
          reloadRecipes();
        }
      )
        .catch((err) => {
          displayErrorSnackMessage(err, dispatch);
        })
        .finally(() => {
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    } else if (applicationPage === APPLICATION_PAGE.myRecipes) {
      dispatch(pageStateActions.setPageLoadingState(true));
      makeRequest(
        API_ROUTES.recipeShare,
        REQ_METHODS.delete,
        { _id: infoRecipeToDelete._id },
        (response) => {
          const toastMessageObject: ToastMessage = {
            title: "Recipes",
            message: response.message,
            severity: SEVERITY.Success,
            open: true,
          };

          dispatch(pageStateActions.setToastMessage(toastMessageObject));
          setInfoRecipeToDelete(null);
          setModalDeleteRecipeOpen(false);
          reloadRecipes();
        }
      )
        .catch((err) => {
          displayErrorSnackMessage(err, dispatch);
        })
        .finally(() => {
          dispatch(pageStateActions.setPageLoadingState(false));
        });
    }
  };


  // Share recipes
  const [modalShareRecipeOpen, setModalShareRecipeOpen] = useState(false);
  const [selectedRecipeToShare, setSelectedRecipeToShare] = useState(null);
  const handleModalShareRecipeOpen = (drink) => {
    setSelectedRecipeToShare(drink);
    setModalShareRecipeOpen(true);
  };



  let handleRecipeVisibility = (drink) => {
    dispatch(pageStateActions.setPageLoadingState(true));
    const newRecipeObject = JSON.parse(JSON.stringify(drink));
    newRecipeObject.visibility =
      newRecipeObject.visibility === "public" ? "private" : "public";
    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.put,
      { recipe: newRecipeObject, userId: user.sub },
      (response) => {
        setModalShareRecipeOpen(false);
        const toastMessageObject: ToastMessage = {
          title: "Visibility updated",
          message: "The recipe visibility has been updated successfully.",
          severity: SEVERITY.Success,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));

        // Reload recipes list
        reloadRecipes();
      }
    )
      .catch((err) => {
        displayErrorSnackMessage(err, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
      });
  };

  let handleAddToFavorite = (recipe) => {
    // Get user
    if (!user) {
      const toastMessageObject: ToastMessage = {
        open: true,
        title: "Please Log In",
        severity: SEVERITY.Warning,
        message: "You must be logged in to use Favourite Features",
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));
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

  return (
    <>
      <AddEditRecipe_Component
        openModal={openAddEditRecipeModal}
        closeModal={modalAddEditRecipe_onClose}
        reloadPage={reloadRecipes}
        recipeId={selectedRecipeIdAddEdit}
        applicationPage={applicationPage}
      />
      {/* Delete Recipe Modal */}
      {isEditablePage && (
        <Dialog
          onClose={() => setModalDeleteRecipeOpen(false)}
          open={modalDeleteRecipeOpen}
        >
          <DialogTitle>{infoRecipeToDelete?.recipeName}</DialogTitle>
          <DialogContent>
            <Typography>
              The recipe will be removed from favourites.
              <br />
              Do you want to continue?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleRemoveRecipeClick()}
              color="error"
              variant="outlined"
              startIcon={<DeleteForeverIcon />}
            >
              Yes, remove
            </Button>
            <Button
              onClick={() => setModalDeleteRecipeOpen(false)}
              color="primary"
              variant="outlined"
              startIcon={<ClearIcon />}
            >
              No, cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Share recipes */}
      {(applicationPage === APPLICATION_PAGE.myRecipes ||
        applicationPage === APPLICATION_PAGE.social) && (
        <SharingDialog
          modalShareRecipeOpen={modalShareRecipeOpen}
          setModalShareRecipeOpen={setModalShareRecipeOpen}
          selectedRecipeToShare={selectedRecipeToShare}
          sharingUrl={sharingUrl}
          setSharingUrl={setSharingUrl}
        />
      )}

      <Table aria-label="collapsible table">
        <TableBody>
          {/* Print recipes on screen */}
          {recipes && recipes.length > 0 ? (
            recipes.map((drink, index) => (
              <RecipeComponentRow
                key={index}
                drink={drink}
                applicationPage={applicationPage}
                reloadRecipes={reloadRecipes}
                handleModalShareRecipeOpen={handleModalShareRecipeOpen}
                modalAddEditRecipe_onOpen={handleAddEditRecipeModalOpen}
                messageBoxDeleteRecipe={handleModalDelteRecipeOpen}
                handleRecipeVisibility={handleRecipeVisibility}
                handleAddToFavorite={handleAddToFavorite}  
              />
            ))
          ) : (
            <TableRow>
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ textAlign: "center", mt: "20px" }}
                >
                  {applicationPage === APPLICATION_PAGE.favourites &&
                    "Currently your favorite list is empty. Start by adding your favorite recipes!"}
                  {applicationPage === APPLICATION_PAGE.myRecipes &&
                    "Currently your recipe list is empty. Start by adding your own recipes!"}
                  {applicationPage === APPLICATION_PAGE.social &&
                    "Currently there are no recipes available. Be the first one to share a recipe!"}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

export default Recipe_Component;
