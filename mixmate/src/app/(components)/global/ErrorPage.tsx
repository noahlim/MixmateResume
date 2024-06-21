'use client';
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface ErrorPageProps {
  error?: any | null;
  reset?: () => void;
  not_Found?: boolean;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error, reset, not_Found = false }) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h1" align="center">
        {not_Found ? "404 Not Found" : "Error"}
      </Typography>
      <Typography variant="h2" align="center">
        {not_Found ? "The page you're looking for doesn't exist." : "Something went wrong :("}
      </Typography>
      {error && <Typography variant="body1">{error.message}</Typography>}
      <Image src="/error.png" alt="Error" width={500} height={500} />
      <Button onClick={() => (reset ? reset() : router.push("/"))} variant="outlined" sx={{ color: "primary" }}>
        Go Back To Home Page
      </Button>
    </Box>
  );
};

export default ErrorPage;