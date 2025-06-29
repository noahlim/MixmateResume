import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography, Divider, TextField, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useDispatch } from "react-redux";
import { pageStateActions } from "lib/redux/pageStateSlice";
import {
  API_ROUTES,
  REQ_METHODS,
  SEVERITY,
} from "@/app/_utilities/_client/constants";
import {
  makeRequest,
  displayErrorSnackMessage,
} from "@/app/_utilities/_client/utilities";
import { ToastMessage } from "interface/toastMessage";
// import Image from "next/image";
import { Sarabun } from "next/font/google";
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });

const CommentSection = ({
  reviews,
  handleReviewRemoveClick,
  textColor = "#fff",
  recipeId,
  reloadRecipes,
}) => {
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [ratingValue, setRatingValue] = useState(1);
  const [reviewValue, setReviewValue] = useState("");

  const dispatch = useDispatch();
  const { user } = useUser();

  const toggleReviews = () => {
    if (isExpanded) {
      setVisibleReviews(5);
      setIsExpanded(false);
    } else {
      setVisibleReviews((prevVisible) => prevVisible + 10);
      setIsExpanded(true);
    }
  };

  const handleSubmitReview = () => {
    if (!reviewValue.trim()) {
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
      recipeId: recipeId,
      comment: reviewValue,
      rating: ratingValue,
    };

    makeRequest(
      API_ROUTES.recipeReviews,
      REQ_METHODS.post,
      { newReview },
      (response) => {
        const toastMessageObject: ToastMessage = {
          title: "Reviews",
          message: "Review submitted successfully!",
          severity: SEVERITY.Success,
          open: true,
        };
        dispatch(pageStateActions.setToastMessage(toastMessageObject));
        setReviewValue("");
        setRatingValue(1);
        if (reloadRecipes) {
          reloadRecipes();
        }
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
      <Grid item xs={12}>
        <Divider
          sx={{ margin: "20px 0px", width: "80%", borderColor: textColor }}
        />
      </Grid>
      <Grid item xs={12}>
        <Typography
          fontWeight="bold"
          sx={{ color: textColor, fontSize: "25px" }}
          className={sarabun.className}
        >
          {`Leave a Review (${reviews.length})`}
        </Typography>
      </Grid>

      {/* Review Form */}
      {user && (
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Paper
            sx={{
              p: 3,
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <img
                src={user.picture || "/not-found-icon.png"}
                alt={user.name}
                width={40}
                height={40}
                style={{ borderRadius: "50%", marginRight: 12 }}
              />
              <Typography
                variant="h6"
                sx={{ color: textColor, fontWeight: 600 }}
              >
                {user.name}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: textColor, mb: 1 }}>
                Rating
              </Typography>
              <Rating
                value={ratingValue}
                onChange={(event, newValue) => setRatingValue(newValue || 1)}
                sx={{ color: "#ffd700" }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Write your review..."
              value={reviewValue}
              onChange={(e) => setReviewValue(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  color: textColor,
                  "& fieldset": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffd700",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffd700",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: textColor,
                  "&.Mui-focused": {
                    color: "#ffd700",
                  },
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleSubmitReview}
              sx={{
                background: "linear-gradient(90deg, #ffd700 60%, #ffe066 100%)",
                color: "#181a2e",
                fontWeight: 700,
                borderRadius: 99,
                px: 3,
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #ffe066 60%, #ffd700 100%)",
                },
              }}
            >
              Submit Review
            </Button>
          </Paper>
        </Grid>
      )}

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
        lg={6}
        item
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Grid item xs={12} sx={{ marginTop: "30px" }}>
          {reviews.slice(0, visibleReviews).map((review, index) => {
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
                  <img
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
                        color: textColor,
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

                    {review.userId === user?.sub && (
                      <IconButton
                        color="error"
                        onClick={() => handleReviewRemoveClick(review._id)}
                        sx={{ marginRight: "10px" }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography
                    variant="caption"
                    color={textColor}
                    marginBottom={1}
                  >
                    {displayDate}
                  </Typography>
                  <Typography
                    className={sarabun.className}
                    color={textColor}
                    sx={{ whiteSpace: "pre-line", fontSize: "16px" }}
                  >
                    {review.comment}
                  </Typography>
                </Box>
              </Box>
            );
          })}
          {reviews.length > 5 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                onClick={toggleReviews}
                sx={{
                  borderRadius: "20px",
                  color: "white",
                  backgroundColor: "#009CC6 !important",
                  "&:hover": {
                    backgroundColor: "#009CC6 !important",
                  },
                  "&:focus": {
                    backgroundColor: "#00A3AD !important",
                  },
                }}
              >
                {isExpanded ? "Collapse" : "Load More"}
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default CommentSection;
