import React from "react";
import { useRoutes } from "hookrouter";
import routes from "../lib/routes";

import NavBar from "./NavBar";

export default function App() {
  const routeResult = useRoutes(routes);

  return (
    <div>
      <NavBar />
      {routeResult || <h1>I think we took a wrong turn...</h1>}
    </div>
  );
}
