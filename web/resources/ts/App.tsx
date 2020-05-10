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
import GuardRoute from "./components/GuardRoute";
import {setErrorCode} from "./store/error";
import {INTERNAL_SERVER_ERROR} from "./const/ResposeCode";

const App = () => {

  const isLogin = useSelector(isLoginSelector);
  const errorCode = useSelector(errorCodeSelector);

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (errorCode === INTERNAL_SERVER_ERROR) {
      history.push(`/500`);
      dispatch(setErrorCode(null));
    }
  }, [errorCode]);

  return (
    <>
      <header>
        <Navbar/>
      </header>
      <main>
        <div className="container">

          <Switch>
            {
              isLogin ? <Redirect path="/login" to="/"/> : <Route path="/login" component={Login}/>
            }
            <Route path="/500" component={SystemError}/>
            <GuardRoute path="/" component={PhotoList}/>
          </Switch>

        </div>
      </main>
      <Footer/>
    </>
  );
};

export default App;
