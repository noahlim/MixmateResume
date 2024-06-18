"use client";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useRouter, notFound } from "next/navigation";


const ErrorPage = () => {
const router = useRouter();
  // Handle other errors
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Viewport height
      }}
    >
      <Typography variant="h1" align="center">
        Error
      </Typography>
      <Typography variant="h2" align="center">
        {"Something went wrong :("}
      </Typography>
      <Image src="/error.png" alt="Error" width={500} height={500} />
      <Button onClick={() => router.push("/")} variant="outlined" sx={{color:"primary"}}>
        Go Back To Home Page
      </Button>
    </Box>
  );
};

export default ErrorPage;
