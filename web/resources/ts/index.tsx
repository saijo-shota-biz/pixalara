import React from "react";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import App from "./App";
import store from "./store/store";
import {currentUser} from "./store/auth";
import {BrowserRouter} from "react-router-dom";

const createApp = async () => {
  await store.dispatch(currentUser());

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root")
  );
}

createApp();
