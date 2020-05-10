import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./auth";
import errorReducer from "./error";

const store = configureStore({
  reducer: {
    auth: authReducer,
    error: errorReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>

export default store;
