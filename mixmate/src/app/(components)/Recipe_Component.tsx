import React, { useState } from "react";
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
import Avatar from "@mui/material/Avatar";
import { usePathname } from "next/navigation";
import { styled } from '@mui/system';


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
  let modalAddEditRecipe_onOpen = (selectedRecipeId) => {
    setSelectedRecipeIdAddEdit(selectedRecipeId);
    setOpenAddEditRecipemodal(true);
  };
  let modalAddEditRecipe_onClose = () => {
    setSelectedRecipeIdAddEdit(null);
    setOpenAddEditRecipemodal(false);
  };
  let btnRemoveRecipe_onClick = () => {
    // Validate session
    if (!isLoading && !user) return;

    setLoadingPage(true);
    if (title === "My Favourite Recipes")
      makeRequest(
        API_ROUTES.favourite,
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
      let recipeIconItem = (
        <FavoriteIcon
          color={
            applicationPage === APPLICATION_PAGE.favourites
              ? "error"
              : "primary"
          }
          className="margin-left-20px"
        />
      );
      if (applicationPage === APPLICATION_PAGE.social) {
        recipeIconItem = (
          <Tooltip
            //title={"Shared by: " + drink.userNickname}
            title="Test User"
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
      const StyledPaper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
      }));
      if (
        isSet(showReviewsOption) &&
        drink.reviews &&
        drink.reviews.length > 0
      ) {
        reviewComments = (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {drink.reviews.map((review, index) => (
              <StyledPaper key={index}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={review.userPictureUrl}
                    alt={review.userNickname}
                    sx={{ width: 48, height: 48, marginRight: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {review.userNickname}
                    </Typography>
                    <Rating
                      value={review.rating}
                      readOnly
                      size="small"
                      sx={{ marginLeft: 0, marginRight: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {review.comment}
                    </Typography>
                  </Box>
                </Box>
              </StyledPaper>
            ))}
          </Grid>
        );
      }

      return (
        <React.Fragment key={drink.idDrink}>
          <TableRow sx={{ "& > *": { borderTop: 0 } }} key={drink.idDrink}>
            <TableCell colSpan={2}>
              <Box sx={{ margin: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6} lg={4}>
                    <img
                      style={{ width: "90%", borderRadius: "7%" }}
                      src={
                        drink.strDrinkThumb
                          ? drink.strDrinkThumb
                          : "not-found-icon.png"
                      }
                    ></img>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={8}>
                    <div className="text-tangerine text-55px margin-left-35px">
                      {drink.strDrink}
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
                    {showReviewsOption && !showCommentsBox ? (
                      <Tooltip title="Add comment" placement="top">
                        <IconButton
                          color="primary"
                          onClick={() => txtWriteReview_onOpen(drink._id)}
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
                            placeholder={"Review and grade " + drink.strDrink}
                            onChange={(e) => setReviewValue(e.target.value)}
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
