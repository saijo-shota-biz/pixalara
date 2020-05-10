import React, {useCallback, useState} from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const Login = () => {

  const [tab, setTab] = useState(1);

  return (
    <div className="container--small">
      <ul className="tab">
        <li
          className={`tab__item ${tab === 1 ? "tab__item--active" : ""}`}
          onClick={() => setTab(1)}
        >Login
        </li>
        <li
          className={`tab__item ${tab === 2 ? "tab__item--active" : ""}`}
          onClick={() => setTab(2)}
        >Register
        </li>
      </ul>
      {
        tab === 1 ? <LoginForm/>
          : tab === 2 ? <RegisterForm/>
          : <></>
      }
    </div>
  );
}

export default Login;
