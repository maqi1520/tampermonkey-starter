// ==UserScript==
// @name         tampermonkey-starter
// @namespace    https://github.com/maqi1520/tampermonkey-starter
// @version      0.2.7
// @description  tampermonkey 脚本初始化脚手架
// @supportURL   https://github.com/maqi1520/tampermonkey-starter/issues
// @homepage     https://github.com/maqi1520/tampermonkey-starter
// @author       maqibin
// @match        https://www.baidu.com/
// @icon         https://www.baidu.com/favicon.ico
// @require      https://unpkg.com/react@18.2.0/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js
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
