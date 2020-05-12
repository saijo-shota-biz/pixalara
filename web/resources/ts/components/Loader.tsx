import React from "react";

const Loader = ({ children = "Loading" }) => {
  return (
    <div className="loader">
      <p className="loading__text">
        { children }
      </p>
      <div className="loader__item loader__item--heart">
        <div></div>
      </div>
    </div>
  );
}

export default Loader;
