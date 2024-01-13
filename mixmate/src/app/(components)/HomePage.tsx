import { Button, Grid, Typography } from "@mui/material";
import "@fontsource/dela-gothic-one";
import router from "next/router";
import { API_ROUTES, APPLICATION_PAGE } from "../_utilities/_client/constants";
import page from "../page";
function HomePage() {
  // useEffect(() => {
  //   addMeetupHandler();
  // }, []);
  // const backgroundImage = {
  //   backgroundImage: `url(/HomePage.png)`,
  //   backgroundSize: "cover",
  //   backgroundPosition: "center",
  //   height: "100vh",
  // };

  return (
    <div style={{ backgroundColor: "#CAE9FF", height: "300vh" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div style={{ height: "10vh" }}></div>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item justifyContent="flex-end" xs={5}>
          <img
            src="/balls.png"
            style={{
              width: "50%", // Adjust the width as needed
              borderRadius: "50%", // Makes the image circular
              objectFit: "cover",
            }}
          />
          <Grid item xs={12}>
            <Typography
              variant="h1"
              style={{ fontFamily: "Dela Gothic One", width: "50vw" }}
            >
              MixMate-Serving You the Perfect Drink!
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <img
            src="/squiggly.jpg"
            style={{
              width: "100%",
              objectFit: "cover",
            }}
          />
        </Grid>
        <Grid item xs={12} style={{ marginLeft: "16.6vw" }}>
          <Button
            style={{
              width: "300px",
              borderRadius: "50vh",
              backgroundColor: "cyan",
              color: "black",
              fontFamily: "Dela Gothic one",
              fontSize: "15px",
            }}
            onClick={() => window.location.href = API_ROUTES.login}
          >
            Get Started Now!
          </Button>
        </Grid>
        <div style={{ height: "10vh" }}></div>
      </Grid>
      <div style={{ backgroundColor: "#5FA8D3", height: "100vh" }}></div>
    </div>
  );
}

export default HomePage;