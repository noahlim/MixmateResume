import * as React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import { LiaCocktailSolid } from "react-icons/lia";
import WineBarIcon from "@mui/icons-material/WineBar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaEarthAmericas } from "react-icons/fa6";
import Link from "next/link";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
export default function MenuBarDropdown() {
  return (
    <Paper sx={{ width: 200, zIndex: 10, position: "absolute" }}>
      <MenuList style={{ zIndex: 10 }}>
        <MenuItem>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <Link href={APPLICATION_PAGE.favourites}>
            <ListItemText>Favourites</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <LiaCocktailSolid fontSize={20} />
          </ListItemIcon>
          <Link href={APPLICATION_PAGE.myRecipes}>
            <ListItemText>My Recipes</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <FaEarthAmericas fontSize={16} />
          </ListItemIcon>
          <Link href={APPLICATION_PAGE.social}>
            <ListItemText>Social Recipes</ListItemText>
          </Link>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <WineBarIcon fontSize="small" />
          </ListItemIcon>
          <Link href={APPLICATION_PAGE.myIngredients}>
            <ListItemText>My Ingredients</ListItemText>
          </Link>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
