import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import {
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";

function NoFrillsShoppingItemCard({ product }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  // Handle the No Frills API response structure
  const productTitle = product.title || product.name || "Product";
  const productImage =
    product.image || product.imageInfo?.thumbnailUrl || "/not-found-icon.png";
  const productLink =
    product.link ||
    `https://www.nofrills.ca/search?search-bar=${encodeURIComponent(
      productTitle
    )}`;
  const productPrice =
    product.price?.currentPrice ||
    product.priceInfo?.linePrice ||
    "Price not available";
  const originalPrice = product.price?.originalPrice || null;

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      <Card
        raised
        sx={{
          maxWidth: 345,
          m: 2,
          background: "rgba(26, 26, 46, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 215, 0, 0.3)",
          color: "#fff",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(255, 215, 0, 0.2)",
          },
          transition: "all 0.3s ease",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            height: "140",
            objectFit: "cover",
            width: "100%",
          }}
          image={productImage}
          alt={productTitle}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ color: "#ffd700", fontWeight: 700 }}
          >
            {productTitle}
          </Typography>

          {product.description && (
            <Typography variant="body2" sx={{ color: "#fff", mb: 1 }}>
              {product.description}
            </Typography>
          )}

          {product.ratings && (
            <Typography variant="body2" sx={{ color: "#fff", mb: 1 }}>
              {`Rating: ${product.ratings} (${
                product.reviewsCount || 0
              } Reviews)`}
            </Typography>
          )}

          <Typography
            variant="body2"
            sx={{
              fontSize: "1.2em",
              fontWeight: "bold",
              color: "#5CC5E1",
              mb: 2,
            }}
          >
            Price: {productPrice}
          </Typography>

          {originalPrice && originalPrice !== productPrice && (
            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "#ccc",
                mb: 2,
              }}
            >
              Original: {originalPrice}
            </Typography>
          )}

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<VisibilityIcon />}
              onClick={handlePreviewOpen}
              sx={{
                color: "#ffd700",
                borderColor: "#ffd700",
                "&:hover": {
                  borderColor: "#ffd700",
                  backgroundColor: "rgba(255, 215, 0, 0.1)",
                },
              }}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              size="small"
              component={Link}
              href={productLink}
              target="_blank"
              rel="noopener"
              sx={{
                backgroundColor: "#5CC5E1",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#009CC6",
                },
              }}
            >
              View on Site
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <Dialog
        open={previewOpen}
        onClose={handlePreviewClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(26, 26, 46, 0.97)",
            color: "#fff",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffd700", fontWeight: 700 }}>
          {productTitle} - Preview
          <IconButton
            onClick={handlePreviewClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "#ffd700",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ height: "500px", width: "100%" }}>
            <iframe
              src={productLink}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "0 0 16px 16px",
              }}
              title={`Preview of ${productTitle}`}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default NoFrillsShoppingItemCard;
