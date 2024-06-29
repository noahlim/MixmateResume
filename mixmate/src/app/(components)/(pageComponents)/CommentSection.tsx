import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { Typography, Divider } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { Sarabun } from "next/font/google";
const sarabun = Sarabun({ subsets: ["latin"], weight: "400" });

const CommentSection = ({ reviews, handleReviewRemoveClick }) => {
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleReviews = () => {
    if (isExpanded) {
      setVisibleReviews(5);
      setIsExpanded(false);
    } else {
      setVisibleReviews((prevVisible) => prevVisible + 10);
      setIsExpanded(true);
    }
  };

  const { user } = useUser();
  if (reviews.length > 0)
    return (
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
            {`Leave a Review (${reviews.length})`}
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
                          onClick={() => handleReviewRemoveClick(review._id)}
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
  else
    return (
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
            {`Leave a Review (0)`}
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
};

export default CommentSection;
