import React, {useEffect} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import PhotoList from "./pages/PhotoList";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import {useDispatch, useSelector} from "react-redux";
import {isLoginSelector} from "./store/auth";
import SystemError from "./pages/error/SystemError";
import {errorCodeSelector} from "./store/error";
import {useHistory} from "react-router-dom";
import {setErrorCode} from "./store/error";
import {INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED} from "./const/ResposeCode";
import PhotoDetail from "./pages/PhotoDetail";
import Message from "./components/Message";
import Http from "./utils/Http";
import {setUser} from "./store/auth";
import NotFound from "./pages/error/NotFound";

const App = () => {

  const isLogin = useSelector(isLoginSelector);
  const errorCode = useSelector(errorCodeSelector);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (errorCode === INTERNAL_SERVER_ERROR) {
      history.push("/500");
      dispatch(setErrorCode(null));
    } else if (errorCode === UNAUTHORIZED) {
      Http.get("/api/refresh-token")
        .then(() => {
          dispatch(setUser(null));
          history.push("/login")
        });
    } else if (errorCode === NOT_FOUND) {
      history.push("/404");
    }
  }, [errorCode]);

  return (
    <>
      <header>
        <Navbar/>
      </header>
      <main>
        <div className="container">

          <Message/>

          <Switch>
            {
              isLogin ? <Redirect path="/login" to="/"/> : <Route path="/login" component={Login}/>
            }
            <Route path="/500" component={SystemError}/>
            <Route path="/photos/:id" component={PhotoDetail}/>
            <Route path="/" exact component={PhotoList}/>
            <Route path="*" component={NotFound}/>
          </Switch>

        </div>
      </main>
      <Footer/>
    </>
  );
};

export default App;
