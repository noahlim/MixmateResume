"use client";
import {
  Box,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { API_ROUTES, APPLICATION_PAGE} from "@/app/_utilities/_client/constants";
import { useMediaQuery } from "@mui/material";
import StarShape from "@/app/(components)/(shapeComponents)/StarShape";
import FloatingBoxWrapper from "@/app/(components)/(shapeComponents)/FloatingBox";
import Image from "next/image";
import HoverTypography from "@/app/(components)/(shapeComponents)/HoverTypography";
import BlogSection from "@/app/(components)/(shapeComponents)/BlogSection";
import { useRouter } from "next/navigation";
import MarqueeScroll from "@/app/(components)/(shapeComponents)/MarqueeAnimation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { pageStateActions } from "@lib/redux/pageStateSlice";

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
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(pageStateActions.setPageLoadingState(false));

  })
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
            backgroundImage: "url(/welcomepage/background3.jpg)",
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
                  marginBottom: { xs: "0px", sm: "20px" },
                  marginRight: { md: "50px", xs: "0px" },
                  transition:
                    "color .3s ease-in-out, box-shadow .3s ease-in-out",
                  boxShadow: "inset 0 0 0 0 #54b3d6",
                  zIndex: 1,
                  ":hover": {
                    boxShadow: "inset 250px 0 0 0 #54b3d6",
                    color: "white",
                  },
                }}
                onClick={() => router.push(APPLICATION_PAGE.recipes)}
              >
                Check The Recipes
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
                  marginBottom: { sm: "20px", xs: "0px" },
                  marginLeft: { md: "50px", xs: "0px" },
                  transition:
                    "color .3s ease-in-out, box-shadow .3s ease-in-out",
                  boxShadow: "inset 0 0 0 0 #54b3d6",
                  ":hover": {
                    boxShadow: "inset 250px 0 0 0 #54b3d6",
                    color: "white",
                  },
                }}
                onClick={() => router.push(APPLICATION_PAGE.myMixMate)}
              >
                Get Your Own Mixes
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
                sx={{ padding: 3,
                  flexDirection: { xs: "row", sm: "column" },
                 }}
              >
                <FloatingBoxWrapper
                  $isSmallMobileScreen={isSmallMobileScreen}
                  $isTabletScreen={isTabletScreen}
                  $isMediumMobileScreen={isMediumMobileScreen}
                />
                <HoverTypography
                  $isSmallMobileScreen={isSmallMobileScreen}
                  $isLargeScreen={isLargeScreen}
                  $isTabletScreen={isTabletScreen}
                  backgroundColor={"#F8C471"}
                  alignTo={"left"}
                  variant={isLargeScreen ? "h2" : isTabletScreen ? "h1" : "h3"}
                >
                  MixMate-Serving You the Perfect Drink!
                </HoverTypography>
              </Box>
            </Grid>
            <Box
              sx={{
                position: "absolute",
                right: 30,
                top: {md: 250, xs:130},
                width: {md: "35%", xs:"50%"},
                height: {md: "35%", xs:"50%"},
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
                sx={{justifyContent: {xs: "center", md: "flex-end"}}}
              >
                <Image
                  alt="Orange on a plate"
                  width={513}
                  height={486}
                  decoding="async"
                  src="/welcomepage/orange_on_plate.png"
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
                      sx={{ textAlign: { lg: "left", xs: "center"}}}
                    >
                      <HoverTypography
                        $isSmallMobileScreen={isSmallMobileScreen}
                        $isTabletScreen={isTabletScreen}
                        $isLargeScreen={isLargeScreen}
                        backgroundColor={"#FBFB7C"}
                        alignTo={"left"}
                        variant={isLargeScreen ? "h3" : "h4"}
                      >
                        A cocktail treasure-trove packed with vibrant and unique
                        recipes
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
                          sx={{
                            zIndex: 10,
                            paddingRight: { md: "30%", xs: null },
                          }}
                        >
                          From the classic ambrosial segments to the adventurous
                          concoctions, relish endless possibilities.
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
                        textAlign: { xs: "center", md: "right" },
                      }}
                      justifyContent="flex-end"
                      alignContent="center"
                    >
                      <Grid item>
                        <HoverTypography
                          $isSmallMobileScreen={isSmallMobileScreen}
                          $isTabletScreen={isTabletScreen}
                          $isLargeScreen={isLargeScreen}
                          backgroundColor={"#BAFE84"}
                          alignTo={
                            isSmallMobileScreen || isMediumMobileScreen
                              ? "left"
                              : "right"
                          }
                          variant={isLargeScreen ? "h3" : "h4"}
                        >
                          Tailor-made experience that fits your preferences
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
                          sx={{
                            zIndex: 10,
                            paddingLeft: { xs: null, md: "30%" },
                          }}
                        >
                          Create, share and savour your cocktail stories at
                          MixMate.
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
                sx={{
                  justifyContent: {
                    xs: "center",
                    md: "flex-start",
                  },
                }}
              >
                <Image
                  alt="leaf"
                  width={548}
                  height={455}
                  decoding="async"
                  src="/welcomepage/leaf.png"
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
                  sx={{ width: { xs: "70%", md: "40%" } }}
                >
                  <Image
                    width={514}
                    height={483}
                    decoding="async"
                    src="/welcomepage/orange.png"
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
        <MarqueeScroll direction="left"/>

        <Box bgcolor="white">
          <BlogSection />
        </Box>
      </Grid>
    </>
  );
}

export default HomePage;
