import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth";
import errorReducer from "./error";
import messageReducer from "./message";

const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
    message: messageReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>

export default store;
