"use client";
import {
  Box,
  Divider,
  Grid,
  Typography,
  useTheme,
  Container,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import MarqueeAnimation from "@/app/(components)/(shapeComponents)/MarqueeAnimation";
import "../../../app/globals.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { pageStateActions } from "@lib/redux/pageStateSlice";
import { END_POINT, MIXMATE_DOMAIN } from "@/app/_utilities/_client/constants";
import { BiDrink, BiStar, BiTime, BiUser } from "react-icons/bi";
import { MdRestaurantMenu, MdFavorite, MdShare } from "react-icons/md";

function AboutPage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isTabletScreen = useMediaQuery(
    theme?.breakpoints?.up("lg") || "(min-width:1200px)"
  );

  useEffect(() => {
    dispatch(pageStateActions.setPageLoadingState(false));
  }, [dispatch]);

  const features = [
    {
      icon: <BiDrink size={48} />,
      title: "Discover Recipes",
      description:
        "Explore thousands of cocktail recipes from classics to modern creations",
      color: "var(--accent-gold)",
    },
    {
      icon: <MdFavorite size={48} />,
      title: "Save Favorites",
      description: "Build your personal collection of favorite cocktails",
      color: "var(--accent-pink)",
    },
    {
      icon: <MdRestaurantMenu size={48} />,
      title: "Create Your Own",
      description: "Design and share your unique cocktail creations",
      color: "var(--accent-teal)",
    },
    {
      icon: <MdShare size={48} />,
      title: "Share & Connect",
      description: "Join a community of cocktail enthusiasts",
      color: "var(--accent-purple)",
    },
  ];

  return (
    <Box
      className="font-primary"
      sx={{
        minHeight: "100vh",
        pt: 2,
        position: "relative",
        background:
          "linear-gradient(135deg, #181a2e 0%, #23243a 60%, #ffd700 100%)",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box
          className="animate-fade-in"
          sx={{
            textAlign: "center",
            py: 8,
            mb: 6,
          }}
        >
          <Typography
            variant="h1"
            className="heading-1 font-display"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
              mb: 3,
              background: "var(--gold-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontWeight: 700,
              position: "relative",
            }}
          >
            About MixMate
            <Box
              sx={{
                width: 120,
                height: 5,
                background: "linear-gradient(90deg, #ffd700 60%, #fffbe6 100%)",
                borderRadius: 99,
                mx: "auto",
                mt: 2,
              }}
            />
          </Typography>
          <Typography
            variant="h2"
            className="heading-2 font-display"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              mb: 4,
              color: "var(--gray-200)",
              maxWidth: "800px",
              mx: "auto",
              fontWeight: 600,
            }}
          >
            The Ultimate Cocktail Companion
          </Typography>
          <Typography
            className="text-lg"
            sx={{
              mb: 6,
              maxWidth: "600px",
              mx: "auto",
              color: "var(--gray-300)",
              fontWeight: 400,
              lineHeight: 1.8,
            }}
          >
            MixMate is a revolutionary web application designed to revolutionize
            the way people discover, create, and share cocktail recipes. With
            its intuitive interface and powerful features, MixMate aims to
            become the go-to platform for cocktail enthusiasts, bartenders, and
            anyone who appreciates the art of mixology.
          </Typography>
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={6} sx={{ mb: 10 }}>
          {/* First Section */}
          <Grid item xs={12} lg={6}>
            <Box
              className="animate-slide-up"
              sx={{
                p: 4,
                borderRadius: "24px",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.07))",
                backdropFilter: "blur(24px)",
                border: "1.5px solid #ffd70033",
                boxShadow: "0 8px 32px 0 #ffd70022",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 16px 48px 0 #ffd70044",
                  borderColor: "#ffd700",
                },
              }}
            >
              <Typography
                variant="h3"
                className="heading-2 font-display"
                sx={{
                  mb: 3,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: "var(--white)",
                  textAlign: "center",
                }}
              >
                Personalized Cocktail Creation
              </Typography>
              <Typography
                className="text-base"
                sx={{
                  color: "var(--gray-300)",
                  lineHeight: 1.8,
                  textAlign: "center",
                }}
              >
                MixMate features an innovative tool that suggests recipes
                tailored to users&apos; available ingredients, fostering
                creativity and experimentation. Users can craft and share
                original cocktail recipes with a vibrant community, where
                enthusiasts connect, rate recipes, and provide feedback that
                drives the platform&apos;s continuous evolution.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: 300,
              }}
            >
              <Image
                width={600}
                height={400}
                decoding="async"
                src="/about/rainbowcocktails.png"
                alt="Multicolored cocktails in a row"
                style={{
                  borderRadius: "20px",
                  objectFit: "cover",
                  boxShadow: "0 8px 32px 0 #ffd70033",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Marquee Animation */}
        <Box sx={{ mb: 10 }}>
          <MarqueeAnimation direction="left" />
        </Box>

        {/* Second Section */}
        <Grid container spacing={6} sx={{ mb: 10 }}>
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: 300,
              }}
            >
              <Image
                width={600}
                height={400}
                decoding="async"
                src="/about/bartender.webp"
                alt="Professional bartender"
                style={{
                  borderRadius: "20px",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box
              className="animate-slide-up"
              sx={{
                p: 4,
                borderRadius: "24px",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.07))",
                backdropFilter: "blur(24px)",
                border: "1.5px solid #ffd70033",
                boxShadow: "0 8px 32px 0 #ffd70022",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 16px 48px 0 #ffd70044",
                  borderColor: "#ffd700",
                },
              }}
            >
              <Typography
                variant="h3"
                className="heading-2 font-display"
                sx={{
                  mb: 3,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: "var(--white)",
                  textAlign: "center",
                }}
              >
                Community-Driven Innovation
              </Typography>
              <Typography
                className="text-base"
                sx={{
                  color: "var(--gray-300)",
                  lineHeight: 1.8,
                  textAlign: "center",
                }}
              >
                This collaborative approach ensures MixMate remains a dynamic
                resource, adapting to the ever-changing tastes and trends of the
                cocktail world. Our community of mixologists, bartenders, and
                cocktail enthusiasts continuously contributes to making MixMate
                the most comprehensive and up-to-date cocktail platform.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h2"
            className="heading-2 font-display text-center"
            sx={{
              mb: 6,
              fontSize: { xs: "2rem", md: "2.5rem" },
              color: "var(--white)",
            }}
          >
            Why Choose MixMate?
          </Typography>
          <Grid container spacing={6}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  className="cocktail-card animate-fade-in"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 4,
                    borderRadius: "20px",
                    background: "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.4s ease",
                    animationDelay: `${index * 0.1}s`,
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      borderColor: feature.color,
                      boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 20px ${feature.color}40`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                      background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)`,
                      border: `2px solid ${feature.color}40`,
                      color: feature.color,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    className="font-semibold"
                    sx={{
                      mb: 2,
                      color: "var(--white)",
                      fontSize: "1.25rem",
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    className="text-base"
                    sx={{
                      color: "var(--gray-300)",
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Final Section */}
        <Grid container spacing={6}>
          <Grid item xs={12} lg={6}>
            <Box
              className="animate-slide-up"
              sx={{
                p: 4,
                borderRadius: "24px",
                background:
                  "linear-gradient(135deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.07))",
                backdropFilter: "blur(24px)",
                border: "1.5px solid #ffd70033",
                boxShadow: "0 8px 32px 0 #ffd70022",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s",
                "&:hover": {
                  boxShadow: "0 16px 48px 0 #ffd70044",
                  borderColor: "#ffd700",
                },
              }}
            >
              <Typography
                variant="h3"
                className="heading-2 font-display"
                sx={{
                  mb: 3,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  color: "var(--white)",
                  textAlign: "center",
                }}
              >
                Advanced Features
              </Typography>
              <Typography
                className="text-base"
                sx={{
                  color: "var(--gray-300)",
                  lineHeight: 1.8,
                  textAlign: "center",
                }}
              >
                From ingredient-based recipe suggestions to social sharing
                capabilities, MixMate offers a comprehensive suite of tools
                designed to enhance your cocktail-making experience. Whether
                you&apos;re a seasoned bartender or a curious beginner, our
                platform provides everything you need to explore the world of
                mixology.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: 300,
              }}
            >
              <Image
                width={600}
                height={400}
                decoding="async"
                src="/about/cheers.jpg"
                alt="People celebrating with cocktails"
                style={{
                  borderRadius: "20px",
                  objectFit: "cover",
                }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Testimonial Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 6,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Image
              src="/profilepics/profile2.png"
              width={56}
              height={56}
              alt="User avatar"
              style={{ borderRadius: "50%", boxShadow: "0 4px 16px #ffd70044" }}
            />
            <Typography
              sx={{ color: "#ffd700", fontWeight: 700, fontSize: "1.1rem" }}
            >
              @CocktailLover
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "#fff",
              fontStyle: "italic",
              maxWidth: 500,
              textAlign: "center",
              fontSize: "1.15rem",
              opacity: 0.9,
            }}
          >
            &quot;MixMate makes it so easy to discover and create new cocktails.
            The community is amazing and the design is beautiful!&quot;
          </Typography>
        </Box>
        <Divider sx={{ my: 6, borderColor: "#ffd700", opacity: 0.3 }} />

        {/* Call to Action Section */}
        <Box sx={{ mt: 12, mb: 6, textAlign: "center" }}>
          <Divider sx={{ mb: 4, borderColor: "#ffd700", opacity: 0.3 }} />
          <Typography
            variant="h4"
            className="font-heading"
            sx={{ color: "#ffd700", fontWeight: 800, mb: 2 }}
          >
            Ready to Shake Things Up?
          </Typography>
          <Typography
            sx={{ color: "#fff", mb: 4, fontSize: "1.2rem", opacity: 0.85 }}
          >
            Start exploring, creating, and sharing cocktails with MixMate today!
          </Typography>
          <a href="/recipes" style={{ textDecoration: "none" }}>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                background: "linear-gradient(90deg, #ffd700 60%, #ffe066 100%)",
                color: "#181a2e",
                fontWeight: 700,
                fontSize: 20,
                borderRadius: 99,
                px: 5,
                py: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                transition: "all 0.2s",
                "&:hover": {
                  background:
                    "linear-gradient(90deg, #ffe066 60%, #ffd700 100%)",
                  color: "#181a2e",
                  boxShadow: "0 4px 16px rgba(255, 224, 102, 0.25)",
                },
              }}
            >
              Start Mixing Now
            </Box>
          </a>
        </Box>
      </Container>
    </Box>
  );
}

export default AboutPage;
