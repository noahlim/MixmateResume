import { createSlice } from "@reduxjs/toolkit";
const initialUserInfoState = {
    userInfo: null, 
    userIngredients: []
};
const userInfoSlice = createSlice({
    name: "userInfo",
    initialState: initialUserInfoState,
    reducers: {
        setUserInfo(state, action) {
            state.userInfo = action.payload;
        },
        setUserIngredients(state, action) {
            state.userIngredients = action.payload;
        }
    }
});
export const userInfoActions = userInfoSlice.actions;
export default userInfoSlice.reducer;
