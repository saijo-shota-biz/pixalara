import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Http from "../utils/Http";
import {RootState} from "./store";
import {OK, UNPROCESSABLE_ENTITY} from "../const/ResposeCode";
import {setErrorCode} from "./error";
import {act} from "react-dom/test-utils";

type User = {
  id: string;
  name: string;
  email: string;
}

type LoginErrorMessage = { email: string[], password: string[] };
type RegisterErrorMessage = { name: string[], email: string[], password: string[], password_confirmation: string[] };

const auth = createSlice({
  name: "auth",
  initialState: {
    user: null as User | null,
    apiStatus: null as boolean | null,
    loginErrorMessages: null as LoginErrorMessage | null,
    registerErrorMessages: null as RegisterErrorMessage | null
  },
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setApiStatus: (state, action: PayloadAction<boolean | null>) => {
      state.apiStatus = action.payload;
    },
    setLoginErrorMessages: (state, action: PayloadAction<LoginErrorMessage | null>) => {
      state.loginErrorMessages = action.payload;
    },
    setRegisterErrorMessages: (state, action) => {
      state.registerErrorMessages = action.payload;
    },
    clearError: state => {
      state.loginErrorMessages = null;
      state.registerErrorMessages = null;
    }
  },
});

// =====================================================================================================================
// reducer
// =====================================================================================================================
export const {setUser, setApiStatus, setLoginErrorMessages, setRegisterErrorMessages, clearError} = auth.actions;

// =====================================================================================================================
// async actions
// =====================================================================================================================
export type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const register = (registerForm: RegisterForm) => async dispatch => {
  const res = await Http.post("/api/register", registerForm);
  handleApiResponse("register", res, dispatch);
};

export type LoginForm = {
  email: string;
  password: string;
}

export const login = (loginForm: LoginForm) => async dispatch => {
  const res = await Http.post("/api/login", loginForm);
  handleApiResponse("login", res, dispatch);
}

const handleApiResponse = (type: "login" | "register", res, dispatch) => {
  if (res.status === OK) {
    const user: User = res.data;
    dispatch(setApiStatus(true));
    dispatch(setUser(user));
    return false;
  }

  dispatch(setApiStatus(false));

  if (res.status === UNPROCESSABLE_ENTITY) {
    if (type === "login") {
      dispatch(setLoginErrorMessages(res.data.errors));
    } else if (type === "register") {
      dispatch(setRegisterErrorMessages(res.data.errors));
    }
  } else {
    dispatch(setErrorCode(res.status));
  }
}

export const logout = () => async dispatch => {
  const res = await Http.post("/api/logout");
  if (res.status === OK) {
    dispatch(setUser(null));
    dispatch(setApiStatus(true));
    return false;
  }

  dispatch(setApiStatus(false));
  dispatch(setErrorCode(res.status));
}

export const currentUser = () => async dispatch => {
  const res = await Http.get("/api/user");
  if (res.status === OK) {
    const user: User | null = res.data || null;
    dispatch(setUser(user));
    dispatch(setApiStatus(true));
    return false;
  }
  dispatch(setApiStatus(false));
  dispatch(setErrorCode(res.status));
}

// =====================================================================================================================
// selector
// =====================================================================================================================
export const isLoginSelector = (state: RootState) => !!state.auth.user;
export const userNameSelector = (state: RootState) => state.auth.user ? state.auth.user.name : "";
export const apiStatusSelector = (state: RootState) => state.auth.apiStatus;
export const loginErrorMessagesSelector = (state: RootState) => state.auth.loginErrorMessages;
export const registerErrorMessagesSelector = (state: RootState) => state.auth.registerErrorMessages;

export default auth.reducer;

