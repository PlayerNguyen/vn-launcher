import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./../Index.css";

console.log(`Loading React`);

const renderElement = document.getElementById("app");
if (renderElement === null) {
  throw new Error(`Unable to find #app from callee html file`);
}

createRoot(renderElement).render(<App />);
