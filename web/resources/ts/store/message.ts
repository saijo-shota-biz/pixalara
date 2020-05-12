import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";

const message = createSlice({
  name: "message",
  initialState: {
    content: null as string | null,
  },
  reducers: {
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.content = action.payload

      setTimeout(() => {
        state.content = null;
      }, 5000);
    },
  },
});

export const {setMessage} = message.actions;

export const messageSelector = (state: RootState) => state.message.content;

export default message.reducer;
