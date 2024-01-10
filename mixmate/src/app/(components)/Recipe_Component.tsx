import React, { useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  APPLICATION_PAGE,
  MIXMATE_DOMAIN,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import { useUser } from "@auth0/nextjs-auth0/client";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Tooltip from "@mui/material/Tooltip";
import ShareIcon from "@mui/icons-material/Share";
import {
  doPost,
  isNotSet,
  isSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Typography, CardContent } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import FavoriteIcon from "@mui/icons-material/Favorite";
import clipboard from "clipboard-copy";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import { usePathname } from "next/navigation";

function Recipe_Component(props) {
  // Inherited variables
  const {
    title,
    recipes,
    setLoadingPage,
    showToastMessage,
    reloadRecipes,
    recipeCategories,
    recipeAlcoholicTypes,
    recipeGlasses,
  } = props;

  const pathName = usePathname();
  const isFavouritePage =
    pathName === APPLICATION_PAGE.favourites ||
    pathName === APPLICATION_PAGE.myRecipes;
  const { user, error, isLoading } = useUser();

  // Variables to display elements on screen
  const [showDeleteRecipes] = useState(isFavouritePage);
  const [showAddEditRecipes] = useState(isFavouritePage);
  const [showTableHeaders] = useState(isFavouritePage);
  const [showShareOption] = useState(isFavouritePage);
  const [showReviewsOption] = useState(pathName === APPLICATION_PAGE.social);

  // Delete recipes
  const [modalDeleteRecipeOpen, setModalDeleteRecipeOpen] = useState(false);
  const [infoRecipeToDelete, setInfoRecipeToDelete] = useState(null);
  let messageBoxDeleteRecipe = (id, recipeName) => {
    setInfoRecipeToDelete({ id, recipeName });
    setModalDeleteRecipeOpen(true);
  };
  let btnRemoveRecipe_onClick = () => {
    // Validate session
    if (!isLoading && !user) return;

    setLoadingPage(true);
    makeRequest(
      API_ROUTES.favourite,
      REQ_METHODS.delete,
      infoRecipeToDelete.id,
      (response) => {
        showToastMessage("Favorites", response.message, SEVERITY.Success);
        setInfoRecipeToDelete(null);
        setModalDeleteRecipeOpen(false);
        reloadRecipes();
      },
      (err) => {
        showToastMessage(
          "Error",
          "Error deleting recipe from favourites",
          SEVERITY.Error
        );
      }
    );
  };

  // Add edit recipes
  const [openAddEditRecipeModal, setOpenAddEditRecipemodal] = useState(false);
  const [selectedRecipeIdAddEdit, setSelectedRecipeIdAddEdit] = useState(null);
  let modalAddEditRecipe_onOpen = (selectedRecipeId) => {
    setSelectedRecipeIdAddEdit(selectedRecipeId);
    setOpenAddEditRecipemodal(true);
  };
  let modalAddEditRecipe_onClose = () => {
    setSelectedRecipeIdAddEdit(null);
    setOpenAddEditRecipemodal(false);
  };

  // Share recipes
  const [modalShareRecipeOpen, setModalShareRecipeOpen] = useState(false);
  const [selectedRecipeToShare, setSelectedRecipeToShare] = useState(null);
  let modalShareRecipe_onOpen = (id, recipeName) => {
    let publicUrl = MIXMATE_DOMAIN + "...";
    setSelectedRecipeToShare({ id, recipeName, url: publicUrl });
    setModalShareRecipeOpen(true);
  };
  let copySharedToClipboard = () => {
    let urlParams = user.email.split("@")[0]+ "|" + selectedRecipeToShare.id;
    urlParams = "?s=" + window.btoa(urlParams);
    clipboard(MIXMATE_DOMAIN + APPLICATION_PAGE.sharedPublic + urlParams);
    showToastMessage("Social", "Link copied to clipboard!", SEVERITY.Success);
  };
  let btnShareInSocial_onclick = () => {
    // let userSession = user.sub;
    // doPost(
    //   API.Social.shareUserRecipe,
    //   { userSession: userSession, _id: selectedRecipeToShare?.id },
    //   (response) => {
    //     if (response.isOk) {
    //       showToastMessage(
    //         "Social",
    //         "Recipe shared in social!",
    //         SEVERITY.Success
    //       );
    //       setSelectedRecipeToShare(null);
    //       setModalShareRecipeOpen(false);
    //     } else showToastMessage("Social", response.message, SEVERITY.Error);
    //   }
    // );
    console.log("sharing button");
  };

  // Write reviews
  const [showCommentsBox, setShowCommentsBox] = useState(false);
  const [selectedRecipeToComment, setSelectedRecipeToComment] = useState(null);
  const [ratingValue, setRatingValue] = useState(1);
  const [reviewValue, setReviewValue] = useState("");
  let txtWriteReview_onOpen = (id) => {
    setSelectedRecipeToComment({ _id: id });
    setRatingValue(1);
    setShowCommentsBox(true);
  };
  let txtWriteReview_onClose = () => {
    setSelectedRecipeToComment(null);
    setRatingValue(1);
    setShowCommentsBox(false);
  };
  let btnWriteReview_onCkick = () => {
    // Validations
    if (isNotSet(reviewValue)) {
      showToastMessage(
        "Reviews",
        "Write your review for the recipe",
        SEVERITY.Warning
      );
      return;
    }

    setLoadingPage(true);
    let newReview = {
      userId: user.sub,
      userNickname: user.nickname,
      _id: selectedRecipeToComment._id,
      comment: reviewValue,
      rating: ratingValue,
    };
    console.log(newReview);
    // doPost(API.Social.writeReview, newReview, (response) => {
    //   if (response.isOk) {
    //     reloadRecipes();
    //     txtWriteReview_onClose();
    //     showToastMessage("Reviews", "New review added!", SEVERITY.Success);
    //   } else showToastMessage("Reviews", response.message, SEVERITY.Error);

    //   setLoadingPage(false);
    // });
  };

  return (
    <>
      {/* Delete Recipe Modal */}
      {showDeleteRecipes && (
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
              onClick={() => btnRemoveRecipe_onClick()}
              color="error"
              variant="contained"
              startIcon={<DeleteForeverIcon />}
            >
              Yes, remove
            </Button>
            <Button
              onClick={() => setModalDeleteRecipeOpen(false)}
              color="primary"
              variant="contained"
              startIcon={<ClearIcon />}
            >
              No, cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}


      {/* Share recipes */}
      {showShareOption && (
        <Dialog
          onClose={() => setModalShareRecipeOpen(false)}
          open={modalShareRecipeOpen}
        >
          <DialogTitle>{selectedRecipeToShare?.recipeName}</DialogTitle>
          <DialogContent>
            <Typography>Share on your social media:</Typography>
            <Typography>
              {selectedRecipeToShare?.url}
              <Tooltip title="Copy to clipboard" placement="top">
                <IconButton
                  color="primary"
                  onClick={() => copySharedToClipboard()}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => btnShareInSocial_onclick()}
              color="success"
              variant="contained"
              startIcon={<ShareIcon />}
            >
              Share in social
            </Button>
            <Button
              onClick={() => setModalShareRecipeOpen(false)}
              color="error"
              variant="contained"
              startIcon={<ClearIcon />}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <div style={{ paddingLeft: 25, paddingRight: 55 }}>
        <Table aria-label="collapsible table">
          {showTableHeaders && (
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
                    <Typography variant="h6">{title}</Typography>
                  </CardContent>
                </TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {/* Print recipes on screen */}
            {recipes?.map((drink) => {
              // Format ingredients
              let ingredients = [];
              for (let x = 0; x <= 99; x++) {
                if (isSet(drink.recipeIngredients[x]))
                  ingredients.push(
                    <Typography className="margin-left-35px">
                      {drink.recipeIngredients[x]}{" "}
                      <i>({drink.recipeMeasure[x]})</i>
                    </Typography>
                  );
                else break;
              }

              // Title icon
              let recipeIconItem = (
                <FavoriteIcon
                  color={
                    pathName === APPLICATION_PAGE.favourites
                      ? "error"
                      : "primary"
                  }
                  className="margin-left-20px"
                />
              );
              if (pathName === APPLICATION_PAGE.social) {
                recipeIconItem = (
                  <Tooltip
                    title={"Shared by: " + drink.userNickname}
                    placement="top"
                  >
                    <InfoIcon color={"success"} className="margin-left-20px" />
                  </Tooltip>
                );
              }

              // Ingredients, how to prepare and author info
              let recipeComplementaryInfo = (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <InputLabel>Ingredients:</InputLabel>
                  {ingredients}
                  <br></br>
                  <InputLabel>How to prepare:</InputLabel>
                  <Typography className="margin-left-35px">
                    {drink.recipeInstructions}
                  </Typography>
                  <br></br>
                  <InputLabel>Author:</InputLabel>
                  <Typography className="margin-left-35px margin-bottom-15px">
                    {drink.recipeAuthor}
                  </Typography>
                </Grid>
              );

              // Comments and reviews
              let reviewComments = null;

              if (
                isSet(showReviewsOption) &&
                drink.reviews &&
                drink.reviews.length > 0
              ) {
                reviewComments = (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {drink.reviews.map((x, index) => (
                      <React.Fragment key={index}>
                        <br></br>
                        <InputLabel>{x.nickname}:</InputLabel>
                        <Rating
                          className="margin-left-35px"
                          value={x.rating}
                          readOnly
                          size="small"
                        />
                        <Typography className="margin-left-35px">
                          {x.comment}
                        </Typography>
                      </React.Fragment>
                    ))}
                  </Grid>
                );
              }

              return (
                <React.Fragment>
                  <TableRow sx={{ "& > *": { borderTop: 0 } }}>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={2}
                    >
                      <Box sx={{ margin: 3 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12} md={6} lg={4}>
                            <img
                              style={{ width: "90%", borderRadius: "7%" }}
                              src={drink.recipePicture}
                            ></img>
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={8}>
                            <div className="text-tangerine text-55px margin-left-35px">
                              {drink.recipeName}
                              {recipeIconItem}
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
                                value={drink.recipeCategory}
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
                                value={drink.recipeAlcoholicType}
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
                                value={drink.recipeGlass}
                              />
                            </FormControl>
                            <br />
                            <br />
                          </Grid>

                          {recipeComplementaryInfo}
                          {showReviewsOption && reviewComments}

                          <Grid
                            container
                            justifyContent="end"
                            item
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                          >
                            {showDeleteRecipes && (
                              <Tooltip
                                title="Delete from favourites"
                                placement="top"
                              >
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    messageBoxDeleteRecipe(
                                      drink._id,
                                      drink.recipeName
                                    )
                                  }
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {showShareOption && (
                              <Tooltip title="Share recipe" placement="top">
                                <IconButton
                                  color="success"
                                  onClick={() =>
                                    modalShareRecipe_onOpen(
                                      drink._id,
                                      drink.recipeName
                                    )
                                  }
                                >
                                  <ShareIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {showAddEditRecipes && (
                              <Tooltip
                                title="Create a new recipe"
                                placement="top"
                              >
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    modalAddEditRecipe_onOpen(drink.recipeId)
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            {showReviewsOption &&
                            selectedRecipeToComment?._id !== drink._id ? (
                              <Tooltip title="Add comment" placement="top">
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    txtWriteReview_onOpen(drink._id)
                                  }
                                >
                                  <MapsUgcIcon />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                            {showReviewsOption &&
                              showCommentsBox &&
                              selectedRecipeToComment?._id === drink._id && (
                                <Paper
                                  component="form"
                                  sx={{
                                    p: "2px 4px",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "80%",
                                  }}
                                >
                                  <IconButton
                                    color="primary"
                                    onClick={() => txtWriteReview_onClose()}
                                  >
                                    <MapsUgcIcon />
                                  </IconButton>
                                  <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder={
                                      "Review and grade " +
                                      drink.userNickname +
                                      "'s recipe"
                                    }
                                    onChange={(e) =>
                                      setReviewValue(e.target.value)
                                    }
                                  />
                                  <Rating
                                    value={ratingValue}
                                    onChange={(event, newValue) =>
                                      setRatingValue(newValue)
                                    }
                                  />
                                  <Divider
                                    sx={{ height: 28, m: 0.5 }}
                                    orientation="vertical"
                                  />
                                  <IconButton
                                    type="button"
                                    color="error"
                                    onClick={() => txtWriteReview_onClose()}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                  <IconButton
                                    type="button"
                                    color="success"
                                    onClick={() => btnWriteReview_onCkick()}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </Paper>
                              )}
                          </Grid>
                        </Grid>
                      </Box>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default Recipe_Component;
