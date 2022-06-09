
// ==UserScript==
// @name         微店
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match         https://shop967587296.v.weidian.com/item.html?itemID=*&spider_token=*
// @match         https://weidian.com/buy/add-order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=showstart.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

let startOrder = async () => {
  let name = "葛绍敏";
  let city = "安徽合肥";
  let code = "34240120000401494X";
  let $ = (val) => document.querySelector(val);
  let sleep = (val) => new Promise((resolve) => setTimeout(resolve, val));
  let setInputValue = (selector, val) => {
    let dom = document.querySelector(selector);
    if (!dom) return;
    dom.value = val;
    dom.dispatchEvent(new Event("input"));
    dom.dispatchEvent(new Event("blur"));
  };
  let buyBtn = $("#pay_btn>span");

  if (buyBtn.classList.contains("submit_bottom_cannot")) {
    console.log("不能买");
    history.back();
  } else {
    console.log("按钮可以点击");
  }

  let target = document.querySelector("body");
  let observe = new MutationObserver(async (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        let addedNodes = mutation.addedNodes;
        if (!addedNodes.length) return;
        if (addedNodes.length) {
          console.log(mutation.addedNodes[0]);
        }

        let addClassName = addedNodes[0].className;
        console.log(addClassName);
        if (addClassName === "custom content") {
          setInputValue("[placeholder=请填写身份证号]", code);
          setInputValue("[placeholder=请填写姓名]", name);
          setInputValue("[placeholder^=请填写来自哪个省]", city);

          await sleep(100);
          $("#pay_btn>span").click();
          await sleep(100);
          $("#pay_btn>span").click();
          await sleep(100);
          $("#pay_btn>span").click();
        }
      }
    }
  });

  observe.observe(target, { attributes: true, childList: true, subtree: true });
};

let sendMsg = () => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://www.pushplus.plus/send?token=ff7273be19b84a01b99f47cedbfb8694&title=PIAO&&content=PIAO',
      onload: function (response) {
        //这里写处理函数
      }
    })
  }

let startItem = async () => {
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

          if (target.getAttribute("disabled") === "disabled") {
            location.reload();
            return;
          }
          target.click();
          let targetType = $(
            `.sku-row:nth-child(2) li:nth-child(${typeOrder})`
          );

          let hasOne = false
          if (targetType.get.getAttribute("disabled") === "disabled") {
             targetType = $(`.sku-row:nth-child(2) li:nth-child(${0})`);
             hasOne =  targetType.get.getAttribute("disabled") !== "disabled"
          }else{
              hasOne = true
          }
          if(!hasOne){
            location.reload();
            return; 
          }
          targetType.click()
          $(".footer-buy-now").click();
        //   sendMsg()
          step = 2;
        //   sendMsg()
        }
      }
    }
  });

  observe.observe(target, { attributes: true, childList: true, subtree: true });
};

let map = new Map([
  [/item\.html/, startItem],
  [/add\-order/, startOrder],
]);

for (let [key, value] of map) {
  if (key.test(location.href)) {
    value();
  }
}
