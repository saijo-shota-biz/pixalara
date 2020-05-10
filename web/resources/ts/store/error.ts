import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";

const error = createSlice({
  name: "error",
  initialState: {
    code: null as number | null,
  },
  reducers: {
    setErrorCode: (state, action: PayloadAction<number | null>) => {
      state.code = action.payload;
    }
  },
});

export const {setErrorCode} = error.actions;

export const errorCodeSelector = (state: RootState) => state.error.code;

export default error.reducer;
