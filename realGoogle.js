// ==UserScript==
// @name         谷歌镜像
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://g.vovososo.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vovososo.com
// @grant        none
// @run-at       document-body
// ==/UserScript==

(async function () {
    console.time();
  
    let $$ = (val) => [...document.querySelectorAll(val)];

  
    let res = $$(".MjjYud a");
    console.log("目标个数", res);
    res.forEach((one) => {
      console.log(one.href)
      one.setAttribute("target", "_blank");
    });
    console.timeEnd();
  })();
  