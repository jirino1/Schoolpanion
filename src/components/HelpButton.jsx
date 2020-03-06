import React from "react";
import history from "../history";
const renderIcon = () => {
  return <i className="question icon"></i>;
};
const HelpButton = props => {
  return (
    <div
      className={props.icon ? "ui icon button" : "ui primary button"}
      onClick={() => {
        history.push("/help");
      }}
    >
      {props.icon ? renderIcon() : "Hilfe!"}
    </div>
  );
};
export default HelpButton;
