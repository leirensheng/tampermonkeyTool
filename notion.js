// ==UserScript==
// @name         notion 正文文本内容获取
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  notion 正文文本内容获取!
// @author       You
// @include        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?domain=notion.so
// @grant        GM_setClipboard
// @license MIT
// ==/UserScript==

(async function () {
  "use strict";
  let $ = (val) => document.querySelector(val);

  function sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  async function waitForInnerText(val) {
    let dom = document.querySelector(val);
    if (dom) {
      let text = dom.innerText;
      if (text.length > 100) {
        return dom;
      } else {
        await sleep(500);
        return waitForInnerText(val);
      }
    } else {
      await sleep(1000);
      return waitForInnerText(val);
    }
  }

  async  function waitForContentNoGrow(dom){
      let preLength = dom.innerText.length
      await sleep(1000)
      if(dom.innerText.length === preLength) return
      await waitForContentNoGrow(dom)
  }



  let selector = "#notion-app  .notion-page-content";



  let contentDom = await waitForInnerText(selector);


  let target = document.querySelector(selector);
  let observe = new MutationObserver( (mu, ob)=> {
      let text = contentDom.innerText;
      console.clear()
      console.log(text);
      GM_setClipboard(text);
  })
  observe.observe(target, { attributes: true, childList: true, subtree: true });

})();