"use client";
import { Box, Divider, Grid, Typography, useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import MarqueeComponent from "@/app/(components)/(shapeComponents)/MarqueeAnimation";
import "../../../app/globals.css";
import { FaGithub } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
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
        <Grid container justifyContent="center">
          <MarqueeComponent />
          <Grid
            item
            xs={10}
            md={6}
            sx={{ marginTop: "20px" }}
            textAlign="center"
          >
            <Typography
              variant="h4"
              className={spaceGrotesk.className}
              sx={{ marginTop: { md: "50px" } }}
            >
              The Development Journey: A Labor of Love
            </Typography>
          </Grid>
          <Grid item xs={10} md={7} sx={{ margin: "20px 0px" }}>
            <Typography className={spaceGrotesk.className}>
              The development of MixMate was a labor of love, combining
              cutting-edge technologies with a deep understanding of the
              cocktail culture. Our team of skilled developers, designers, and
              mixologists collaborated tirelessly to create a seamless and
              intuitive user experience that would truly resonate with cocktail
              enthusiasts.
            </Typography>
            <br />
            <Typography className={spaceGrotesk.className}>
              Leveraging modern web development frameworks and libraries, such
              as Next.js and Material-UI, we crafted a responsive and visually
              stunning interface that seamlessly adapts to various devices,
              ensuring a consistent and engaging experience for users across
              multiple platforms. The backend infrastructure, built on robust
              and scalable technologies like Node.js and MongoDB, allows for
              efficient data management and seamless integration with external
              APIs, ensuring a smooth and reliable flow of information.
            </Typography>
            <br />
            <Typography className={spaceGrotesk.className}>
              Throughout the development process, we prioritized user feedback
              and rigorously tested each feature to ensure a smooth and
              enjoyable experience. Our commitment to quality and attention to
              detail is reflected in every aspect of MixMate, from its intuitive
              navigation to its visually appealing design.
            </Typography>
          </Grid>
          <Grid container item xs={12} sx={{ padding: "60px 0px" }}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <Image
                width={970}
                height={500}
                decoding="async"
                src="/about/cheers2.png"
                alt="Multicolored cocktails in a row"
              />
            </Grid>
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
                src="/about/cheers1.png"
                alt="Multicolored cocktails in a row"
              />
            </Grid>
          </Grid>{" "}
          <Box bgcolor="white">
            <Grid
              container
              justifyContent="center"
              style={{ padding: "30px 0px" }}
            >
              <Grid
                item
                container
                md={2}
                xs={10}
                style={{ padding: "30px 0px" }}
              >
                <Grid xs={12} item>
                  <Typography
                    variant="h6"
                    style={{
                      paddingBottom: "10px",
                      color: "#205095",
                      fontWeight: "bold",
                    }}
                  >
                    Company
                  </Typography>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">About</a>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">Team</a>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">Careers</a>
                </Grid>
              </Grid>
              <Grid
                item
                container
                md={2}
                xs={10}
                style={{ padding: "30px 0px" }}
              >
                <Grid xs={12} item>
                  <Typography
                    variant="h6"
                    style={{
                      paddingBottom: "10px",
                      color: "#205095",
                      fontWeight: "bold",
                    }}
                  >
                    Support
                  </Typography>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">FAQs</a>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">Privacy Policy</a>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">Terms of Service</a>
                </Grid>
              </Grid>
              <Grid
                item
                container
                md={2}
                xs={10}
                style={{ padding: "30px 0px" }}
                spacing={1}
              >
                <Grid xs={12} item>
                  <Typography
                    variant="h6"
                    style={{
                      paddingBottom: "10px",
                      color: "#205095",
                      fontWeight: "bold",
                    }}
                  >
                    Contact
                  </Typography>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">Contact Us</a>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">Locations</a>
                </Grid>
                <Grid xs={12} item>
                  <a href="#">Customer Support</a>
                </Grid>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item xs={9} md={6}>
                <Divider />
              </Grid>
            </Grid>
            <Grid
              container
              justifyContent="center"
              style={{ paddingBottom: "30px" }}
            >
              <Grid
                item
                container
                justifyContent="space-around"
                md={4}
                xs={10}
                style={{ padding: "30px 0px" }}
              >
                <Grid xs={1} item>
                  <a href="https://github.com/harryGIbong">
                    <FaGithub fontSize={40} />
                  </a>
                </Grid>
                <Grid xs={1} item>
                  <FaFacebook fontSize={40} />
                </Grid>
                <Grid xs={1} item>
                  <FaInstagram fontSize={40} />
                </Grid>
                <Grid xs={1} item>
                  <FaYoutube fontSize={40} />
                </Grid>
              </Grid>
              <Grid item xs={12} textAlign="center">
                MixMate By Hongseok Kim
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}

export default AboutPage;
