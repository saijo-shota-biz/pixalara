import React from "react";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {isLoginSelector, userNameSelector} from "../store/auth";

const Navbar = () => {

  const isLogin = useSelector(isLoginSelector);
  const userName = useSelector(userNameSelector);

  return (
    <nav className="navbar">
      <Link className="navbar__brand" to="/">
        Pixalara
      </Link>
      <div className="navbar__menu">
        {
          isLogin ? (
            <>
              <div className="navbar__item">
                <button className="button">
                  <i className="icon ion-md-add"/>
                  Submit a photo
                </button>
              </div>
              <span className="navbar__item">{userName}</span>
            </>
          ) : (
            <div className="navbar__item">
              <Link className="button button--link" to="/login">
                Login / Register
              </Link>
            </div>
          )
        }
      </div>
    </nav>
  );
}

export default Navbar;
