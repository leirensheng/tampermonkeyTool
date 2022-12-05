// ==UserScript==
// @name         跳中间页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FRedJue%2Fweb-terminal
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    let sleep = (time = 5000 + Math.random() * 5000) =>
      new Promise((resolve) => {
        setTimeout(resolve, time);
      });
  
    let $ = (val) => document.querySelector(val);
    let $$ = (val) => document.querySelectorAll(val);
 
  let startJuejin = ()=>{
    let url = location.href.match(/target=(.*$)/)[1]
    console.log(url)
    location.replace(decodeURIComponent(url))
  }
    let map = new Map([
      [/link\.juejin/, startJuejin],
    ]);
  
    for (let [key, value] of map) {
      if (key.test(location.href)) {
        value();
      }
    }
  })();
  