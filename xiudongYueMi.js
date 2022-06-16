// ==UserScript==
// @name         乐迷
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wap.showstart.com/pages/activity/detail/detail?activityId=175827
// @match        https://wap.showstart.com/pages/activity/detail/detail?activityId=175826
// @match        https://wap.showstart.com/pages/activity/detail/detail?activityId=176017
// @icon         https://www.google.com/s2/favicons?sz=64&domain=showstart.com
// @grant        GM_xmlhttpRequest
// @connect      www.pushplus.plus
// @require      file://D:\油猴\tampermonkeyTool\xiudongYueMi.js
// ==/UserScript==

let sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
let $ = (val) => document.querySelector(val);
let $$ = (val) => document.querySelectorAll(val);
let sendMsg = (msg) => {
  GM_xmlhttpRequest({
    method: "GET",
    url: `http://www.pushplus.plus/send?token=ff7273be19b84a01b99f47cedbfb8694&title=${msg}&&content=${msg}${Math.random()}`,
  });
};

let check = () => {
  console.log("check");
  let tickets = [...$$(".ticket-list .list-item")];
  let target = tickets.find((one) => {
    let text = one.querySelector(".item-content").innerText;
    return text.includes("乐迷")||text.includes('紧张');
  });
  return target;
};

let start = async () => {
  let target = check();
  if (!target) {
    await sleep(3000);
    $(".close img").click();
    await sleep(3000);
    $("#btnOther").click();
  }else{
    let ticketType = target.querySelector('.item-head .name').innerText
    let ticketName = $('.activity-info .h1').innerText
    sendMsg(ticketType+ticketName)
    setTimeout(async()=>{
        $(".close img").click();
        await sleep(3000);
        $("#btnOther").click();
    },60000)
  }
};

(async () => {

  let observe = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "attributes") {
        let target = mutation.target;
        if (
          target.className === "uni-popup uni-popup-bottom uni-popup-insert" &&
          target.style.display !== "none"
        ) {
          start();
        }
      }
    }
  });

  observe.observe(document.querySelector("body"), {
    attributes: true,
    childList: true,
    subtree: true,
  });
})();
