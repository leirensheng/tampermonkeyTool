// ==UserScript==
// @name         干部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.jlgbjy.gov.cn/student/clazz!main.action?clazz.id=170
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jlgbjy.gov.cn
// @grant        none
// @require      file://D:\tampermonkeyTool\ganbu.js
// ==/UserScript==

(function () {
  "use strict";
  let $ = (val) => document.querySelector(val);
  let $$ = (val) => document.querySelectorAll(val);
  let sleep = (time) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  let startList = async () => {
    await sleep(2000)
    let allRows = $$(".centerTable tr:nth-child(4n)");
    for (let one of allRows) {
      let progress = one.querySelector(".jindu_bfs").innerText;
      console.log(progress);
      if (progress !== "100.0%") {
        one.querySelector("a").click();
        await sleep(3000)
        window.close();
        break;
      }
    }
  };
  let startIframe1 = async () => {
    let src = $("iframe").src;
    window.location.replace(src);
  };
  let startIframe2 = () => {
    let src = $("iframe").src;
    window.location.replace(src);
  };

  let startPlay = async () => {
    await sleep(1000);
    let video = $("video");
    video.muted = true;

    $(".user_choise").click();
    document.body.style.background = "red";


    $("video").addEventListener("play", () => {
      console.log("播放");
      document.body.style.background = "green";
    });
    $("video").addEventListener("ended", async () => {
      console.log("結束");

      window.location.replace(
        "https://www.jlgbjy.gov.cn/student/training_class!courseList.action?clazz.id=971"
      );
      // window.location.reload()
    });
    $("video").addEventListener("pause", async () => {
      console.log("暂停");
    });
  };
  let map = new Map([
    [/clazz\.id=/, startList],
    [/play\.action\?id=/, startIframe1],
    [/play\.html\?param=/, startIframe2],
    [/course/, startPlay],
  ]);

  for (let [key, value] of map) {
    if (key.test(location.href)) {
      console.log("mathc");
      value();
      break;
    }
  }
  // Your code here...
})();
