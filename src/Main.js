import React from "react";
import { useSelector } from "react-redux";
import Routes from "./routes";

function Main() {
  const theme = useSelector((state) => state.profile.theme);

  return (
    <div>
      <Routes />
    </div>
  );
}

export default Main;
