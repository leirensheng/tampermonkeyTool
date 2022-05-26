// ==UserScript==
// @name         buy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wap.showstart.com/pages/activity/detail/detail?activityId=173051
// @icon         https://www.google.com/s2/favicons?sz=64&domain=showstart.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  let typeOrder = 1;
  let timeOrder = 1;

  let $ = (val) => document.querySelector(val);
  let step = 0;
  $(".sku-content-detail").click();
  step = 1;

  let target = document.querySelector("body");
  let observe = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        let addedNodes = mutation.addedNodes;
        if (!addedNodes.length) return;
        if (addedNodes.length && step === 2) {
          console.log(mutation.addedNodes[0]);
        }

        let addClassName = addedNodes[0].className;
        // console.log(addClassName);
        if (
          addClassName === "sku-content height-threshold wd-popup-scrollable"
        ) {
          let target = $(`.sku-row section li:nth-child(${timeOrder})`);
          target.click();
          $(`.sku-row:nth-child(2) li:nth-child(${typeOrder})`).click();
          $(".footer-buy-now").click();
          step = 2;
        }
      }
    }
  });

  observe.observe(target, { attributes: true, childList: true, subtree: true });
})();
