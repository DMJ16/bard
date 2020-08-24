import React, { useState, useEffect } from "react";
import { useRoutes } from "hookrouter";
import routes from "../lib/routes";

export default function App() {
  const routeResult = useRoutes(routes);

  return <div>{routeResult || <h1>I think we're lost...</h1>}</div>;
}
