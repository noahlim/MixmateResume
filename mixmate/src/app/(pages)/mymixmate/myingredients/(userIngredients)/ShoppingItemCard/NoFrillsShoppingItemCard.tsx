import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";

function NoFrillsShoppingItemCard({ product }) {
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

  return (
    <Link href={productLink} target="_blank" rel="noopener" underline="none">
      <Card raised sx={{ maxWidth: 345, m: 2 }}>
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
          <Typography gutterBottom variant="h6" component="div">
            {productTitle}
          </Typography>

          {product.description && (
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          )}

          {product.ratings && (
            <>
              <br />
              <Typography variant="body2" color="text.secondary">
                {`Rating: ${product.ratings} (${
                  product.reviewsCount || 0
                } Reviews)`}
              </Typography>
            </>
          )}

          <br />
          <Typography
            variant="body2"
            color="skyblue"
            style={{ fontSize: "1.2em", fontWeight: "bold" }}
          >
            Price: {productPrice}
          </Typography>

          {originalPrice && originalPrice !== productPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              style={{ textDecoration: "line-through" }}
            >
              Original: {originalPrice}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default NoFrillsShoppingItemCard;
