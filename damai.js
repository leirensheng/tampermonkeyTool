// ==UserScript==
// @name         大麦
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.damai.cn/damai/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=damai.cn
// @grant        none
// @require       file://D:\tampermonkeyTool\damai.js

// ==/UserScript==

(function () {
  "use strict";
  let dateOrder = 0;
  let typeOrder = 0;

  let $ = (val) => document.querySelector(val);
  let $$ = (val) => document.querySelectorAll(val);
  let getAddClass = (mutation) => mutation.addedNodes[0].className;

  let startBuy = () => {
    let step = 0;
    let target = document.querySelector("body");
    // $(".buy__button__text").click();
    let chooseTick = (isFirst) => {
        console.log(isFirst)
      // let addedNodes = mutation.addedNodes;
      let target= $$(".date-section:nth-child(3) .item-text")[typeOrder]
      console.log(target)
    //   console.log(target.innerText)
    //   if(target.innerText.includes('缺货')){
    //       window.location.reload()
    //       return
    //   }
    //   target.click();
    //   console.log("===== 点击票类型 ============");
    //   step = 3;
    };

    let observe = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        console.log(step);
        // 找到出现时间
        let condition = $(".date-section:nth-child(3) .item-text");
        if (step === 2) {
          console.group();
            console.log(condition);
          console.log(mutation.type, mutation.target, mutation);
          if (mutation.type === "childList" && mutation.addedNodes.length) {
            console.log({ addClassName: mutation.addedNodes[0].className });
          }
          console.groupEnd();
        }

        if (mutation.type === "childList") {
          if (!mutation.addedNodes.length) return;
          if (step === 0 && getAddClass(mutation) === "top-container") {
            $(".buy__button").click();
            step = 1;
          }
          if (step === 1 && getAddClass(mutation) === "prop") {
            let dates = $$(".date-section:nth-child(2)  .item-text");
            if (dates.length === 1) {
              step = 2;
            } else {
              let date = dates[dateOrder];
              date.click();
              step = 2;
            }

            console.log("===== 点击日期 ============");
            if ($(".date-section:nth-child(3) .prop-item")) {
              console.log("可以选票");
              chooseTick(true);
            }
          }
          if (step === 2 && getAddClass(mutation) === "prop") {
            chooseTick();
          }
          if (step === 3 && getAddClass(mutation) === "price-detail-item") {
            $(".price-button .button").click();
            step = 4;
          }
        }
      }
    });

    observe.observe(target, {
        attributes: true,
      childList: true,
      subtree: true,
    });
  };

  let map = new Map([
    [/item\.html\?itemId=/, startBuy],
    // [/order\/activity\/list/, startList],
  ]);

  for (let [key, value] of map) {
    if (key.test(location.href)) {
      value();
    }
  }
  // Your code here...
})();
