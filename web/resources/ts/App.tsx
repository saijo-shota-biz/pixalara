import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";
import PhotoList from "./pages/PhotoList";
import Login from "./pages/Login";

const App: React.FC = () => {
  return (
    <main>
      <div className="container">
        <BrowserRouter>
          <Switch>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/">
              <PhotoList/>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </main>
  );
};

export default App;
