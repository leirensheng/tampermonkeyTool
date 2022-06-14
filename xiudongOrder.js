// ==UserScript==
// @name         秀动订单页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wap.showstart.com/pages/order/activity/confirm/confirm?sequence=175938&ticketId=59c288a4572e9b9f07ce868e266cb06f&ticketNum=1
// @match        https://wap.showstart.com/pages/order/activity/confirm/confirm?sequence=175826&ticketId=51f1af9e3feb0feaf8a0079e0924a4e4&ticketNum=1
// @match        https://wap.showstart.com/pages/order/activity/confirm/confirm?sequence=175827&ticketId=1163535ac5adc6836f9f84045b1f8b67&ticketNum=1
// @match        https://wap.showstart.com/pages/order/activity/confirm/confirm?sequence=176266&ticketId=585fa11c89d5102365f0f7c6e6f30338&ticketNum=1

// @icon         https://www.google.com/s2/favicons?sz=64&domain=showstart.com
// @grant        GM_xmlhttpRequest
// @require      file://D:\油猴\tampermonkeyTool\xiudongOrder.js
// ==/UserScript==

let userIndex = 1
let target = document.querySelector("body");
let $ = (val) => document.querySelector(val);
let $$ = (val) => document.querySelectorAll(val);

let sendMsg = () => {
  GM_xmlhttpRequest({
    method: "GET",
    url: "http://www.pushplus.plus/send?token=ff7273be19b84a01b99f47cedbfb8694&title=chromePiao&&content=chromePiao",
  });
};

let sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
let isOk = false;
let clickBtn;
let step = 0;

let startClick = async () => {
  if (!isOk) {
    $(".payBtn").click();
    await sleep(200);
    return startClick();
  }
};

let observe = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    let target = $(".viewerTotal");
    if (step === 1 && target) {
      console.group();
      console.log(target.innerText);
      console.log(mutation.type, mutation.target, mutation);
      if (mutation.type === "childList" && mutation.addedNodes.length) {
        console.log({ addClassName: mutation.addedNodes[0].className });
      }
      console.groupEnd();
    }

    if (
      step === 0 &&
      mutation.removedNodes.length &&
      mutation.removedNodes[0].tagName === "UNI-TOAST"
    ) {
      let target = $(".payBtn");
      console.log("--------toast消失了--------", target.innerText);

      if (target.innerText === "已售罄") {
        window.location.reload();
      } else {
        console.log("有票", $(".rr"));
        if ($(".rr").innerText === "观演人") {
          $(".rr").click();
          step = 1;
        } else {
          $(".payBtn").click();
          observe.disconnect();
        }
      }
    }
    if (
      step === 1 &&
      mutation.addedNodes.length &&
      mutation.addedNodes[0].className === "list-wrap"
    ) {
      $$(".uni-label-pointer")[0].click();
      $(".pop-head").children[userIndex].click();
      step = 2;
      startObserveAndClick();
      observe.disconnect();
    }
  }
});

observe.observe(target, {
  childList: true,
  subtree: true,
});

let startObserveAndClick = async () => {
  let isOk = false;
  let target = document.querySelector("body");
  let observe = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      let target = $(".pay-pop-head");
      if (target) {
        isOk = true;
        observe.disconnect();
        sendMsg();
      }
    }
  });
  observe.observe(target, {
    childList: true,
    subtree: true,
  });

  while (!isOk) {
    $(".payBtn").click();
    await sleep(200);
  }
};
