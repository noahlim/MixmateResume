import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import { SEVERITY } from "@/app/_utilities/_client/constants";
import {PageState, ToastMessage} from "../../interface/toastMessage";   
const initialPageState: PageState = {
    isLoading: false,
    toastMessage: { open: false, severity: SEVERITY.Info, title: "", message: "" },
  };
  
  const pageStateSlice = createSlice({
    name: "pageState",
    initialState: initialPageState,
    reducers: {
      setPageLoadingState(state, action: PayloadAction<boolean>) {
        state.isLoading = action.payload;
      },
      setToastMessage(state, action: PayloadAction<ToastMessage>) {
        state.toastMessage = action.payload;
      },
      setToastMessageClose(state) {
        state.toastMessage.open = false;
      },
      setToastMessageOpen(state) {
        state.toastMessage.open = true;
      },
    },
  });
  export const pageStateActions = pageStateSlice.actions; 
  export default pageStateSlice.reducer;