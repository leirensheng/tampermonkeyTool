// ==UserScript==
// @name         autoClass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://eduv.hbyihua.cn/index/course/play/id/*/classroomId/*.html
// @match        http://eduv.hbyihua.cn/index/course/play/id/*/classroomId/*.html
// @icon         http://www.google.com/s2/favicons?sz=64&domain=hbyihua.cn
// @grant        none
// ==/UserScript==

(() => {
  let start = async () => {
    let sleep = (time) =>
      new Promise((resolve) => {
        setTimeout(resolve, time);
      });
    let $ = (val) => document.querySelector(val);
    let $$ = (val) => document.querySelectorAll(val);

    let waitForSelector = async (val) => {
      await sleep(1000);
      if (!$(val)) {
        await waitForSelector(val);
      }
    };

    let playBtnSelector = "[data-title=点击播放]";
    let allClass = [...$$(".chapter-box .keshi")];

    let getCurIndex = () => {
      let curActive = $(".chapter-box .keshi.active");
      let i = allClass.indexOf(curActive);
      return i;
    };

    let isShowPlay = $(playBtnSelector).style.display === "block";
    await sleep(1000);
    if (isShowPlay) {
      $(".live_leftbox").style.backgroundColor = "red";
    }

    let video = $("video");

    video.addEventListener("play", () => {
      console.log("播放");
      $(".live_leftbox").style.backgroundColor = "green";
    });
    video.addEventListener("ended", async () => {
      console.log("結束");
      let curIndex = getCurIndex();
      console.log("当前项目", curIndex);
      let nextIndex = curIndex + 1;
      if (nextIndex <= allClass.length - 1) {
        allClass[nextIndex].querySelector("a").click();
        await sleep(1000);
        window.location.reload();
      }
    });
  };

  start();
})();
