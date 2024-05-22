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
export default function MenuBarDropdown() {
  return (
    <Paper sx={{ width: 200, zIndex: 10, position:"absolute" }}>
      <MenuList style={{ zIndex: 10 }}>
        <MenuItem>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Favourites</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <LiaCocktailSolid fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Recipes</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <FaEarthAmericas fontSize="small" />
          </ListItemIcon>
          <ListItemText>Social Recipes</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <WineBarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Ingredients</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
