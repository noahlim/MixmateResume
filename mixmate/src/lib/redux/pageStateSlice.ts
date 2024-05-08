import {createSlice} from "@reduxjs/toolkit";
import { SEVERITY } from "@/app/_utilities/_client/constants";
const initialPageState = {isLoading:false, toastMessage: {open:false, severity:SEVERITY.info, title:"", message:""}};
const pageStateSlice = createSlice({
    name: "pageState",
    initialState: initialPageState,
    reducers: {
        setPageLoadingState(state,action) {
            state.isLoading = action.payload;
        },
        setToastMessage(state,action) {
            state.toastMessage = action.payload;
        }
    }

});
export const pageStateActions = pageStateSlice.actions;
export default pageStateSlice.reducer;