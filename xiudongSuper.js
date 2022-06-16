// ==UserScript==
// @name         秀动订单页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wap.showstart.com/pages/order/activity/confirm/confirm?sequence=175938&ticketId=59c288a4572e9b9f07ce868e266cb06f&ticketNum=1
// @match        https://wap.showstart.com/pages/order/activity/confirm/confirm?sequence=175826&ticketId=51f1af9e3feb0feaf8a0079e0924a4e4&ticketNum=1
// @match       https://wap.showstart.com/pages/order/activity/confirm/confirm?sequence=175827&ticketId=1163535ac5adc6836f9f84045b1f8b67&ticketNum=1
// @match       https://wap.showstart.com/pages/order/activity/confirm/confirm?sequence=175828&ticketId=a323be612b45c7eb2bf622214d1ca9d2&ticketNum=1


// @icon         https://www.google.com/s2/favicons?sz=64&domain=showstart.com
// @grant        GM_xmlhttpRequest
// ==/UserScript==

let sleep = (time) =>
    new Promise((resolve) => {
        setTimeout(resolve, time);
    });
let $ = (val) => document.querySelector(val);
let sendMsg = () => {
    GM_xmlhttpRequest({
      method: "GET",
      url: "http://www.pushplus.plus/send?token=ff7273be19b84a01b99f47cedbfb8694&title=PiaoSuccess&&content=PiaoSuccess"+Math.random(),
    });
  };
  sendMsg()
  return
(async () => {
    'use strict';
    await sleep(5000)

    while (!$(".pay-pop-head")) {
        $('.payBtn').click()
        await sleep(950)
    }
    sendMsg()
})();