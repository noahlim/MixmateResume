import {createSlice} from "@reduxjs/toolkit";
const initialRecipeState = {recipes: [], ingredients: [], categories: [], glasses: [], alcoholicTypes: []};
const recipeSlice = createSlice({
    name: "recipe",
    initialState: initialRecipeState,
    reducers: {
        setRecipes(state,action) {
            state.recipes = action.payload;
        },
        setIngredients(state,action) {
            state.ingredients = action.payload;
        },
        setCategories(state,action) {
            state.categories = action.payload;
        },
        setGlasses(state,action) {
            state.glasses = action.payload;
        },
        setAlcoholicTypes(state,action) {
            state.alcoholicTypes = action.payload;
        }
    }

});
export const recipeActions = recipeSlice.actions;
export default recipeSlice.reducer;
