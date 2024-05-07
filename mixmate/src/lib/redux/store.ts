import { configureStore } from "@reduxjs/toolkit";
import userInfoReducer from "./userInfoSlice";
import recipeReducer from "./recipeSlice"
import pageStateReducer from "./pageStateSlice"
const store = configureStore({
    reducer: { userInfo: userInfoReducer, recipe: recipeReducer, pageState: pageStateReducer }
}
);

export default store;