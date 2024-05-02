import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import moment from "moment";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
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
  isNotSet,
  isSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Typography, CardContent, TextField } from "@mui/material";
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
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import AddEditRecipe_Component from "./AddEditRecipe_Component";
import {
  FacebookIcon,
  FacebookShareButton,
  FacebookShareCount,
  TwitterShareButton,
  XIcon,
} from "react-share";
function Recipe_Component(props) {
  // Inherited variables
  const {
    applicationPage,
    title,
    recipes,
    setLoadingPage,
    showToastMessage,
    reloadRecipes,
  } = props;

  const isEditablePage =
    applicationPage === APPLICATION_PAGE.favourites ||
    applicationPage === APPLICATION_PAGE.myRecipes;

  const { user, error, isLoading } = useUser();

  const [showReviewsOption] = useState(
    applicationPage === APPLICATION_PAGE.social
  );
  const [sharingUrl, setSharingUrl] = useState("");
  // Delete recipes
  const [modalDeleteRecipeOpen, setModalDeleteRecipeOpen] = useState(false);
  const [infoRecipeToDelete, setInfoRecipeToDelete] = useState(null);
  let messageBoxDeleteRecipe = (id, recipeName) => {
    setInfoRecipeToDelete({ _id: id, recipeName });
    setModalDeleteRecipeOpen(true);
  };
  const [openAddEditRecipeModal, setOpenAddEditRecipemodal] = useState(false);
  const [selectedRecipeIdAddEdit, setSelectedRecipeIdAddEdit] = useState(null);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  let modalAddEditRecipe_onOpen = (selectedRecipeId) => {
    setSelectedRecipeIdAddEdit(selectedRecipeId);
    setOpenAddEditRecipemodal(true);
  };
  let modalAddEditRecipe_onClose = () => {
    setSelectedRecipeIdAddEdit(null);
    setOpenAddEditRecipemodal(false);
  };

  let btnRemoveReview_onClick = (reviewid) => {
    // Validate session
    if (!isLoading && !user) return;
    makeRequest(
      API_ROUTES.recipeReviews,
      REQ_METHODS.delete,
      { _id: reviewid },
      (response) => {
        showToastMessage("Reviews", response.message, SEVERITY.Success);
        reloadRecipes();
      },
      (err) => {
        showToastMessage(
          "Error",
          "Error deleting selected review",
          SEVERITY.Error
        );
      }
    );
  };
  let btnRemoveRecipe_onClick = () => {
    // Validate session
    if (!isLoading && !user) return;

    setLoadingPage(true);
    if (title === "My Favourite Recipes")
      makeRequest(
        API_ROUTES.favourite,
        REQ_METHODS.delete,
        { userId:user.sub, _id: infoRecipeToDelete._id },
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
    else if (title === "My MixMate Recipes") {
      makeRequest(
        API_ROUTES.recipeShare,
        REQ_METHODS.delete,
        { _id: infoRecipeToDelete._id },
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
    }
  };

  const renderRecipes = () => {
    return recipes?.map((drink) => {
      // Format ingredients
      const ingredientsList = drink.ingredients?.map((ing, index) => (
        <Typography className="margin-left-35px" key={index}>
          {ing.ingredient} <i>({ing.measure})</i>
        </Typography>
      ));
      //console.log(ingredientsList);
      // Title icon
      let recipeIconItem = null;
      if (applicationPage === APPLICATION_PAGE.favourites) {
        recipeIconItem = (
          <FavoriteIcon
            color={
              applicationPage === APPLICATION_PAGE.favourites
                ? "error"
                : "primary"
            }
            className="margin-left-20px"
          />
        );
      }

      // Ingredients, how to prepare and author info
      let recipeComplementaryInfo = (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <InputLabel>Ingredients:</InputLabel>
          {ingredientsList}
          <br></br>
          <InputLabel>How to prepare:</InputLabel>
          <Typography className="margin-left-35px">
            {drink.strInstructions}
          </Typography>
          <br></br>
          <InputLabel>Author:</InputLabel>
          <Typography className="margin-left-35px margin-bottom-15px">
            {isSet(drink.strAuthor) ? drink.strAuthor : "www.cocktailDB.com"}
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
            {drink.reviews.map((review, index) => {
              const createdAt = moment(review.created_at);
              const now = moment();
              const daysDiff = now.diff(createdAt, "days");
              const hoursDiff = now.diff(createdAt, "hours");
              const minutesDiff = now.diff(createdAt, "minutes");

              let displayDate;
              if (daysDiff < 1) {
                if (hoursDiff < 1) {
                  displayDate = `${minutesDiff} minutes ago`;
                } else {
                  displayDate = `${hoursDiff} hours ago`;
                }
              } else if (daysDiff < 30) {
                displayDate = `${daysDiff} days ago`;
              } else {
                displayDate = createdAt.format("YYYY-MM-DD");
              }

              return (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  sx={{
                    marginBottom: 2,
                    width: isSmallScreen ? "100%" : "70%",
                  }}
                >
                  {/**Delete review button */}

                  <Avatar
                    src={review.userPictureUrl}
                    alt={review.userNickname}
                    sx={{ width: 40, height: 40, marginRight: 2 }}
                  />
                  <Box display="flex" flexDirection="column" flexGrow={1}>
                    <Box display="flex" alignItems="center" marginBottom={-1}>
                      <Typography variant="subtitle1" sx={{ marginRight: 1 }}>
                        {review.userNickname}
                      </Typography>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{ marginRight: 1 }}
                      />

                      {review.userId === user.sub && (
                        <IconButton
                          color="error"
                          onClick={() => btnRemoveReview_onClick(review._id)}
                          sx={{ marginRight: "10px" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      marginBottom={1}
                    >
                      {displayDate}
                    </Typography>
                    <Typography
                      variant="h6"
                      color="text.primary"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {review.comment}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Grid>
        );
      }

      return (
        <React.Fragment key={drink.idDrink}>
          <TableRow sx={{ "& > *": { borderTop: 0 } }} key={drink.idDrink}>
            <TableCell colSpan={2}>
              <Box>
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <img
                      style={{ width: "100%", borderRadius: "7%" }}
                      src={
                        drink.strDrinkThumb
                          ? drink.strDrinkThumb
                          : "not-found-icon.png"
                      }
                    ></img>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={8}>
                    <Typography>
                      {drink.strDrink}
                      {recipeIconItem}
                    </Typography>

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
                    {isEditablePage && (
                      <Tooltip title="Delete from favourites" placement="top">
                        <IconButton
                          color="error"
                          onClick={() =>
                            messageBoxDeleteRecipe(drink._id, drink.recipeName)
                          }
                        >
                          <DeleteForeverIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {applicationPage === APPLICATION_PAGE.myRecipes && (
                      <>
                        <Tooltip title="Share recipe" placement="top">
                          <IconButton
                            color="success"
                            onClick={() => modalShareRecipe_onOpen(drink)}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Create a new recipe" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => modalAddEditRecipe_onOpen(drink._id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Grid>
                  {/**Comments input section */}
                  <Grid container justifyContent="flex-start" item>
                    {showReviewsOption && (
                      <>
                        {!showCommentsBox ? (
                          <Tooltip title="Add a Review" placement="top">
                            <IconButton
                              color="primary"
                              onClick={() => txtWriteReview_onOpen(drink._id)}
                            >
                              <MapsUgcIcon />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        {showCommentsBox &&
                          selectedRecipeToComment?._id === drink._id && (
                            <Paper
                              sx={{
                                display: "grid",
                                width: isSmallScreen ? "100%" : "70%",
                              }}
                            >
                              <Box
                                sx={{
                                  alignSelf: "flex-start",
                                }}
                              >
                                <Tooltip title="Close" placement="top">
                                  <IconButton
                                    color="error"
                                    onClick={() => txtWriteReview_onClose()}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              <TextField
                                label="Write a review"
                                sx={{ margin: "0 20px 20px 20px" }}
                                multiline
                                onChange={(event) =>
                                  setReviewValue(event.target.value)
                                }
                              ></TextField>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "flex-end",
                                  gap: "10px",
                                  marginRight: "20px",
                                  marginBottom: "20px",
                                }}
                              >
                                <Rating
                                  value={ratingValue}
                                  onChange={(event, newValue) =>
                                    setRatingValue(newValue)
                                  }
                                />
                                <Button
                                  type="button"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => btnWriteReview_onCkick()}
                                >
                                  Add Review
                                </Button>
                              </Box>
                            </Paper>
                          )}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    });
  };
  // Add edit recipes

  // Share recipes
  const [modalShareRecipeOpen, setModalShareRecipeOpen] = useState(false);
  const [selectedRecipeToShare, setSelectedRecipeToShare] = useState(null);
  let modalShareRecipe_onOpen = (drink) => {
    setSelectedRecipeToShare(drink);
    setModalShareRecipeOpen(true);
  };
  let copySharedToClipboard = () => {
    const shareUrl = `${MIXMATE_DOMAIN}${APPLICATION_PAGE.recipes}/${selectedRecipeToShare._id}`;
    clipboard(shareUrl);
    setSharingUrl(shareUrl);
    showToastMessage("Social", "Link copied to clipboard!", SEVERITY.Success);
  };
  let btnShareInSocial_onclick = () => {
    const newRecipeObject = JSON.parse(JSON.stringify(selectedRecipeToShare));
    newRecipeObject.visibility = "public";
    makeRequest(
      API_ROUTES.recipeShare,
      REQ_METHODS.put,
      { recipe: newRecipeObject },
      (response) => {
        if (response.isOk) {
          setModalShareRecipeOpen(false);
          showToastMessage(
            "Recipe Shared on the Social",
            "Your drink has been shared on the Social!",
            SEVERITY.Success
          );

          // Reload recipes list
          reloadRecipes();
        } else showToastMessage("New Recipe", response.message, SEVERITY.Error);

        setLoadingPage(false);
      }
    );
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
        "Please fill in the comment field.",
        SEVERITY.Warning
      );
      return;
    }

    let newReview = {
      userId: user.sub,
      userNickname: user.nickname,
      recipeId: selectedRecipeToComment._id,
      comment: reviewValue,
      rating: ratingValue,
    };

    makeRequest(
      API_ROUTES.recipeReviews,
      REQ_METHODS.post,
      { newReview },
      (response) => {
        if (response.isOk) {
          setSelectedRecipeToComment(null);
          setRatingValue(1);
          setShowCommentsBox(false);

          // Reload recipes list
          reloadRecipes();
        } else showToastMessage("New Recipe", response.message, SEVERITY.Error);

        setLoadingPage(false);
      }
    );
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
      <AddEditRecipe_Component
        openModal={openAddEditRecipeModal}
        closeModal={modalAddEditRecipe_onClose}
        showToastMessage={showToastMessage}
        setLoadingPage={setLoadingPage}
        reloadPage={reloadRecipes}
        recipeId={selectedRecipeIdAddEdit}
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
              onClick={() => btnRemoveRecipe_onClick()}
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
      {applicationPage === APPLICATION_PAGE.myRecipes && (
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
            <div className="Demo__some-network">
              <TwitterShareButton
                url={sharingUrl}
                title={`MixMate - ${selectedRecipeToShare?.recipeName}`}
                className="Demo__some-network__share-button"
              >
                <XIcon size={32} round />
              </TwitterShareButton>
            </div>
            {/*Error "Parameter 'href' should represent a valid URL" will be thrown when ran on localhost. will work well when deployed */}
            <div className="Demo__some-network">
              <FacebookShareButton
                url={sharingUrl}
                className="Demo__some-network__share-button"
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>

              <div>
                <FacebookShareCount
                  url={sharingUrl}
                  className="Demo__some-network__share-count"
                >
                  {(count) => count}
                </FacebookShareCount>
              </div>
            </div>
          </DialogActions>

          <DialogActions>
            <Button
              onClick={() => btnShareInSocial_onclick()}
              color="success"
              variant="outlined"
              startIcon={<ShareIcon />}
            >
              Share on Social
            </Button>
            <Button
              onClick={() => setModalShareRecipeOpen(false)}
              color="error"
              variant="outlined"
              startIcon={<ClearIcon />}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <div style={{ paddingLeft: 25, paddingRight: 55 }}>
        <Table aria-label="collapsible table">
          {isEditablePage && (
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
            {recipes && recipes.length > 0 ? (
              renderRecipes()
            ) : (
              <TableRow>
                <Typography
                  variant="h6"
                  style={{ textAlign: "center", marginTop: "20px" }}
                >
                  No recipes found.
                </Typography>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default Recipe_Component;
