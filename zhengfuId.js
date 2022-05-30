// ==UserScript==
// @name         zhengfu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://zfsg.gd.gov.cn/aqpxpt/course/detail/*
// @match        https://zfsg.gd.gov.cn/aqpxpt/course/index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gd.gov.cn
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const limitLength = 6;
  let sleep = (time = 5000 + Math.random() * 5000) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    });

  let $ = (val) => document.querySelector(val);
  let $$ = (val) => document.querySelectorAll(val);
  let startVideo = async () => {
    console.log("startVideo");
    await sleep(2000);
    let title = document
      .querySelector(".zhangName")
      .innerText.split(/第\d+章:/)[1]
      .trim();

    let id = location.href.match(/\d+$/)[0];
    let idTitleMap = JSON.parse(localStorage.getItem("idTitleMap") || "{}");
    let titleMap = JSON.parse(localStorage.getItem("titleMap") || "{}");
    if (idTitleMap[id]) {
      let listTitle = idTitleMap[id];
      if (listTitle !== title) {
        titleMap[title] = listTitle;
        title = listTitle;
      }else{
        delete idTitleMap[id]
      }
      localStorage.setItem("idTitleMap", JSON.stringify(titleMap));
    } else if (titleMap[title]) {
      title = titleMap[title];
    }

    let checkIsCanWatch = () => {
      let isOk = !$(".courseLists ul li").innerText.includes("录制中");
      if (!isOk) {
        let hasOk = JSON.parse(localStorage.getItem("hasOk") || "[]");
        let toStore = [...new Set([...hasOk, title])];
        localStorage.setItem("hasOk", JSON.stringify(toStore));
      }
      return isOk;
    };
    if (!checkIsCanWatch()) {
      window.close();
      return;
    }
    let allClass = [...$$(".courseLists ul li")];

    let index = allClass.findIndex(
      (one) => one.className === "current-section"
    );

    let isLastClass = index === allClass.length - 1;
    let isFull =
      allClass[index].querySelector("span:nth-child(2)").innerText === "100%";
    console.log({ isFull });

    if (isFull && !isLastClass) {
      let next = index + 1;
      while (
        allClass[next].querySelector("span:nth-child(2)").innerText === "100%"
      ) {
        next++;
      }
      allClass[next].querySelector("a").click();
    }

    console.log({ isLastClass });

    console.log({ title });
    let isWatching = JSON.parse(localStorage.getItem("isWatching") || "[]");
    let toStore = [...new Set([...isWatching, title])];
    localStorage.setItem("isWatching", JSON.stringify(toStore));

    let removeWatching = () => {
      let isWatching = JSON.parse(localStorage.getItem("isWatching"));
      let toStore = isWatching.filter((one) => one !== title);
      localStorage.setItem("isWatching", JSON.stringify(toStore));
    };

    window.addEventListener("beforeunload", removeWatching);

    let video = $("video");

    video.addEventListener("play", () => {
      console.log("播放");
    });
    video.addEventListener("ended", async () => {
      console.log("結束");
      if (isLastClass) {
        window.open("https://zfsg.gd.gov.cn/aqpxpt/course/index");
        window.close();
      }
    });
    video.addEventListener("pause", async () => {
      if (
        isLastClass &&
        ["auto", "100%"].includes($(".prism-progress-cursor").style.left)
      ) {
        window.open("https://zfsg.gd.gov.cn/aqpxpt/course/index");
        window.close();
      }
      console.log("暂停");
    });
    await sleep(2000);
    video.muted = true;
    video.play();
    await sleep(2000);
    video.playbackRate = 2;
  };

  let startList = async () => {
    let getId = (dom) => dom.querySelector("a").href.match(/\d+$/)[0];

    let saveIdTitleMap = (dom, title) => {
      let id = getId(dom);
      let storeData = JSON.parse(localStorage.getItem("idTitleMap") || "{}");
      storeData[id] = title;
      localStorage.setItem("idTitleMap", JSON.stringify(storeData));
    };
    let start = async () => {
      await sleep(1000);
      let all = [...$$(".course_list li")];

      let pages = [...$$(".el-pager .number")];
      let curPage = $(".el-pager .number.active");
      let curPageIndex = pages.indexOf(curPage);

      let oKList = all.filter((one) => one.innerText.includes("已学完"));
      let hasOkTitles = oKList.map(
        (one) => one.querySelector(".course_txt").innerText
      );
      let storeTitles = JSON.parse(localStorage.getItem("hasOk") || "[]");
      let toStore = [...new Set([...storeTitles, ...hasOkTitles])];
      localStorage.setItem("hasOk", JSON.stringify(toStore));

      let isWatching = JSON.parse(localStorage.getItem("isWatching") || "[]");
      let needToClick = [];
      console.log({ all });

      for (let one of all) {
        let curTitleDom = one.querySelector(".course_txt");
        let curTitle = curTitleDom.innerText.trim();

        if (!toStore.includes(curTitle) && !isWatching.includes(curTitle)) {
          needToClick.push(one);
        }
      }

      let nextPage = async () => {
        if (curPageIndex + 1 <= pages.length) {
          pages[curPageIndex + 1].click();
          await start();
        }
      };

      if (needToClick.length === 0) {
        await nextPage();
      } else {
        for (let one of needToClick) {
          let curTitleDom = one.querySelector(".course_txt");
          let curTitle = curTitleDom.innerText.trim();
          let isWatchingLength = JSON.parse(
            localStorage.getItem("isWatching") || "[]"
          ).length;

          if (isWatchingLength < limitLength) {
            console.log("click", curTitle);
            curTitleDom.click();
            saveIdTitleMap(one, curTitle);
            await sleep(10000);
          }
        }
        await sleep(10000);

        let isWatchingLength = JSON.parse(
          localStorage.getItem("isWatching") || "[]"
        ).length;
        if (isWatchingLength < limitLength) {
          await nextPage();
        }

        window.close();
      }
    };

    start();
  };

  let map = new Map([
    [/detail/, startVideo],
    [/course\/index/, startList],
  ]);

  for (let [key, value] of map) {
    if (key.test(location.href)) {
      value();
    }
  }
})();
