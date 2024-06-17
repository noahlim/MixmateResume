import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, Link } from "@mui/material";
import Image from "next/image";
function LCBOShoppingItemCard({ product }) {
  return (
    <Link href={product.url} target="_blank" rel="noopener" underline="none">
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
            src={product.image_url}
            alt="Product Image"
            decoding="async"
          />
        </Box>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
          <br></br>
          <Typography variant="body2" color="black">
            Alc % : {product.alcohol_content}
          </Typography>
          <Typography variant="body2" color="black">
            {`Volume: ${product.volume}${product.volume < 5 ? "l" : "ml"}`}
          </Typography>
          <br></br>

          <Typography
            variant="body2"
            color="skyblue"
            style={{ fontSize: "1.2em", fontWeight: "bold" }}
          >
            Price : ${product.price}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default LCBOShoppingItemCard;
