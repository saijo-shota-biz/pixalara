import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {apiStatusSelector, login, loginErrorMessagesSelector, clearError} from "../store/auth";
import {useHistory} from "react-router-dom";

const LoginForm: React.FC = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const apiStatus = useSelector(apiStatusSelector);
  const loginErrorMessages = useSelector(loginErrorMessagesSelector);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    }
  }, []);

  const handleOnChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handleOnChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  }

  const handleOnClick = async () => {
    await dispatch(login({email, password}));
    if (apiStatus) {
      history.push("/");
    }
  }

  return (
    <div className="panel">
      <form className="form" onSubmit={handleOnSubmit}>
        {
          loginErrorMessages && (
            <div className="errors">
              {
                Object.keys(loginErrorMessages).map(key => (
                  <ul key={key}>
                    {loginErrorMessages[key].map(msg => <li key={msg}>{msg}</li>)}
                  </ul>
                ))
              }
            </div>
          )
        }
        <label htmlFor="login-email">Email</label>
        <input type="text" className="form__item" id="login-email" value={email} onChange={handleOnChangeEmail}/>
        <label htmlFor="login-password">Password</label>
        <input type="password" className="form__item" id="login-password" value={password}
               onChange={handleOnChangePassword}/>
        <div className="form__button">
          <button className="button button--inverse" onClick={handleOnClick}>login</button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm;
