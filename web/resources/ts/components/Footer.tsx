import React from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {apiStatusSelector, isLoginSelector, logout} from "../store/auth";
import {useHistory} from "react-router-dom";

const Footer = () => {

  const isLogin = useSelector(isLoginSelector);
  const apiStatus = useSelector(apiStatusSelector);

  const dispatch = useDispatch();
  const history = useHistory();

  const handleOnClickLogoutBtn = async () => {
    await dispatch(logout());

    if (apiStatus) {
      history.push("/");
    }
  }

  return (
    <footer className="footer">
      {isLogin ? (
        <button className="button button--link" onClick={handleOnClickLogoutBtn}>Logout</button>
      ) : (
        <Link className="button button--link" to="/login">
          Login / Register
        </Link>)
      }
    </footer>
  );
}

export default Footer;
