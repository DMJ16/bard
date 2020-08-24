import React from "react";
import HomePage from "../components/HomePage";
import DeployBard from "../components/DeployBard";

const routes = {
  "/": () => <HomePage />,
  "/composebard*": () => <DeployBard />,
};

export default routes;
