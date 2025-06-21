import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import {
  APPLICATION_PAGE,
  SEVERITY,
  API_ROUTES,
  REQ_METHODS,
} from "@/app/_utilities/_client/constants";
import Button from "@mui/material/Button";
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
  formatDateTime,
} from "@/app/_utilities/_client/utilities";
import Grid from "@mui/material/Grid";
import {
  Typography,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
// import Image from "next/image";
import { ToastMessage } from "interface/toastMessage";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { Sarabun, Vollkorn } from "next/font/google";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentSection from "./CommentSection";
const vollkorn = Vollkorn({ subsets: ["latin"], weight: "variable" });
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });

const RecipeComponentRow = ({
  applicationPage,
  drink,
  messageBoxDeleteRecipe,
  handleModalShareRecipeOpen,
  handleRecipeVisibility,
  handleAddToFavorite,
  modalAddEditRecipe_onOpen,
  reloadRecipes,
}) => {
  const { user, error, isLoading } = useUser();
  const [ratingValue, setRatingValue] = useState(1);
  const [reviewValue, setReviewValue] = useState("");
  const [isReivewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const dispatch = useDispatch();

  let handleReviewRemoveClick = (reviewid) => {
    setSelectedReviewId(reviewid);
    setIsReviewModalOpen(true);
  };
  const removeReview = () => {
    dispatch(pageStateActions.setPageLoadingState(true));

    makeRequest(
      API_ROUTES.recipeReviews,
      REQ_METHODS.delete,
      { _id: selectedReviewId },
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
        setIsReviewModalOpen(false);
      });
  };

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
      recipeId: drink?._id,
      comment: reviewValue,
      rating: ratingValue,
    };

    makeRequest(
      API_ROUTES.recipeReviews,
      REQ_METHODS.post,
      { newReview },
      (response) => {}
    )
      .catch((err) => {
        displayErrorSnackMessage(err, dispatch);
      })
      .finally(() => {
        dispatch(pageStateActions.setPageLoadingState(false));
        setReviewValue("");
        setRatingValue(1);
        reloadRecipes();
      });
  };

  // Format ingredients
  const ingredientsList = drink?.ingredients?.map((ing, index) => (
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
          {drink?.strInstructions}
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
          {isSet(drink?.strAuthor) ? drink?.strAuthor : "www.cocktailDB.com"}
        </Typography>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: "30px" }}>
        <Typography
          fontWeight="bold"
          sx={{ color: "black", fontSize: "20px" }}
          className={sarabun.className}
        >
          Recipe Created At:
        </Typography>
        <Typography className={vollkorn.className} fontSize="18px">
          {formatDateTime(drink?.created_at)}
        </Typography>
      </Grid>
    </Grid>
  );

  // Comments and reviews
  let reviewComments = null;

  if (
    applicationPage === APPLICATION_PAGE.social ||
    applicationPage === APPLICATION_PAGE.myRecipes
  )
    reviewComments = (
      <CommentSection
        reviews={drink?.reviews}
        handleReviewRemoveClick={handleReviewRemoveClick}
      />
    );
  return (
    <React.Fragment>
      <Dialog
        open={isReivewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        aria-labelledby="sign-in-dialog-title"
        aria-describedby="sign-in-dialog-description"
      >
        <DialogTitle id="sign-in-dialog-title" style={{ fontWeight: "bold" }}>
          Deleting the Review
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="sign-in-dialog-description"
            style={{ fontSize: "1.1rem" }}
          >
            Are you sure you want to delete this review?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setIsReviewModalOpen(false);
            }}
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              removeReview();
            }}
            sx={{ color: "#7FE0FA", marginLeft: "20px" }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <TableRow
        sx={{ "& > *": { borderTop: 0 }, paddingTop: "20px" }}
        key={drink?.idDrink}
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
              <Grid item xs={12} lg={6} display="flex" justifyContent="center">
                <img
                  src={
                    drink?.strDrinkThumb
                      ? drink?.strDrinkThumb
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
                  {drink?.strDrink}
                </Typography>

                {/* Category */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "250px",
                    m: "30px 0px",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Category
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "2px solid #e0e0e0",
                      pb: 0.5,
                    }}
                  >
                    <ClassIcon
                      sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                    />
                    <Typography variant="body1">{drink.strCategory}</Typography>
                  </Box>
                </Box>

                {/* Alcoholic type */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "250px",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Alcoholic type
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "2px solid #e0e0e0",
                      pb: 0.5,
                    }}
                  >
                    <LocalBarIcon
                      sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                    />
                    <Typography variant="body1">
                      {drink.strAlcoholic}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "250px",
                    mb: 5,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Glass
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom: "2px solid #e0e0e0",
                      pb: 0.5,
                    }}
                  >
                    <LocalDrinkIcon
                      sx={{ mr: 1, color: "text.secondary", fontSize: 20 }}
                    />
                    <Typography variant="body1">{drink.strGlass}</Typography>
                  </Box>
                </Box>
              </Grid>

              {recipeComplementaryInfo}

              {applicationPage === APPLICATION_PAGE.social && reviewComments}

              <Grid
                xs
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              ></Grid>
              <Grid container justifyContent="end" item xs={12}>
                {(applicationPage === APPLICATION_PAGE.favourites ||
                  applicationPage === APPLICATION_PAGE.myRecipes) && (
                  <Tooltip
                    title={
                      applicationPage === APPLICATION_PAGE.favourites
                        ? "Delete from favourites"
                        : "Delete Current Recipe"
                    }
                    placement="top"
                  >
                    <IconButton
                      color="error"
                      onClick={() =>
                        messageBoxDeleteRecipe(drink?._id, drink?.recipeName)
                      }
                    >
                      <DeleteForeverIcon
                        sx={{ fontSize: { xs: "30px", lg: "40px" } }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
                {(applicationPage === APPLICATION_PAGE.myRecipes ||
                  applicationPage === APPLICATION_PAGE.social) && (
                  <Tooltip title="Share the Recipe" placement="top">
                    <IconButton
                      color="success"
                      onClick={() => handleModalShareRecipeOpen(drink)}
                    >
                      <ShareIcon
                        sx={{ fontSize: { xs: "30px", lg: "40px" } }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
                {applicationPage === APPLICATION_PAGE.myRecipes && (
                  <Tooltip title="Edit the Recipe" placement="top">
                    <IconButton
                      color="primary"
                      onClick={() => modalAddEditRecipe_onOpen(drink?._id)}
                    >
                      <EditIcon sx={{ fontSize: { xs: "30px", lg: "40px" } }} />
                    </IconButton>
                  </Tooltip>
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
                          width: { xs: "100%", lg: "70%" },
                        }}
                      >
                        <TextField
                          label="Write a review"
                          sx={{ margin: "20px" }}
                          multiline
                          value={reviewValue}
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
                  <Stack direction={{ xs: "column", md: "row" }}>
                    {(applicationPage === APPLICATION_PAGE.social ||
                      applicationPage === APPLICATION_PAGE.myRecipes) &&
                      drink?.sub === user.sub && (
                        <Button
                          onClick={() => handleRecipeVisibility(drink)}
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
};

export default RecipeComponentRow;
