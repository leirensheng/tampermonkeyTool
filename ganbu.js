// ==UserScript==
// @name        干部
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.jlgbjy.gov.cn/student/training_class!courseList.action?clazz.id=971
// @match        https://www.jlgbjy.gov.cn/portal/index!index.action
// @match        https://www.jlgbjy.gov.cn/portal/study!play.action?id=*
// @match         https://cdn.jlgbjy.gov.cn/play.html?*
// @match        https://cdn.jlgbjy.gov.cn/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jlgbjy.gov.cn
// @grant        none
// @require      file://D:\油猴\tampermonkeyTool\ganbu.js
// ==/UserScript==

(function () {
  "use strict";
  let name="7108242712"
  let password = 'abcd1234'
  let classListUrl = "https://www.jlgbjy.gov.cn/student/training_class!courseList.action?clazz.id=971"

  let $ = (val) => document.querySelector(val);
  let $$ = (val) => document.querySelectorAll(val);
  let sleep = (time) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  let toLogin = async ()=>{
    $('[placeholder="请输入用户名"]').value = name
    $('[placeholder="请输入密码"]').value = password
    $('[placeholder="请输入密码"]+div').click()
  } 
    
  let startList = async () => {
    await sleep(2000)
    let allRows = $$(".centerTable tr:nth-child(4n)");
    if(!allRows.length){
      toLogin()
      return
    }
    
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
        classListUrl
      );
      // window.location.reload()
    });
    $("video").addEventListener("pause", async () => {
      console.log("暂停");
    });
  };

  let toClassListPage = ()=>{
    window.location.replace(classListUrl)
  }
  let map = new Map([
    [/portal\/index!index\.action$/, toClassListPage],
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
