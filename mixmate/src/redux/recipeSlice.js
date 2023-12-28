import {createSlice} from "@reduxjs/toolkit";
const initialRecipeState = {recipes: []};
const recipeSlice = createSlice({
    name: "recipe",
    initialState: initialRecipeState,
    reducers: {
        setRecipes(state,action) {
            state.recipes = action.payload;
        }
    }
});
export const recipeActions = recipeSlice.actions;
export default recipeSlice.reducer;
