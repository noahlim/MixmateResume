"use client";
import { Box, Grid, Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import MarqueeComponent from "@/app/(components)/MarqueeAnimation";
import "../../../app/globals.css";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

function AboutPage() {
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

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundImage: "url(/about/about-background.jpg)",
      }}
    >
      <Box width="100%">
        <Grid container>
          <Grid container item xs={12}>
            <Grid
              item
              container
              xs={12}
              md={6}
              justifyContent="center"
              alignContent="center"
              sx={{
                direction: "flex",
                backgroundColor: "#E4FFFE",
                order: { xs: 1, md: 0 },
              }}
            >
              <Box
                justifyContent="center"
                alignContent="center"
                sx={{ width: { xs: "80%", md: "50%" }, height: "60%" }}
              >
                <Grid item xs={12} textAlign="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="black"
                    className={spaceGrotesk.className}
                    sx={{ paddingTop: { xs: "20px", md: "0px" } }}
                  >
                    MixMate: The Ultimate Cocktail Companion
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  textAlign="left"
                  sx={{ padding: "20px 0px" }}
                >
                  <Typography
                    fontSize={isTabletScreen || isLargeScreen ? "18px" : "16px"}
                    color="black"
                    className={spaceGrotesk.className}
                  >
                    MixMate is a revolutionary web application designed to
                    revolutionize the way people discover, create, and share
                    cocktail recipes. With its intuitive interface and powerful
                    features, MixMate aims to become the go-to platform for
                    cocktail enthusiasts, bartenders, and anyone who appreciates
                    the art of mixology.
                  </Typography>
                  <br />
                </Grid>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                order: { xs: 0, md: 1 },
              }}
            >
              <Image
                width={987}
                height={588}
                decoding="async"
                src="/about/rainbowcocktails.png"
                alt="Multicolored cocktails in a row"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <MarqueeComponent />
        </Grid>
        <Grid container>
          <Grid container item xs={12}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Image
                width={987}
                height={588}
                decoding="async"
                src="/about/bartender.webp"
                alt="Multicolored cocktails in a row"
              />
            </Grid>
            <Grid
              item
              container
              xs={12}
              md={6}
              justifyContent="center"
              alignContent="center"
              sx={{ direction: "flex", backgroundColor: "#E4FFFE" }}
            >
              <Box
                justifyContent="center"
                alignContent="center"
                sx={{ width: { xs: "80%", md: "50%" }, height: "60%" }}
              >
                <Grid item xs={12} textAlign="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="black"
                    className={spaceGrotesk.className}
                    sx={{ paddingTop: { xs: "20px", md: "0px" } }}
                  >
                    The Art of Personalized Cocktail Creation
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  textAlign="left"
                  sx={{ padding: "20px 0px" }}
                >
                  <Typography
                    fontSize={isTabletScreen || isLargeScreen ? "18px" : "16px"}
                    color="black"
                    className={spaceGrotesk.className}
                  >
                    MixMate is a cutting-edge cocktail app featuring an
                    innovative tool that suggests recipes tailored to users'
                    available ingredients, fostering creativity and
                    experimentation. Users can craft and share original cocktail
                    recipes with a vibrant community, where enthusiasts connect,
                    rate recipes, and provide feedback that drives the
                    platform's continuous evolution. This collaborative approach
                    ensures MixMate remains a dynamic resource, adapting to the
                    ever-changing tastes and trends of the cocktail world.
                  </Typography>
                  <br />
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid container item xs={12}>
            <Grid
              item
              container
              xs={12}
              md={6}
              justifyContent="center"
              alignContent="center"
              sx={{
                direction: "flex",
                backgroundColor: "#E4FFFE",
                order: { xs: 1, md: 0 },
              }}
            >
              <Box
                justifyContent="center"
                alignContent="center"
                sx={{ width: { xs: "80%", md: "50%" }, height: "60%" }}
              >
                <Grid item xs={12} textAlign="center">
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="black"
                    className={spaceGrotesk.className}
                    sx={{ paddingTop: { xs: "20px", md: "0px" } }}
                  >
                    MixMate: The Ultimate Cocktail Companion
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  textAlign="left"
                  sx={{ padding: "20px 0px" }}
                >
                  <Typography
                    fontSize={isTabletScreen || isLargeScreen ? "18px" : "16px"}
                    color="black"
                    className={spaceGrotesk.className}
                  >
                    MixMate is a revolutionary web application designed to
                    revolutionize the way people discover, create, and share
                    cocktail recipes. With its intuitive interface and powerful
                    features, MixMate aims to become the go-to platform for
                    cocktail enthusiasts, bartenders, and anyone who appreciates
                    the art of mixology.
                  </Typography>
                  <br />
                </Grid>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                order: { xs: 0, md: 1 },
              }}
            >
              <Image
                width={987}
                height={588}
                decoding="async"
                src="/about/old-fashioned.png"
                alt="Multicolored cocktails in a row"
              />
            </Grid>
          </Grid>
        </Grid>
        <Typography>
          But MixMate is more than just a recipe repository; it's a vibrant
          community where cocktail enthusiasts from around the world can
          connect, share their creations, and engage in lively discussions about
          their favorite drinks. Users can rate and review recipes, leaving
          feedback and suggestions that contribute to the continuous improvement
          and evolution of the platform. This collaborative approach ensures
          that MixMate remains a dynamic and ever-growing resource, constantly
          adapting to the changing tastes and trends of the cocktail world.
        </Typography>
        <Typography variant="h2">More Than Just a Cocktail App </Typography>
        <Image
          width={465}
          height={700}
          decoding="async"
          src="/about/bluecocktail.png"
          alt="Blue colored cocktail in a glass"
        />
        <Typography>
          MixMate is not just another cocktail app; it's a platform that
          celebrates the art of mixology, fosters creativity, and brings
          together a community of passionate individuals who share a love for
          well-crafted cocktails. With its extensive recipe database, advanced
          filtering capabilities, and user-generated content, MixMate offers a
          truly immersive and personalized experience for cocktail enthusiasts
          of all levels. Join us on this flavorful journey and let MixMate be
          your trusted companion in discovering, creating, and sharing the
          perfect cocktail for any occasion, whether it's a casual gathering
          with friends or a sophisticated soiree.
        </Typography>
      </Box>
    </Box>
  );
}

export default AboutPage;
