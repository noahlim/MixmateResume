import {createSlice} from "@reduxjs/toolkit";
const initialPageState = {isLoading:false};
const pageStateSlice = createSlice({
    name: "pageState",
    initialState: initialPageState,
    reducers: {
        setRecipes(state,action) {
            state.isLoading = action.payload;
        }
    }

});
export const pageStateActions = pageStateSlice.actions;
export default pageStateSlice.reducer;
