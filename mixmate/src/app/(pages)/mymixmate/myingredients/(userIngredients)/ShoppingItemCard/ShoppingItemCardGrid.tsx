import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import LCBOShoppingItemCard from "./LCBOShoppingItemCard";
import NoFrillsShoppingItemCard from "./NoFrillsShoppingItemCard";

import { Button, Typography, Box } from "@mui/material";
import { capitalizeWords } from "@/app/_utilities/_client/utilities";

const ShoppingItemCardGridDialog = ({ open, onClose, products, ing }) => {
  const logoExists = true; // Replace with actual logic to check if logo exists

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "800px",
          height: "80%",
          position: "relative",
          "@media (min-width: 600px)": {
            width: "60%",
          },
        },
      }}
    >
      <DialogTitle>
        <Typography
          color="primary"
          style={{ fontSize: "1.2em", fontWeight: "bold" }}
        >
          Available Items of {capitalizeWords(ing.strIngredient1)} on{" "}
          {ing.strAlcoholic ? "LCBO" : "No Frills"}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Button
        onClick={() => {
          window.open(
            ing.strAlcoholic
              ? `https://www.lcbo.com/en/catalogsearch/result/#q=${encodeURIComponent(
                  ing.strIngredient1
                )}&t=Products&sort=relevancy&layout=card`
              : `https://www.nofrills.ca/search?search-bar=${encodeURIComponent(
                  ing.strIngredient1
                )}`,
            "_blank"
          );
        }}
      >
        View More Items on {ing.strAlcoholic ? "LCBO" : "No Frills"} Website
      </Button>
      <DialogContent
        sx={{
          paddingX: 2,
          overflowY: "auto",
          maxHeight: { xs: "90vh", sm: "calc(100vh - 96px)" },
          "&:first-of-type": {
            paddingTop: 0,
          },
        }}
      >
        <div style={{ padding: "16px" }}>
          {(!products || products.length === 0) && !ing.strAlcoholic && (
            <Box
              sx={{
                height: "320px",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #fffbe6 0%, #ffe066 100%)",
                borderRadius: "0 0 16px 16px",
                boxShadow: "0 4px 24px rgba(255, 215, 0, 0.12)",
                p: 4,
                gap: 2,
              }}
            >
              <img
                src={logoExists ? "/nofrills-logo.png" : undefined}
                alt="No Frills Logo"
                style={{ width: 120, marginBottom: 12 }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  // Optionally show fallback text/icon
                }}
              />
              {!logoExists && (
                <Box sx={{ fontWeight: 700, color: "#181a2e", mb: 2 }}>
                  No Frills
                </Box>
              )}
              <Typography
                variant="h6"
                sx={{ color: "#181a2e", fontWeight: 700, mb: 1 }}
              >
                NoFrills Ingredient Search
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#333", mb: 2, textAlign: "center" }}
              >
                View this ingredient on NoFrills.ca. Click below to see the
                latest prices and availability for{" "}
                <b>{capitalizeWords(ing.strIngredient1)}</b>.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  background:
                    "linear-gradient(90deg, #ffd700 60%, #ffe066 100%)",
                  color: "#181a2e",
                  fontWeight: 700,
                  borderRadius: 99,
                  px: 4,
                  py: 1.5,
                  fontSize: 16,
                  boxShadow: "0 4px 16px rgba(255, 215, 0, 0.18)",
                  textTransform: "none",
                  letterSpacing: 1,
                  "&:hover": {
                    background:
                      "linear-gradient(90deg, #ffe066 0%, #ffd700 100%)",
                    color: "#181a2e",
                    transform: "translateY(-2px) scale(1.04)",
                  },
                }}
                onClick={() =>
                  window.open(
                    `https://www.nofrills.ca/search?search-bar=${encodeURIComponent(
                      capitalizeWords(ing.strIngredient1)
                    )}`,
                    "_blank"
                  )
                }
              >
                Open in NoFrills.ca
              </Button>
            </Box>
          )}
          <Grid container spacing={2}>
            {products
              ?.filter((product) => product !== undefined && product !== null)
              .slice(0, 20)
              .map((product, index) => (
                <Grid item xs={12} lg={6} key={index}>
                  {ing.strAlcoholic ? (
                    <LCBOShoppingItemCard product={product} />
                  ) : (
                    <NoFrillsShoppingItemCard product={product} />
                  )}
                </Grid>
              ))}
          </Grid>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShoppingItemCardGridDialog;
