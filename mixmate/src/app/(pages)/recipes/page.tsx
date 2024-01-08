import dynamic from "next/dynamic";
import Preloader from "@/app/(components)/Preloader";
import { Backdrop, CircularProgress } from "@mui/material";
const backdropStyle = {
  color: "#fff",
  zIndex: 1300, // Replace with an appropriate fixed value
};

const RecipeLazyLoaded = dynamic(() => import("@/app/(components)/Recipe"), {
  loading: () => (
    <Backdrop open={true} sx={backdropStyle}>
      <CircularProgress color="inherit" />
    </Backdrop>
  ),
});

export default function Recipe() {
  return <RecipeLazyLoaded />;
}
