import {createSlice} from "@reduxjs/toolkit";
const initialRecipeState = {recipes: [], ingredients: []};
const recipeSlice = createSlice({
    name: "recipe",
    initialState: initialRecipeState,
    reducers: {
        setRecipes(state,action) {
            state.recipes = action.payload;
        },
        setIngredients(state,action) {
            state.ingredients = action.payload;
        }
    }

});
export const recipeActions = recipeSlice.actions;
export default recipeSlice.reducer;
