"use client";
import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import "@fontsource/dela-gothic-one";
import router from "next/router";
import { API_ROUTES, APPLICATION_PAGE } from "../_utilities/_client/constants";
import page from "../page";
import { useMediaQuery } from "@mui/material";
import StarShape from "./(shapeComponents)/StarShape";
import FloatingBoxWrapper from "./(shapeComponents)/FloatingBox";
import Image from "next/image";
import { useEffect } from "react";
import HoverTypography from "./(shapeComponents)/HoverTypography";
import BlogSection from "./(shapeComponents)/BlogPost";
function HomePage() {
  const isSmallMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.between("xs", "sm")
  );
  const isMediumMobileScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.between("sm", "md")
  );
  const isTabletScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.between("md,lg")
  );
  const isLargeScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.up("lg")
  );
  const isExtraLargeScreen = useMediaQuery((theme: any) =>
    theme.breakpoints.up("xl")
  );
  useEffect(() => {
    console.log(isSmallMobileScreen, isMediumMobileScreen, isTabletScreen);
    if (typeof window !== "undefined") {
      console.log(window.innerWidth);
    }
  }, []);
  return (
    <>
      <Grid container direction="column" justifyContent="center">
        <Grid
          container
          item
          direction="column"
          justifyContent="center"
          alignItems="center"
          position="relative"
          style={{
            backgroundImage: "url(/background3.jpg)",
            overflowX: "hidden",
          }}
        >
          <Image
            src="/mixmatelogo.png"
            alt="MixMate Logo"
            decoding="async"
            width={704}
            height={354}
            style={{
              width: isLargeScreen || isTabletScreen ? "40%" : "80%",
              zIndex: 1,
            }}
          />
          <Grid
            md={12}
            xs={12}
            justifyContent="center"
            alignContent="center"
            style={{
              padding: 20,
            }}
            item
            container
          >
            <Grid item>
              <Box
                component={Button}
                sx={{
                  width: "250px",
                  borderRadius: "50vh",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "Dela Gothic one",
                  fontSize: "15px",
                  marginBottom: isSmallMobileScreen ? "0px" : "20px",
                  marginRight: isTabletScreen || isLargeScreen ? "50px" : "0px",
                  transition:
                    "color .3s ease-in-out, box-shadow .3s ease-in-out",
                  boxShadow: "inset 0 0 0 0 #54b3d6",
                  zIndex: 1,
                  ":hover": {
                    boxShadow: "inset 250px 0 0 0 #54b3d6",
                    color: "white",
                  },
                }}
                onClick={() => (window.location.href = API_ROUTES.login)}
              >
                Get Your Mix
              </Box>
            </Grid>
            <Grid item>
              <Box
                component={Button}
                sx={{
                  width: "250px",
                  zIndex: 1,
                  borderRadius: "50vh",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "Dela Gothic one",
                  fontSize: "15px",
                  marginBottom: isSmallMobileScreen ? "0px" : "20px",
                  marginLeft: isTabletScreen || isLargeScreen ? "50px" : "0px",

                  transition:
                    "color .3s ease-in-out, box-shadow .3s ease-in-out",
                  boxShadow: "inset 0 0 0 0 #54b3d6",
                  ":hover": {
                    boxShadow: "inset 250px 0 0 0 #54b3d6",
                    color: "white",
                  },
                }}
                onClick={() => (window.location.href = API_ROUTES.login)}
              >
                Get Your Mix
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          justifyContent="start"
          alignContent="center"
          display="flex"
          style={{
            overflowX: "hidden",
            backgroundColor: "#F1FEFD",
          }}
          sm={12}
        >
          <Grid
            container
            item
            display="flex"
            justifyContent="start"
            alignItems="center"
          >
            <Grid item xs={9}>
              <Box
                display="flex"
                flexDirection={isSmallMobileScreen ? "row" : "column"}
                justifyContent="flex-start"
                alignItems="left"
                sx={{ padding:3 }}
              >
                <FloatingBoxWrapper
                  isSmallMobileScreen={isSmallMobileScreen}
                  isTabletScreen={isTabletScreen}
                  isMediumMobileScreen={isMediumMobileScreen}
                />
                <HoverTypography
                  isSmallMobileScreen={isSmallMobileScreen}
                  isLargeScreen={isLargeScreen}
                  isTabletScreen={isTabletScreen}
                  backgroundColor={"#F8C471"}
                  alignTo={"left"}
                  variant={isLargeScreen ? "h2" : isTabletScreen ? "h1" : "h3"}
                  //variant={isLargeScreen ? 'h2' : (isTabletScreen ? 'h3' : 'h4')}                  
                >
                  MixMate-Serving You the Perfect Drink!
                </HoverTypography>
              </Box>
            </Grid>
            <Box
              sx={{
                position: "absolute",
                right: 30,
                top: isTabletScreen || isLargeScreen ? 250 : 130,
                width: isTabletScreen || isLargeScreen ? "35%" : "50%",
                height: isTabletScreen || isLargeScreen ? "35%" : "50%",
                zIndex: 0,
              }}
            >
              <StarShape width="100%" height="100%" />
            </Box>
          </Grid>
          <Grid
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
          >
            <Grid item xs={12} md={6}>
              <Grid
                container
                justifyContent={
                  isMediumMobileScreen || isSmallMobileScreen
                    ? "center"
                    : "flex-end"
                }
              >
                <Image
                  alt="Orange on a plate"
                  width={513}
                  height={486}
                  decoding="async"
                  src="/orange_on_plate.png"
                  style={{
                    width: isTabletScreen
                      ? "80%"
                      : isMediumMobileScreen || isSmallMobileScreen
                      ? "90%"
                      : "60%",
                    height: "100%",
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid
                container
                justifyContent="center"
                alignContent="start"
                style={{ padding: "10px" }}
              >
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={12}
                      sx={{ textAlign: isLargeScreen ? "left" : "center" }}
                    >
                      <HoverTypography
                        isSmallMobileScreen={isSmallMobileScreen}
                        isTabletScreen={isTabletScreen}
                        isLargeScreen={isLargeScreen}
                        backgroundColor={"#FBFB7C"}
                        alignTo={"left"}
                        variant={isLargeScreen ? "h2" : "h3"}
                      >
                        Greetings
                      </HoverTypography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{ textAlign: "left" }}
                      style={{ paddingRight: "20px" }}
                    >
                      <Box width="100%">
                        <Typography
                          margin={2}
                          variant="h6"
                          position="relative"
                          className="noto_sans"
                          style={{ zIndex: 10 }}
                        >
                          Unleash your inner mixologist with Mixmate, a land
                          brimming with cocktail recipes that'll make your taste
                          buds dance.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent={{ xs: "center", md: "flex-end" }}
            alignItems="center"
            style={{ paddingBottom: "30px" }}
            spacing={3}
          >
            <Grid item xs={12} md={7} order={{ xs: 2, md: 1 }}>
              <Grid
                container
                justifyContent="center"
                alignContent="start"
                style={{ padding: "10px" }}
              >
                <Grid item xs={12}>
                  <Grid container>
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        textAlign:
                          isLargeScreen || isTabletScreen ? "right" : "center",
                      }}
                      justifyContent="flex-end"
                      alignContent="center"
                    >
                      <Grid item>
                        <HoverTypography
                          isSmallMobileScreen={isSmallMobileScreen}
                          isTabletScreen={isTabletScreen}
                          isLargeScreen={isLargeScreen}
                          backgroundColor={"#BAFE84"}
                          alignTo={
                            isSmallMobileScreen || isMediumMobileScreen
                              ? "left"
                              : "right"
                          }
                          variant={isLargeScreen ? "h2" : "h3"}
                        >
                          Greetings2
                        </HoverTypography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{ textAlign: "right" }}
                      style={{ paddingRight: "20px" }}
                    >
                      <Box width="100%">
                        <Typography
                          margin={2}
                          variant="h6"
                          className="noto_sans"
                          position="relative"
                          style={{ zIndex: 10 }}
                        >
                          damn your inner mixologist with Mixmate, a land
                          brimming with cocktail recipes that'll make your taste
                          buds dance.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={5} order={{ xs: 1, md: 2 }}>
              <Grid
                container
                justifyContent={
                  isMediumMobileScreen || isSmallMobileScreen
                    ? "center"
                    : "flex-start"
                }
              >
                <Image
                  alt="leaf"
                  width={548}
                  height={455}
                  decoding="async"
                  src="/leaf.png"
                  style={{
                    width: isTabletScreen || isLargeScreen ? "80%" : "90%",
                    height: "100%",
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            container
            justifyContent="center"
            alignContent="center"
            spacing={3}
            style={{
              padding: "150px 0px",
            }}
          >
            <Grid container position="relative">
              <Grid item>
                <Box
                  position="absolute"
                  bottom="5px"
                  left="100px"
                  width={isTabletScreen || isLargeScreen ? "40%" : "70%"}
                >
                  <Image
                    width={514}
                    height={483}
                    decoding="async"
                    src="/orange.png"
                    alt="Orange"
                    style={{
                      opacity: 0.3,
                      zIndex: -1,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Typography
                variant="h3"
                style={{
                  fontFamily: "Dela Gothic one",
                }}
              >
                Join MixMate today!
              </Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                onClick={() => (window.location.href = API_ROUTES.login)}
                style={{
                  fontFamily: "sans-serif",
                  color: "white",
                  backgroundColor: "black",
                  borderColor: "black",
                  borderRadius: "50vh",
                  padding: "10px 20px",
                  margin: "10px",
                }}
              >
                Sign Up
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Box bgcolor="white">
          <BlogSection/>
        </Box>
      </Grid>
    </>
  );
}

export default HomePage;
