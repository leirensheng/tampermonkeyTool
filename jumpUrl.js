// ==UserScript==
// @name         jumpUrl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://g.vovososo.com/jump.html?url=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vovososo.com
// @grant        none
// ==/UserScript==

(async () => {
  "use strict";
  let $ = (val) => document.querySelector(val);
  let target = $("#btn2");
  target.removeAttribute("disabled");
  target.click();
})();
