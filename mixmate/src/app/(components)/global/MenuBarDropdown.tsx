import * as React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { LiaCocktailSolid } from "react-icons/lia";
import WineBarIcon from "@mui/icons-material/WineBar";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FaEarthAmericas } from "react-icons/fa6";
import { APPLICATION_PAGE } from "@/app/_utilities/_client/constants";
export default function MenuBarDropdown({handlePageChange}) {
  return (
    <Paper sx={{ width: 200, zIndex: 10, position: "absolute" }}>
      <MenuList style={{ zIndex: 10 }}>
        <MenuItem onClick={() => handlePageChange(APPLICATION_PAGE.favourites)}>
          <ListItemIcon>
            <FavoriteIcon fontSize="small" />
          </ListItemIcon>
            <ListItemText>Favourites</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handlePageChange(APPLICATION_PAGE.myRecipes)}>
          <ListItemIcon>
            <LiaCocktailSolid fontSize={20} />
          </ListItemIcon>
            <ListItemText>My Recipes</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handlePageChange(APPLICATION_PAGE.social)}>
          <ListItemIcon>
            <FaEarthAmericas fontSize={16} />
          </ListItemIcon>
            <ListItemText>Community Recipes</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => handlePageChange(APPLICATION_PAGE.myIngredients)}
        >
          <ListItemIcon>
            <WineBarIcon fontSize="small" />
          </ListItemIcon>
            <ListItemText>My Ingredients</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
