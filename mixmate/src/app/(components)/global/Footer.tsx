import { Box, Divider, Grid, Typography } from "@mui/material";

import { FaGithub } from "react-icons/fa6";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
const Footer = () => {
  return (
    <>
      <Box
        bgcolor="white"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "30px",
        }}
      >
        <Divider sx={{ width: "80%" }} />
      </Box>
      <Box bgcolor="white" sx={{ direction: "flex" }}>
        <Grid container justifyContent="center" style={{ padding: "30px 0px" }}>
          <Grid item container md={2} xs={10} style={{ padding: "30px 0px" }}>
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
          <Grid item container md={2} xs={10} style={{ padding: "30px 0px" }}>
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
    </>
  );
};

export default Footer;
