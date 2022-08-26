// ==UserScript==
// @name         tampermonkey-starter
// @namespace    http://tampermonkey.net/
// @version      0.2.5
// @description  tampermonkey 脚本初始化脚手架
// @author       maqibin
// @match        https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// ==/UserScript==

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.css";

const rootElement = document.createElement("div");
document.body.appendChild(rootElement);

const root = createRoot(rootElement);

root.render(<App />);
