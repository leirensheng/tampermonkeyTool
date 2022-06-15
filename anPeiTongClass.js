// ==UserScript==
// @name         安培通
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.aqlearn.com/pc/pages/course/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aqlearn.com
// @grant        none
// @require      file://D:\油猴\tampermonkeyTool\anPeiTongClass.js
// ==/UserScript==

let sectionName = "登高架设作业初训";
let sleepTime = 3000;

let sleep = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
let $ = (val) => document.querySelector(val);
let $$ = (val) => document.querySelectorAll(val);

(() => {
  let startClickPicture = async () => {
    $("#next").click();
    await sleep(sleepTime);
    if (checkClass()) {
      return await startClickPicture();
    }
  };

  let checkClass = () => {
    let bigWrapChildren = [...$("#planTemp").children];
    let allSections = [...$$(".plan__name--active")].filter(
      (one) => one.className === "plan__name--active"
    );
    let targetSectionIndex = allSections.findIndex((one) => {
      let titleName =
        one.querySelector(".name__size") &&
        one.querySelector(".name__size").innerText.trim();
      console.log(titleName);
      return titleName === sectionName;
    });
    let targetSection = allSections[targetSectionIndex];

    console.log("-------开始部分------------", targetSection);
    let nextSection;
    if (targetSectionIndex !== allSections.length - 1) {
      nextSection = allSections[targetSectionIndex + 1];
    }
    console.log("-------下部分------------", nextSection);

    let startIndex = bigWrapChildren.indexOf(targetSection);
    let endIndex = nextSection
      ? bigWrapChildren.indexOf(nextSection) - 1
      : bigWrapChildren.length - 1;

    console.log(startIndex, endIndex);
    let allChap = [];
    for (let i = startIndex; i <= endIndex; i++) {
      let dom = bigWrapChildren[i];
      if (dom.className === "plan__chapt") {
        allChap.push(dom);
      }
    }

    console.log("======章节========");
    console.log(allChap);

    let all = [];
    allChap.forEach((chap) => {
      let curAll = [
        ...chap.querySelectorAll(".chapt__list .chapt__item"),
      ].filter((one) => one.querySelector(".btn__group").innerText !== "已学");
      all = [...all, ...curAll];
    });
    if (!all.length) {
      alert("全部学完");
      return false;
    }
    console.log("======课程========");
    
    console.log(all.map((one) => one.innerText));
    return all;
  };
  let start = async () => {
    await sleep(5000);
    let all = checkClass();
    if (!all) {
      return;
    }

    let firstOne = all[0];
    firstOne.scrollIntoView();
    firstOne.querySelector(".btn__group span").click();
    await sleep(1000);

    let video = $("video");
    if (video) {
      video.muted = true;
      video.addEventListener("play", () => {
        console.log("播放");
      });
      video.addEventListener("ended", async () => {
        console.log("結束");
        window.location.reload();
      });
      video.addEventListener("pause", async () => {
        console.log("暂停");
      });
      video.play();
    } else {
      console.log("不是视频来的");
      startClickPicture();
    }
  };

  console.log(111, start);
  start();
})();
