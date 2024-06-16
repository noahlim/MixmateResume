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
  capitalizeWords,
  displayErrorSnackMessage,
  isNotSet,
  isSet,
  makeRequest,
} from "@/app/_utilities/_client/utilities";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Typography, CardContent, TextField, Divider, Stack } from "@mui/material";
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
import clipboard from "clipboard-copy";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
import Image from "next/image";
import { ToastMessage } from "interface/toastMessage";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { Sarabun, Vollkorn } from "next/font/google";
import FavoriteIcon from "@mui/icons-material/Favorite";

const vollkorn = Vollkorn({ subsets: ["latin"], weight: "variable" });
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });

function Recipe_Component({ applicationPage, title, recipes, reloadRecipes }) {
  const dispatch = useDispatch();

  const isEditablePage =
    applicationPage === APPLICATION_PAGE.favourites ||
    applicationPage === APPLICATION_PAGE.myRecipes;

  const { user, error, isLoading } = useUser();

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
    dispatch(pageStateActions.setPageLoadingState(true));
    setSelectedRecipeIdAddEdit(selectedRecipeId);
    setSharingUrl(`${MIXMATE_DOMAIN}recipes/${selectedRecipeId}`);
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
    if (title === "My Favourite Recipes") {
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
    } else if (title === "My MixMate Recipes") {
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

  const renderRecipes = () => {
    return recipes?.map((drink) => {
      // Format ingredients
      const ingredientsList = drink.ingredients?.map((ing, index) => (
        <Typography className={vollkorn.className} fontSize="17px" key={index}>
          {capitalizeWords(ing.ingredient)} <i>({ing.measure})</i>
        </Typography>
      ));
      // Ingredients, how to prepare and author info
      let recipeComplementaryInfo = (
        <Grid item container xs={12}>
          <Grid item xs={12} sx={{ marginTop: "40px" }}>
            <Typography
              fontWeight="bold"
              sx={{ color: "black", fontSize: "20px" }}
              className={sarabun.className}
            >
              Ingredients:
            </Typography>
            {ingredientsList}
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "30px" }}>
            <Typography
              fontWeight="bold"
              sx={{ color: "black", fontSize: "20px" }}
              className={sarabun.className}
            >
              Preparing Instructions
            </Typography>
            <Typography className={sarabun.className} fontSize="18px">
              {drink.strInstructions}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "30px" }}>
            <Typography
              fontWeight="bold"
              sx={{ color: "black", fontSize: "20px" }}
              className={sarabun.className}
            >
              Author:
            </Typography>
            <Typography className={vollkorn.className} fontSize="18px">
              {isSet(drink.strAuthor) ? drink.strAuthor : "www.cocktailDB.com"}
            </Typography>
          </Grid>
        </Grid>
      );

      // Comments and reviews
      let reviewComments = null;

      if (isSet(applicationPage === APPLICATION_PAGE.social))
        if (drink.reviews && drink.reviews.length > 0) {
          reviewComments = (
            <>
              <Grid item xs={12}>
                <Typography
                  fontWeight="bold"
                  sx={{ color: "black", fontSize: "25px" }}
                  className={sarabun.className}
                >
                  Leave a Review
                </Typography>
              </Grid>
              <Grid
                xs={12}
                item
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              ></Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Grid item xs={12} sx={{ marginTop: "30px" }}>
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
                        alignItems="right"
                        sx={{
                          marginBottom: 2,
                          width: { xs: "100%", md: "70%" },
                        }}
                      >
                        {/**Delete review button */}

                        <Avatar
                          src={`https://images.weserv.nl/?url=${encodeURIComponent(
                            review.userPictureUrl
                          )}`}
                          alt={review.userNickname}
                          sx={{ width: 40, height: 40, marginRight: 2 }}
                        />
                        <Box display="flex" flexDirection="column" flexGrow={1}>
                          <Box
                            display="flex"
                            alignItems="center"
                            marginBottom={-1}
                          >
                            <Typography
                              className={sarabun.className}
                              sx={{
                                marginRight: 1,
                                fontSize: "18px",
                                marginBottom: "5px",
                              }}
                            >
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
                                onClick={() =>
                                  btnRemoveReview_onClick(review._id)
                                }
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
                            className={sarabun.className}
                            color="text.primary"
                            sx={{ whiteSpace: "pre-line", fontSize: "16px" }}
                          >
                            {review.comment}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Grid>
              </Grid>
            </>
          );
        } else {
          reviewComments = (
            <>
              <Grid item xs={12}>
                <Divider sx={{ margin: "20px 0px", width: "80%" }} />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  fontWeight="bold"
                  sx={{ color: "black", fontSize: "25px" }}
                  className={sarabun.className}
                >
                  Leave a Review
                </Typography>
              </Grid>
              <Grid
                xs={12}
                item
                sx={{ display: "flex", justifyContent: "flex-end" }}
              ></Grid>
              <Grid item xs={12} sx={{ marginTop: "30px" }}>
                <Typography
                  className={sarabun.className}
                  sx={{ fontSize: "18px" }}
                >
                  There are no reviews available for this recipe yet :(
                </Typography>
                <Typography
                  className={sarabun.className}
                  sx={{ fontSize: "18px", marginBottom: "20px" }}
                >
                  Be the first one to review this drink!
                </Typography>
              </Grid>
            </>
          );
        }
      return (
        <React.Fragment key={drink.idDrink}>
          <TableRow
            sx={{ "& > *": { borderTop: 0 }, paddingTop: "20px" }}
            key={drink.idDrink}
          >
            <TableCell colSpan={2}>
              <Paper
                sx={{
                  widhth: "90%",
                  padding: 3,
                  backgroundColor: "white",
                }}
              >
                <Grid container spacing={1}>
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    display="flex"
                    justifyContent="center"
                  >
                    <Image
                      src={
                        drink.strDrinkThumb
                          ? drink.strDrinkThumb
                          : "/not-found-icon.png"
                      }
                      alt="Drink"
                      width={250}
                      height={250}
                      style={{
                        borderRadius: "7%",
                        boxShadow: "5px 5px 5px #AB3900",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={8}>
                    <Typography
                      sx={{
                        fontSize: "30px",
                        textShadow: "3px 3px 3px #F8F8F8",
                      }}
                      className={vollkorn.className}
                    >
                      {drink.strDrink}
                    </Typography>

                    {/* Category */}
                    <FormControl variant="standard">
                      <InputLabel htmlFor="input-with-icon-adornment">
                        Category
                      </InputLabel>
                      <Input
                        className={vollkorn.className}
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
                        className={vollkorn.className}
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
                        className={vollkorn.className}
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

                  {applicationPage === APPLICATION_PAGE.social &&
                    reviewComments}

                  <Grid
                    xs
                    item
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  ></Grid>
                  <Grid container justifyContent="end" item xs={12}>
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
                        <Tooltip title="Share Recipe" placement="top">
                          <IconButton
                            color="success"
                            onClick={() => handleModalShareRecipeOpen(drink)}
                          >
                            <ShareIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit the Recipe" placement="top">
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
                    {applicationPage === APPLICATION_PAGE.social && (
                      <Grid xs={12} item sx={{ marginBottom: "40px" }}>
                        <Box>
                          <Paper
                            sx={{
                              display: "grid",
                              width: isSmallScreen ? "100%" : "70%",
                            }}
                          >
                            <TextField
                              label="Write a review"
                              sx={{ margin: "20px" }}
                              multiline
                              onChange={(event) =>
                                setReviewValue(event.target.value)
                              }
                            />
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
                                onClick={() => btnWriteReview_onCkick(drink)}
                              >
                                Add Review
                              </Button>
                            </Box>
                          </Paper>
                        </Box>
                      </Grid>
                    )}
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignContent: "center",
                      }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }}>
                        {(applicationPage === APPLICATION_PAGE.social ||
                          applicationPage === APPLICATION_PAGE.myRecipes) &&
                          drink.sub === user.sub && (
                            <Button
                              onClick={() => handleSetRecipeVisibility(drink)}
                              variant="contained"
                              startIcon={
                                drink?.visibility === "private" ? (
                                  <FaEarthAmericas fontSize={16} />
                                ) : (
                                  <FaEye fontSize={16} />
                                )
                              }
                              sx={{
                                backgroundColor: "#00B6E7 !important",
                                "&:hover": {
                                  backgroundColor: "#009CC6 !important",
                                },
                                "&:focus": {
                                  backgroundColor: "#00A3AD !important",
                                },
                              }}
                            >
                              {drink?.visibility === "private"
                                ? "Share On Community"
                                : "Set as Private"}
                            </Button>
                          )}

                        {applicationPage !== APPLICATION_PAGE.favourites && (
                          <Button
                            onClick={() => handleAddToFavorite(drink)}
                            variant="contained"
                            startIcon={<FavoriteIcon />}
                            sx={{
                              backgroundColor: "#FFA1A1 !important",
                              "&:hover": {
                                backgroundColor: "#FF5F5F !important",
                              },
                              "&:focus": {
                                backgroundColor: "#E91A1A !important",
                              },

                              ml: { xs: 0, md: 2 },
                              mt: { xs: 2, md: 0 },
                            }}
                          >
                            Add To My Favorites
                          </Button>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
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
  const handleModalShareRecipeOpen = (drink) => {
    setSelectedRecipeToShare(drink);
    setModalShareRecipeOpen(true);
  };

  let copySharedToClipboard = () => {
    const shareUrl = `${MIXMATE_DOMAIN}recipes/${selectedRecipeToShare._id}`;
    clipboard(shareUrl);
    setSharingUrl(shareUrl);
    const toastMessageObject: ToastMessage = {
      title: "Social",
      message: "Link copied to clipboard!",
      severity: SEVERITY.Success,
      open: true,
    };
    dispatch(pageStateActions.setToastMessage(toastMessageObject));
  };

  let handleSetRecipeVisibility = (drink) => {
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
  // Write reviews

  const [ratingValue, setRatingValue] = useState(1);
  const [reviewValue, setReviewValue] = useState("");

  let btnWriteReview_onCkick = (drink) => {
    // Validations
    if (isNotSet(reviewValue)) {
      const toastMessageObject: ToastMessage = {
        title: "Reviews",
        message: "Please fill in the comment field.",
        severity: SEVERITY.Warning,
        open: true,
      };
      dispatch(pageStateActions.setToastMessage(toastMessageObject));

      return;
    }

    dispatch(pageStateActions.setPageLoadingState(true));
    let newReview = {
      userId: user.sub,
      userNickname: user.nickname,
      recipeId: drink._id,
      comment: reviewValue,
      rating: ratingValue,
    };

    makeRequest(
      API_ROUTES.recipeReviews,
      REQ_METHODS.post,
      { newReview },
      (response) => {
        setRatingValue(1);
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

  return (
    <>
      <AddEditRecipe_Component
        openModal={openAddEditRecipeModal}
        closeModal={modalAddEditRecipe_onClose}
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
      {applicationPage === APPLICATION_PAGE.myRecipes ||
        (applicationPage === APPLICATION_PAGE.social && (
          <Dialog
            onClose={() => setModalShareRecipeOpen(false)}
            open={modalShareRecipeOpen}
          >
            <DialogTitle>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                Share
                <IconButton
                  aria-label="Close"
                  onClick={() => setModalShareRecipeOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <Box>
              <DialogActions>
                <Grid
                  container
                  justifyContent="center"
                  spacing={3}
                  sx={{ padding: "0px 20px" }}
                >
                  <Grid
                    item
                    xs={3}
                    sx={{ display: "flex" }}
                    justifyContent="center"
                    alignContent="center"
                  >
                    <WhatsappShareButton
                      url={sharingUrl}
                      title={`MixMate - Check our ${selectedRecipeToShare?.strDrink}!`}
                      className="Demo__some-network__share-button"
                    >
                      <WhatsappIcon size={60} round />
                    </WhatsappShareButton>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{ display: "flex" }}
                    justifyContent="center"
                    alignContent="center"
                  >
                    <TwitterShareButton
                      url={sharingUrl}
                      title={`MixMate - Check our ${selectedRecipeToShare?.strDrink}!`}
                      className="Demo__some-network__share-button"
                    >
                      <XIcon size={60} round />
                    </TwitterShareButton>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{ display: "flex" }}
                    justifyContent="center"
                    alignContent="center"
                  >
                    <FacebookShareButton
                      url={sharingUrl}
                      className="Demo__some-network__share-button"
                    >
                      <FacebookIcon size={60} round />
                    </FacebookShareButton>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sx={{ display: "flex" }}
                    justifyContent="center"
                    alignContent="center"
                  >
                    <EmailShareButton
                      url={sharingUrl}
                      subject={`MixMate - Check our ${selectedRecipeToShare?.strDrink}!`}
                      body={`MixMate - Check our ${selectedRecipeToShare?.strDrink}!`}
                      className="Demo__some-network__share-button"
                    >
                      <EmailIcon size={60} round />
                    </EmailShareButton>
                  </Grid>
                </Grid>

                {/*Error "Parameter 'href' should represent a valid URL" will be thrown when ran on localhost. will work well when deployed */}
              </DialogActions>
              <DialogContent>
                <Divider sx={{ width: "100%" }} />
              </DialogContent>{" "}
              <DialogActions>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      id="outlined-read-only-input"
                      defaultValue={`${MIXMATE_DOMAIN}recipes/${selectedRecipeToShare?._id}`}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Copy to clipboard" placement="top">
                              <IconButton
                                color="primary"
                                onClick={copySharedToClipboard}
                              >
                                <ContentCopyIcon />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ width: "100%" }}
                    />
                  </Grid>
                </Grid>
              </DialogActions>
            </Box>
          </Dialog>
        ))}

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
              <TableCell>
                <Typography
                  variant="h6"
                  sx={{ textAlign: "center", mt: "20px" }}
                >
                  No recipes found.
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
