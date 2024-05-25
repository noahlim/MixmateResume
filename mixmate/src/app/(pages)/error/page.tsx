"use client";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useRouter, notFound } from "next/navigation";

interface ErrorProps {
  error: Error;
  reset: () => void;
  not_Found?: boolean;
}

const ErrorPage: React.FC<ErrorProps> = ({ error, reset, not_Found }) => {
  const router = useRouter();

  if (not_Found) {
    notFound();
  }

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
