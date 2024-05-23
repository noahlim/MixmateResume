import React from "react";
import Marquee from "react-fast-marquee";
import { Box, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({ subsets: ["latin"] });
const MarqueeScroll = () => {
  return (
    <Box sx={{ backgroundColor: "black" }} width="100%">
      <Marquee gradient={false} speed={70}>
        <Typography className={comfortaa.className} sx={{ padding: "5px 50px", color:"white" }}>
          <Check sx={{color:"white"}}/> Organize recipes, impress guests.
        </Typography>
        <Typography className={comfortaa.className} sx={{ padding: "5px 50px", color:"white" }}>
          <Check sx={{color:"white"}}/> Discover endless possibilities.
        </Typography>{" "}
        <Typography className={comfortaa.className} sx={{ padding: "5px 50px", color:"white" }}>
          <Check sx={{color:"white"}}/> Flow, mix & explore flavors.
        </Typography>{" "}
        <Typography className={comfortaa.className} sx={{ padding: "5px 50px", color:"white" }}>
          <Check sx={{color:"white"}}/> Unleash your inner mixologist.
        </Typography>{" "}
        <Typography className={comfortaa.className} sx={{ padding: "5px 50px", color:"white" }}>
          <Check sx={{color:"white"}}/> Hangover cure (eventually). 
        </Typography>{" "}
        <Typography className={comfortaa.className} sx={{ padding: "5px 50px", color:"white" }}>
          <Check sx={{color:"white"}}/> Mixing cocktails made simple.
        </Typography>
      </Marquee>
    </Box>
  );
};
export default MarqueeScroll;
