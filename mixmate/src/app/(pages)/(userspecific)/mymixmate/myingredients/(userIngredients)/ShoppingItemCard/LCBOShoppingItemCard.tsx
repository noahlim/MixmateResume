import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box, Link } from "@mui/material";
import Image from "next/image";
function LCBOShoppingItemCard({ product }) {
  console.log(product.raw);
  return (
    <Link
      href={product.ClickUri}
      target="_blank"
      rel="noopener"
      underline="none"
    >
      <Card raised sx={{ maxWidth: 345, m: 2 }}>
        <Box
          sx={{
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
          
          }}
        >
          <Image
            height={140}
            width={200}
            src={product.raw.ec_thumbnails}
            alt="Product Image"
            decoding="async"
          />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.raw.systitle}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.raw.lcbo_tastingnotes}
          </Typography>
          <br></br>
          <Typography variant="body2" color="black">
            Alc % : {product.raw.lcbo_alcohol_percent}
          </Typography>
          <Typography variant="body2" color="black">
            {`Volume: ${product.raw.lcbo_total_volume}${
              product.raw.lcbo_total_volume < 10 ? "l" : "ml"
            }`}
          </Typography>
          <br></br>

          <Typography
            variant="body2"
            color="skyblue"
            style={{ fontSize: "1.2em", fontWeight: "bold" }}
          >
            Price : ${product.raw.ec_final_price}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default LCBOShoppingItemCard;
