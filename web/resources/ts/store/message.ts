import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./store";
import Http from "../utils/Http";
import {RegisterForm} from "./auth";

const message = createSlice({
  name: "message",
  initialState: {
    content: null as string | null,
  },
  reducers: {
    setMessage: (state, action: PayloadAction<string | null>) => {
      state.content = action.payload;
    },
  },
});

export const {setMessage} = message.actions;

export const messageSelector = (state: RootState) => state.message.content;

export const setTempMessage = (content: string) => async dispatch => {
  dispatch(setMessage(content));
  setTimeout(() => {
    dispatch(setMessage(null));
  }, 5000);
};

export default message.reducer;
