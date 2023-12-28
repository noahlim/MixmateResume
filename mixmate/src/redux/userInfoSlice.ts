import {createSlice} from "@reduxjs/toolkit";
const initialUserInfoState = {userNickname: "", userIngredients: []};
const userInfoSlice = createSlice({
    name: "userInfo",
    initialState: initialUserInfoState,
    reducers: {
        setUserNickname(state,action) {
            state.userNickname = action.payload;
        },
        setUserIngredients(state, action){
            state.userIngredients = action.payload;
        }
    }
});
export const userInfoActions = userInfoSlice.actions;
export default userInfoSlice.reducer;
