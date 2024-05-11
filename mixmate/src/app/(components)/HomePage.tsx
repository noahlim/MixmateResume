"use client"
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import "@fontsource/dela-gothic-one";
import router from "next/router";
import { API_ROUTES, APPLICATION_PAGE } from "../_utilities/_client/constants";
import page from "../page";
import { useMediaQuery } from "@mui/material";
function HomePage() {
  const matches = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));
  console.log(matches);
  return (
    <>
      <Grid container direction="column" justifyContent="center">
        <Grid
          container
          item
          direction="column"
          justifyContent="center"
          alignItems="center"
          style={{
            backgroundImage: "url(/background3.jpg)",
          }}
        >
          <img
            src="/mixmatelogo.png"
            alt="MixMate Logo"
            loading="lazy"
            style={{
              width: matches ? "40%" : "80%",
            }}
          />
          <Box
            display={matches ? "inline-flex" : "flow"}
            justifyContent="center"
            alignItems="center"
            sx={{ padding: 4 }}
          >
            <Box
              component={Button}
              sx={{
                width: "300px",
                borderRadius: "50vh",
                backgroundColor: "white",
                color: "black",
                fontFamily: "Dela Gothic one",
                fontSize: "15px",
                marginBottom: matches ? "0px" : "20px",
                marginRight: matches ? "10px" : "0px",
                transition: matches ? "none" : "transform 0.3s",
                ":hover": {
                  transform: matches ? "none" : "translateX(-20px)",
                },
              }}
              onClick={() => router.push(API_ROUTES.login)}
            >
              Get Your Mix
            </Box>
            <Box
              component={Button}
              sx={{
                width: "300px",
                borderRadius: "50vh",
                backgroundColor: "white",
                color: "black",
                fontFamily: "Dela Gothic one",
                fontSize: "15px",
                marginBottom: matches ? "0px" : "20px",
                marginRight: matches ? "10px" : "0px",
                transition: matches ? "none" : "transform 0.3s",
                ":hover": {
                  transform: matches ? "none" : "translateX(20px)",
                },
              }}
              onClick={() => router.push(API_ROUTES.login)}
            >
              Get Your Mix
            </Box>
          </Box>

          {/* <Typography
            variant="h3"
            align="right"
            style={{
              fontFamily: "Dela Gothic One",
              width: "100%",
              maxWidth: "400px",
              padding: "20px",
            }}
          >
            MixMate-Serving You the Perfect Drink!
          </Typography> */}
        </Grid>
        <Box bgcolor="#F3E3FF">2</Box>
        <Box bgcolor="#5FA8D3">3</Box>
      </Grid>
    </>

    // <div style={{ backgroundColor: "#CAE9FF", height: "300vh" }}>
    //   <Grid container spacing={2}>
    //     <Grid item xs={12}>
    //       <div style={{ height: "10vh" }}></div>
    //     </Grid>
    //     <Grid item xs={2}></Grid>
    //     <Grid item justifyContent="flex-end" xs={5}>
    //       <img
    //         src="/balls.png"
    //         style={{
    //           width: "50%", // Adjust the width as needed
    //           borderRadius: "50%", // Makes the image circular
    //           objectFit: "cover",
    //         }}
    //       />
    //       <Grid item xs={12} sm={8} md={6}>
    //         <Typography
    //           variant="h1"
    //           style={{
    //             fontFamily: "Dela Gothic One",
    //             width: "100%",
    //             maxWidth: "800px",
    //           }}
    //         >
    //           MixMate-Serving You the Perfect Drink!
    //         </Typography>
    //       </Grid>
    //     </Grid>
    //     <Grid item xs={4}>
    //       <img
    //         src="/squiggly.jpg"
    //         style={{
    //           width: "100%",
    //           objectFit: "cover",
    //         }}
    //       />
    //     </Grid>
    //     <Grid item xs={12} style={{ marginLeft: "16.6vw" }}>
    //       <Button
    //         style={{
    //           width: "300px",
    //           borderRadius: "50vh",
    //           backgroundColor: "cyan",
    //           color: "black",
    //           fontFamily: "Dela Gothic one",
    //           fontSize: "15px",
    //         }}
    //         onClick={() => (window.location.href = API_ROUTES.login)}
    //       >
    //         Get Started Now!
    //       </Button>
    //     </Grid>
    //     <div style={{ height: "10vh" }}></div>
    //   </Grid>
    //   <div style={{ backgroundColor: "#5FA8D3", height: "100vh" }}></div>
  );
}

export default HomePage;
