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
  let $ = (val) => document.querySelector(val);
  let step = 0;
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

        if (addClassName === "shopping-bar bottom-bar") {
          $(".bottom-bar");
          $("#btnOther").click();
          step = 1;
        } else if (addClassName === "bar bottom-bar" && step === 1) {
          let target = $(".uni-popup-insert .btn");
          if (target.innerText !== "即将开售") {
            console.log("点击购票");
            target.click();
            step = 2;
          } else {
            window.location.reload();
          }
        } else if (addClassName === "footer-bar" && step === 2) {
          step = 3;
        }
      } else if (mutation.type === "attributes" && step === 3) {
        $(".payBtn").click();
        setTimeout(() => {
          observe.disconnect();
        }, 500);
      }
    }
  });

  observe.observe(target, { attributes: true, childList: true, subtree: true });
})();
