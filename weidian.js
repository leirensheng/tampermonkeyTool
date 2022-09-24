
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
  let name = "章瑞莹";
  let city = "江西南昌";
  let code = "360425200506031021";
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
    sendMsg('HasTicket')
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
          setTimeout(()=>{
            try{
              let isSuccess = $('iframe').contentWindow.document.body.innerText.includes('下单成功')
              if(isSuccess){
                sendMsg('ticketSuccess'+'17370812005')
              }
            }catch(e){
              console.log(e)
            }
          },2000)
        }
      }
    }
  });

  observe.observe(target, { attributes: true, childList: true, subtree: true });
};

let sendMsg = (content) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: `http://wxpusher.zjiecode.com/api/send/message/?appToken=AT_s8ql37DbRNkrItpYhUK60xNNTeNE3ekp&content=${content}&uid=UID_ZFqEpe7kmm27SJ466yXdnbeWyIgL&url=http%3a%2f%2fwxpusher.zjiecode.com`,
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
        // if (addedNodes.length && step === 2) {
        //   console.log(mutation.addedNodes[0]);
        // }

        let addClassName = addedNodes[0].className;
        console.log(addClassName);
        if (
          addClassName === "sku-content height-threshold"
        ) {
          let target = $(`.sku-row section li:nth-child(${timeOrder})`);
          console.log('target',target)

          if (target.getAttribute("disabled") === "disabled") {
            location.reload();
            return;
          }
          target.click();
          let targetType = $(
            `.sku-row:nth-child(2) li:nth-child(${typeOrder})`
          );
          console.log('targetType',targetType)
          let hasOne = targetType.getAttribute("disabled") !== "disabled"
          if(!hasOne){
            location.reload();
            return;
          }
          targetType.click()
          $(".footer-buy-now").click();
          step = 2;
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
