// page.tsx
import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import AboutPage from "./AboutPage"; // Import the client component

export const metadata = {
  title: "MixMate | About",
  description: "Description test",
};

export default function Page() {
  return (
    <Box>
      <AboutPage />
    </Box>
  );
}