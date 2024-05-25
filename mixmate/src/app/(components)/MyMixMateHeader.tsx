import { Box, Grid, Typography } from "@mui/material";
import MarqueeScroll from "./MarqueeAnimation";
import { Space_Grotesk } from "next/font/google";
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] });

const MyMixMateHeader = ({title,children}) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#FFFFFF",
          padding: { xs: "30px 0px", md: "80px 0px" },
        }}
        justifyContent="center"
        alignContent="center"
      >
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          spacing={3}
          sx={{ padding: "20px" }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography variant="h3" className={spaceGrotesk.className}>
              {title}
            </Typography>
          </Grid>

          <Grid item xs={12} md={8} textAlign="center">
            <Typography className={spaceGrotesk.className}>
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