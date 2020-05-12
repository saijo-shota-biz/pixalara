import React from "react";
import {useSelector} from "react-redux";
import {messageSelector} from "../store/message";

const Message = () => {

  const message = useSelector(messageSelector);

  return message ? (
    <div className="message">
      {message}
    </div>
  ) : (
    <></>
  )
}

export default Message;
