import React from "react";
import HomePage from "../components/HomePage";
import DeployBard from "../components/DeployBard";
import Mint from "../components/Mint";
import FAQ from "../components/FAQ";

const routes = {
  "/": () => <HomePage />,
  "/composebard": () => <DeployBard />,
  "/composebard/createuri": () => <DeployBard />,
  "/composebard/hasuri": () => <DeployBard />,
  "/mint*": () => <Mint />,
  "/faq": () => <FAQ />,
};

export default routes;
