// ==UserScript==
// @name         秀动订单页Super
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
// @connect      www.pushplus.plus
// ==/UserScript==

let sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
let $ = (val) => document.querySelector(val);
let sendMsg = (content) => {
  GM_xmlhttpRequest({
    method: "GET",
    url:
      "http://wxpusher.zjiecode.com/api/send/message/?appToken=AT_s8ql37DbRNkrItpYhUK60xNNTeNE3ekp&uid=UID_ZFqEpe7kmm27SJ466yXdnbeWyIgL&url=http%3a%2f%2fwxpusher.zjiecode.com&content=" +
      content +
      Math.random(),
  });
};
let palyMusic = ()=>{
    let src="https://webfs.ali.kugou.com/202206161708/75cd8ee5dbf1d84cf988799afc6bb6b6/part/0/960121/KGTX/CLTX001/clip_283069dee017c99f49df574a977451a0.mp3"
    let audio =  new Audio(src)
    audio.play()
}

(async () => {
  "use strict";
  await sleep(5000);

  while (!$(".pay-pop-head")) {
    $(".payBtn").click();
    await sleep(950);
  }
  let target = $(".info-base .name").innerText;
  let realName = $('.viewer-list .name').innerText
  let nickname = window.nameMap[realName]
  sendMsg(`【${target}】${realName}_${nickname}`);
  palyMusic()
})();
