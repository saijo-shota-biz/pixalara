import React, {ReactNode} from "react";
import {useSelector} from "react-redux";
import {isLoginSelector} from "../store/auth";
import {Route, Redirect} from "react-router-dom";

type GuardRouteProp = {
  path: string;
  component: React.FC;
}

const GuardRoute: React.FC<GuardRouteProp> = ({ path, component }) => {
  const isLogin = useSelector(isLoginSelector);

  return isLogin ? <Route exact path={path} component={component} /> : <Redirect to="/login" />
}

export default GuardRoute;
