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
  Divider,
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
      gradient: "bg-gradient-to-br from-gold-400 to-gold-600",
    },
    {
      icon: <MdFavorite size={48} />,
      title: "Save Favorites",
      description: "Build your personal collection of favorite cocktails",
      color: "var(--accent-pink)",
      gradient: "bg-gradient-to-br from-pink-400 to-pink-600",
    },
    {
      icon: <MdRestaurantMenu size={48} />,
      title: "Create Your Own",
      description: "Design and share your unique cocktail creations",
      color: "var(--accent-teal)",
      gradient: "bg-gradient-to-br from-teal-400 to-teal-600",
    },
    {
      icon: <MdLocalBar size={48} />,
      title: "Shopping Lists",
      description: "Generate shopping lists for your cocktail ingredients",
      color: "var(--accent-purple)",
      gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
  ];

  const stats = [
    { number: "1000+", label: "Recipes", icon: <BiDrink /> },
    { number: "50+", label: "Ingredients", icon: <BiWine /> },
    { number: "24/7", label: "Available", icon: <BiBeer /> },
    { number: "4.9★", label: "Rating", icon: <MdStar /> },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        pt: 2,
        position: "relative",
        background:
          "linear-gradient(135deg, #181a2e 0%, #23243a 60%, #ffd700 100%)",
        overflow: "hidden",
      }}
      className="font-primary animated-bg"
    >
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
            className="floating"
            sx={{
              position: "absolute",
              top: "10%",
              left: "10%",
              opacity: 0.1,
            }}
          >
            <GiAppleCore size={80} color="var(--accent-orange)" />
          </Box>
          <Box
            className="floating-delayed"
            sx={{
              position: "absolute",
              top: "20%",
              right: "15%",
              opacity: 0.1,
            }}
          >
            <BiLemon size={60} color="var(--accent-orange)" />
          </Box>
          <Box
            className="floating"
            sx={{
              position: "absolute",
              bottom: "20%",
              left: "15%",
              opacity: 0.1,
            }}
          >
            <BiLemon size={70} color="var(--accent-gold)" />
          </Box>
          <Box
            className="floating-delayed"
            sx={{
              position: "absolute",
              bottom: "15%",
              right: "10%",
              opacity: 0.1,
            }}
          >
            <GiCherry size={50} color="var(--accent-pink)" />
          </Box>
          {/* Animated Cocktail Icon for Fun */}
          <Box
            sx={{
              position: "absolute",
              top: 32,
              right: 32,
              zIndex: 10,
              animation: "bounce 2s infinite",
            }}
          >
            <BiDrink
              size={48}
              color="#ffd700"
              style={{ filter: "drop-shadow(0 4px 16px #ffd70088)" }}
            />
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
                textShadow: "0 0 30px rgba(255, 215, 0, 0.3)",
                position: "relative",
              }}
            >
              MixMate
              <Box
                sx={{
                  width: 120,
                  height: 5,
                  background:
                    "linear-gradient(90deg, #ffd700 60%, #fffbe6 100%)",
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
                lineHeight: 1.8,
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
                variant="contained"
                size="large"
                onClick={() => router.push(APPLICATION_PAGE.recipes)}
                className="btn-primary"
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  textTransform: "none",
                  boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
                  },
                }}
              >
                Explore Recipes
                <BsArrowRight style={{ marginLeft: "8px" }} />
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push(APPLICATION_PAGE.about)}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: "12px",
                  textTransform: "none",
                  borderColor: "var(--accent-gold)",
                  color: "var(--accent-gold)",
                  "&:hover": {
                    borderColor: "var(--accent-orange)",
                    color: "var(--accent-orange)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 10px 25px rgba(255, 215, 0, 0.2)",
                  },
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Stats Section */}
        <Box
          className="animate-slide-up"
          sx={{
            mb: 10,
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="glass-card"
              sx={{
                textAlign: "center",
                p: 3,
                borderRadius: "16px",
                border: "1.5px solid #ffd70033",
                boxShadow: "0 8px 32px 0 #ffd70022",
                transition: "all 0.3s ease",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.07))",
                backdropFilter: "blur(24px)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  borderColor: "#ffd700",
                  boxShadow: "0 20px 40px #ffd70044",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                  color: "var(--accent-gold)",
                }}
              >
                {stat.icon}
              </Box>
              <Typography
                variant="h4"
                className="font-bold"
                sx={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--white)",
                  mb: 1,
                }}
              >
                {stat.number}
              </Typography>
              <Typography
                className="text-sm font-medium"
                sx={{
                  color: "var(--gray-300)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </Typography>
            </Card>
          ))}
        </Box>

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
                <Card
                  className="cocktail-card"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 4,
                    borderRadius: "20px",
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.07))",
                    backdropFilter: "blur(24px)",
                    border: "1.5px solid #ffd70033",
                    boxShadow: "0 8px 32px 0 #ffd70022",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      borderColor: feature.color,
                      boxShadow: `0 25px 50px -12px #ffd70044, 0 0 20px ${feature.color}40`,
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
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action Section */}
        <Box
          className="animate-fade-in"
          sx={{
            textAlign: "center",
            py: 8,
            px: 4,
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.07))",
            backdropFilter: "blur(24px)",
            border: "1.5px solid #ffd70033",
            boxShadow: "0 8px 32px 0 #ffd70022",
            mb: 10,
          }}
        >
          <Typography
            variant="h3"
            className="heading-2 font-display"
            sx={{
              mb: 3,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              color: "var(--white)",
            }}
          >
            Ready to Start Mixing?
          </Typography>
          <Typography
            className="text-lg"
            sx={{
              mb: 4,
              color: "var(--gray-300)",
              maxWidth: "600px",
              mx: "auto",
            }}
          >
            Join thousands of cocktail enthusiasts and start creating amazing
            drinks today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(APPLICATION_PAGE.recipes)}
            className="btn-accent"
            sx={{
              px: 6,
              py: 2,
              fontSize: "1.1rem",
              fontWeight: 700,
              borderRadius: "99px",
              textTransform: "none",
              background: "linear-gradient(90deg, #ffd700 60%, #ffe066 100%)",
              color: "#181a2e",
              boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              transition: "all 0.2s",
              "&:hover": {
                background: "linear-gradient(90deg, #ffe066 60%, #ffd700 100%)",
                color: "#181a2e",
                boxShadow: "0 4px 16px rgba(255, 224, 102, 0.25)",
              },
            }}
          >
            Start Mixing Now
          </Button>
        </Box>

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
            <img
              src="/profilepics/profile3.png"
              width={56}
              height={56}
              alt="User avatar"
              style={{ borderRadius: "50%", boxShadow: "0 4px 16px #ffd70044" }}
            />
            <Typography
              sx={{ color: "#ffd700", fontWeight: 700, fontSize: "1.1rem" }}
            >
              @MixMaster
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
            “MixMate is the most fun and beautiful way to discover new
            cocktails. I love the community and the design!”
          </Typography>
        </Box>
        <Divider sx={{ my: 6, borderColor: "#ffd700", opacity: 0.3 }} />
      </Container>
    </Box>
  );
}

export default HomePage;
