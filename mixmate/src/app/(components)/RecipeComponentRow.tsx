import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
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
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import { Typography, TextField, Divider, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import ClassIcon from "@mui/icons-material/Class";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import Paper from "@mui/material/Paper";
import { useDispatch } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { ToastMessage } from "interface/toastMessage";
import { FaEarthAmericas } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { Sarabun, Vollkorn } from "next/font/google";
import FavoriteIcon from "@mui/icons-material/Favorite";;
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
  const dispatch = useDispatch();

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
      userNickname: user.email_verified ? user.name : user.nickname,
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

  if (isSet(applicationPage === APPLICATION_PAGE.social))
    if (drink?.reviews && drink?.reviews.length > 0) {
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
              {drink?.reviews.map((review, index) => {
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
                      width: { xs: "100%", lg: "70%" },
                    }}
                  >
                    {/* user avatar */}
                    <Box
                      sx={{
                        pr: 1,
                        pt: 1,
                      }}
                    >
                      <Image
                        src={
                          review.userPictureUrl
                            ? review.userPictureUrl
                            : "/not-found-icon.png"
                        }
                        alt={review.userNickname}
                        width={40}
                        height={40}
                        style={{ borderRadius: "50%" }}
                        loading="lazy"
                      />
                    </Box>
                    <Box display="flex" flexDirection="column" flexGrow={1}>
                      <Box display="flex" alignItems="center" marginBottom={-1}>
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
            <Typography className={sarabun.className} sx={{ fontSize: "18px" }}>
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
    <React.Fragment>
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
                <Image
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
                    value={drink?.strCategory}
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
                    value={drink?.strAlcoholic}
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
                    value={drink?.strGlass}
                  />
                </FormControl>
                <br />
                <br />
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
                        onClick={() => modalAddEditRecipe_onOpen(drink?._id)}
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
                          width: { xs: "100%", lg: "70%" },
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
                  <Stack direction={{ xs: "column", lg: "row" }}>
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
