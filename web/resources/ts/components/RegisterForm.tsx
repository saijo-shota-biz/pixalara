import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from 'react-router-dom';
import {apiStatusSelector, register, registerErrorMessagesSelector, clearError} from "../store/auth";

const RegisterForm = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const dispatch = useDispatch();
  const history = useHistory();

  const apiStatus = useSelector(apiStatusSelector);
  const registerErrorMessages = useSelector(registerErrorMessagesSelector);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    }
  }, []);

  const handleOnChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }

  const handleOnChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const handleOnChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  const handleOnChangePasswordConfirmation = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(event.target.value);
  }

  const handleOnSubmit = (event: FormEvent) => {
    event.preventDefault();
  }

  const handleOnClick = async () => {
    await dispatch(register({ name, email, password, password_confirmation: passwordConfirmation }));

    if (apiStatus) {
      history.push("/");
    }
  }

  return (
    <div className="panel">
      <form className="form" onSubmit={handleOnSubmit}>
        {
          registerErrorMessages && (
            <div className="errors">
              {
                Object.keys(registerErrorMessages).map(key => (
                  <ul key={key}>
                    {registerErrorMessages[key].map(msg => <li key={msg}>{msg}</li>)}
                  </ul>
                ))
              }
            </div>
          )
        }
        <label htmlFor="username">Name</label>
        <input type="text" className="form__item" id="username" value={name} onChange={handleOnChangeName}/>
        <label htmlFor="email">Email</label>
        <input type="text" className="form__item" id="email" value={email} onChange={handleOnChangeEmail}/>
        <label htmlFor="password">Password</label>
        <input type="password" className="form__item" id="password" value={password} onChange={handleOnChangePassword}/>
        <label htmlFor="password-confirmation">Password (confirm)</label>
        <input type="password" className="form__item" id="password-confirmation" value={passwordConfirmation}
               onChange={handleOnChangePasswordConfirmation}/>
        <div className="form__button">
          <button type="submit" className="button button--inverse" onClick={handleOnClick}>register</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
