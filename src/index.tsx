import * as React from "react";
import { render } from "react-dom";
import RCTreeDemo from "./rc-tree-demo";

import "./styles.css";

function App() {
  return (
    <div className="App">
      <RCTreeDemo />
    </div>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
