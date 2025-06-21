"use client";
import {
  Box,
  Button,
  Grid,
  Typography,
  Container,
  Card,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import {
  API_ROUTES,
  APPLICATION_PAGE,
} from "@/app/_utilities/_client/constants";
import { useMediaQuery } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { pageStateActions } from "@lib/redux/pageStateSlice";
import { BiDrink, BiWine, BiBeer, BiLemon } from "react-icons/bi";
import {
  MdFavorite,
  MdRestaurantMenu,
  MdLocalBar,
  MdTrendingUp,
  MdStar,
  MdPeople,
  MdSecurity,
} from "react-icons/md";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { GiCherry, GiAppleCore } from "react-icons/gi";

function HomePage() {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));
  const isTablet = useMediaQuery((theme: any) =>
    theme.breakpoints.between("md", "lg")
  );
  const router = useRouter();
  const dispatch = useDispatch();

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
      icon: <MdLocalBar size={48} />,
      title: "Shopping Lists",
      description: "Generate shopping lists for your cocktail ingredients",
      color: "var(--accent-purple)",
    },
  ];

  const stats = [
    { number: "1000+", label: "Recipes", icon: <BiDrink /> },
    { number: "50+", label: "Ingredients", icon: <BiWine /> },
    { number: "24/7", label: "Available", icon: <BiBeer /> },
    { number: "4.9★", label: "Rating", icon: <MdStar /> },
  ];

  return (
    <Box sx={{ minHeight: "100vh", pt: 2 }}>
      {/* Hero Section */}
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Elements */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "10%",
              opacity: 0.1,
              animation: "pulse 3s ease-in-out infinite",
            }}
          >
            <GiAppleCore size={80} color="var(--accent-orange)" />
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "20%",
              right: "15%",
              opacity: 0.1,
              animation: "pulse 3s ease-in-out infinite 1s",
            }}
          >
            <BiLemon size={60} color="var(--accent-orange)" />
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "20%",
              left: "15%",
              opacity: 0.1,
              animation: "pulse 3s ease-in-out infinite 2s",
            }}
          >
            <BiLemon size={70} color="var(--accent-gold)" />
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "15%",
              right: "10%",
              opacity: 0.1,
              animation: "pulse 3s ease-in-out infinite 0.5s",
            }}
          >
            <GiCherry size={50} color="var(--accent-pink)" />
          </Box>

          {/* Main Content */}
          <Box className="animate-fade-in" sx={{ zIndex: 2, mb: 6 }}>
            <Typography
              variant="h1"
              className="heading-1 font-display"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem", lg: "5rem" },
                mb: 3,
                background: "var(--gold-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 700,
              }}
            >
              MixMate
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
              Your Ultimate Cocktail Companion
            </Typography>
            <Typography
              className="text-lg font-primary"
              sx={{
                mb: 6,
                maxWidth: "600px",
                mx: "auto",
                color: "var(--gray-300)",
                fontWeight: 400,
              }}
            >
              Discover, create, and share amazing cocktail recipes. From classic
              favorites to innovative creations, MixMate is your gateway to
              mixology mastery.
            </Typography>

            {/* CTA Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
                justifyContent: "center",
                alignItems: "center",
                mb: 8,
              }}
            >
              <Button
                onClick={() => router.push(APPLICATION_PAGE.recipes)}
                sx={{
                  background: "var(--primary-gradient)",
                  color: "var(--white)",
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "var(--shadow-lg)",
                  "&:hover": {
                    background: "var(--secondary-gradient)",
                    transform: "translateY(-3px)",
                    boxShadow: "var(--shadow-xl)",
                  },
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <MdRestaurantMenu />
                Explore Recipes
                <BsArrowRight />
              </Button>
              <Button
                onClick={() => router.push(APPLICATION_PAGE.myMixMate)}
                sx={{
                  background: "var(--glass-bg)",
                  color: "var(--white)",
                  border: "2px solid var(--glass-border)",
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  backdropFilter: "blur(16px)",
                  "&:hover": {
                    background: "var(--accent-gradient)",
                    borderColor: "var(--accent-gold)",
                    transform: "translateY(-3px)",
                  },
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <MdFavorite />
                My MixMate
                <BsArrowRight />
              </Button>
            </Box>
          </Box>

          {/* Stats Section */}
          <Grid
            container
            spacing={3}
            className="animate-fade-in"
            sx={{ zIndex: 2 }}
          >
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card
                  className="glass-card"
                  sx={{
                    textAlign: "center",
                    p: 2,
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  <CardContent sx={{ p: "16px !important" }}>
                    <Box sx={{ color: "var(--accent-gold)", mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h4"
                      className="font-primary"
                      sx={{
                        fontWeight: 700,
                        color: "var(--white)",
                        mb: 0.5,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="font-primary"
                      sx={{ color: "var(--gray-300)", fontWeight: 400 }}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Features Section */}
      <Box
        sx={{
          py: 8,
          background: "var(--glass-bg)",
          backdropFilter: "blur(16px)",
        }}
      >
        <Container maxWidth="xl">
          <Box className="animate-fade-in" sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              className="heading-2 font-display"
              sx={{
                fontSize: { xs: "2rem", md: "2.5rem" },
                mb: 2,
                fontWeight: 600,
              }}
            >
              Why Choose MixMate?
            </Typography>
            <Typography
              className="text-lg font-primary"
              sx={{
                color: "var(--gray-300)",
                maxWidth: "600px",
                mx: "auto",
                fontWeight: 400,
              }}
            >
              Everything you need to become a master mixologist in one beautiful
              app
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  className="glass-card animate-fade-in"
                  sx={{
                    height: "100%",
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid var(--glass-border)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "var(--shadow-2xl)",
                    },
                  }}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent sx={{ textAlign: "center", p: 4 }}>
                    <Box
                      sx={{
                        color: feature.color,
                        mb: 3,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h5"
                      className="font-primary"
                      sx={{
                        fontWeight: 600,
                        color: "var(--white)",
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      className="text-base font-primary"
                      sx={{ color: "var(--gray-300)", fontWeight: 400 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: "var(--primary-gradient)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box
            className="animate-fade-in"
            sx={{
              textAlign: "center",
              position: "relative",
              zIndex: 2,
            }}
          >
            <Typography
              variant="h2"
              className="heading-2 font-display"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                mb: 3,
                color: "var(--white)",
                fontWeight: 600,
              }}
            >
              Ready to Start Mixing?
            </Typography>
            <Typography
              className="text-lg font-primary"
              sx={{
                mb: 4,
                color: "var(--gray-100)",
                maxWidth: "600px",
                mx: "auto",
                fontWeight: 400,
              }}
            >
              Join thousands of cocktail enthusiasts and start creating amazing
              drinks today
            </Typography>
            <Button
              href={API_ROUTES.login}
              variant="contained"
              sx={{
                background: "var(--white)",
                color: "var(--primary-dark)",
                px: 6,
                py: 2,
                borderRadius: 3,
                fontSize: "1.1rem",
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "var(--shadow-xl)",
                "&:hover": {
                  background: "var(--gray-100)",
                  transform: "translateY(-3px)",
                  boxShadow: "var(--shadow-2xl)",
                },
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <MdPeople />
              Join MixMate
              <BsArrowRight />
            </Button>
          </Box>
        </Container>

        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            background:
              "radial-gradient(circle at 20% 80%, var(--accent-gold) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--accent-pink) 0%, transparent 50%)",
          }}
        />
      </Box>
    </Box>
  );
}

export default HomePage;
