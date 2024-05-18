import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";
import Rating from "@mui/material/Rating";
function stripHtmlTags(description) {
    const items = description.replace(/<\/?li>/g, '\n').split('\n');
    return items.filter(item => item.trim() !== '').join(', ');
}
function WalmartShoppingItemCard({ product }) {
    const url = `https://www.walmart.ca/en/search?q=${product.name}`;
  return (
    <Link href={url} target="_blank" rel="noopener" underline="none">
          <Card raised sx={{ maxWidth: 345, m: 2 }}>
            <CardMedia
                component="img"
                sx={{
                    height:'140',
                    objectFit:'cover',
                    width: '100%'
                }}                
                image={product.imageInfo.thumbnailUrl}
                alt="Product Image"
            />
            <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {stripHtmlTags(product.description)}
                </Typography>
                <br></br>
                <Typography variant="body2" color="text.secondary">
                    {`Ratings : (${product.rating.numberOfReviews} Reviews)`}
                </Typography>
                
                <Rating value={product.averageRating} readOnly size="small"/>
                <br></br>
                <br></br>
                <Typography variant="body2" color="skyblue" style={{fontSize: "1.2em", fontWeight:"bold"}}>
                    Price : {product.priceInfo.linePrice}
                </Typography>
            </CardContent>
        </Card>      
    </Link>
  );
}

export default WalmartShoppingItemCard;
