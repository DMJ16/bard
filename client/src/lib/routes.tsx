import React from "react";
import HomePage from "../components/HomePage";
import Bard from "../components/Bard";
import CreateUri from "../components/CreateUri";
import HasUri from "../components/HasUri";
import Mint from "../components/Mint";
import FAQ from "../components/FAQ";

const routes = {
  "/": () => <HomePage />,
  "/bard": () => <Bard />,
  "/bard/create_uri": () => <CreateUri />,
  "/bard/has_uri": () => <HasUri />,
  "/mint": () => <Mint />,
  "/faq": () => <FAQ />,
};

export default routes;
