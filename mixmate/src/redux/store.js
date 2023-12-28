import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./userInfoSlice";
import recipeReducer from "./recipeSlice"
const store = configureStore({
    reducer: {userInfo : userInfoReducer, recipe: recipeReducer }
});
export  default store;