import { Box, Grid, Typography } from "@mui/material";
import MarqueeScroll from "./(shapeComponents)/MarqueeAnimation";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const MyMixMateHeader = ({ title, children }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          background: "linear-gradient(90deg, #181a2e 60%, #ffd700 100%)",
          py: { xs: 4, md: 8 },
          px: 0,
        }}
        justifyContent="center"
        alignContent="center"
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{ px: 2 }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography
              variant="h2"
              className="font-heading"
              sx={{
                color: "#ffd700",
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "3rem" },
                textShadow: "0 2px 8px rgba(0,0,0,0.25)",
                mb: 2,
              }}
            >
              {title}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8} textAlign="center">
            <Typography
              className="font-primary"
              sx={{
                color: "#fff",
                fontWeight: 400,
                maxWidth: 900,
                mx: "auto",
                fontSize: { xs: "1rem", md: "1.25rem" },
                textShadow: "0 1px 4px rgba(0,0,0,0.18)",
              }}
            >
              {children}
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <MarqueeScroll direction="right" />
    </>
  );
};

export default MyMixMateHeader;
