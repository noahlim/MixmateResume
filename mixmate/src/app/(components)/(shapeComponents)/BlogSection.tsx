import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  boxShadow: theme.shadows[5],
  transition: "box-shadow 0.3s ease, filter 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[8],
  },
}));


const StyledCardContent = styled(CardContent)(({ theme }) => ({
  paddingInlineStart: "1rem",
}));

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState(
    [
      {
        image: "/profilepics/profile1.png",
        title: "1",
        review: "A mind-blowing array of cocktail recipes!",
        author: "John Doe",
      },
      {
        image: "/profilepics/profile2.png",
        title: "2",
        review: "Never thought making cocktails could be so much fun!",
        author: "James K. Polk"
      },
      {
        image: "/profilepics/profile3.png",
        title: "3",
        review: "MixMate has taken cocktail loving to a whole new level!",
        author: "Jane Doe",

      },{
        image: "/profilepics/profile4.png",
        title: "4",
        review: "The best cocktail making app I've ever used!",
        author: "Thomas Jefferson",
      },
      {
        image: "/profilepics/profile5.png",
        title: "5",
        review: "Cocktails have never been this easy to make!",
        author: "Abraham Lincoln"
      },
      {
        image: "/profilepics/profile6.png",
        title: "6",
        review: "Before MixMate, I never knew I could make cocktails this good!",
        author: "Andrew Johnson",

      },
    ].map((post) => ({ ...post, isHovered: false }))
  );

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [noCardHovered, setNoCardHovered] = useState(true);
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    setNoCardHovered(false);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setNoCardHovered(true);
  };

  const [isHovered, setIsHovered] = useState(false);
  return (
    <Container
      maxWidth="lg"
      sx={{ padding: 3, filter: isHovered ? "blur(4px)" : "blur(0px)" }}
    >
      <Box mb={4}></Box>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {blogPosts.map((post, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StyledCard
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              sx={{
                filter:
                  noCardHovered || index === hoveredIndex
                    ? "blur(0px)"
                    : "blur(4px)",
                backgroundColor: "#F5F5F5"
              }}
            >
              <Avatar
                sx={{ width: "25%", height: "10%", margin: "20px" }}
                src={post.image}
                title={post.title}
              />
              <StyledCardContent>
                <Box sx={{margin: "30px 5px"}}>
                  <Typography color="#143463" style={{fontSize:"17px"}}>
                    {post.review}
                  </Typography>
                </Box>
                <Box style={{marginTop: "60px"}}>
                  <Typography color="#1C4683" style={{fontSize:"14px"}}>
                    {post.author}
                  </Typography>
                </Box>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogSection;
