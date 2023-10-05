/* eslint-disable @typescript-eslint/ban-types */
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";

const app = React.createElement(App);
ReactDOM.createRoot(document.getElementById("root")).render(app);
