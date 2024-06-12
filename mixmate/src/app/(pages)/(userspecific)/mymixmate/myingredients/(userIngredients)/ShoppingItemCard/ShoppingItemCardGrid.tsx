import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import LCBOShoppingItemCard from "./LCBOShoppingItemCard";
import WalmartShoppingItemCard from "./WalmartShoppingItemCard";

import { Button, Typography } from "@mui/material";
import { capitalizeWords } from "@/app/_utilities/_client/utilities";

const ShoppingItemCardGridDialog = ({ open, onClose, products, ing }) => {
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
          {ing.strAlcoholic ? "LCBO" : "Walmart"}
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
              : `https://www.walmart.ca/en/search?q=${encodeURIComponent(
                  ing.strIngredient1
                )}`,
            "_blank"
          );
        }}
      >
        View More Items on {ing.strAlcoholic ? "LCBO" : "Walmart"} Website
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
          <Grid container spacing={2}>
            {products
              ?.filter((product) => product !== undefined && product !== null)
              .slice(0, 20)
              .map((product, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  {ing.strAlcoholic ? (
                    <LCBOShoppingItemCard product={product} />
                  ) : (
                    <WalmartShoppingItemCard product={product} />
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
