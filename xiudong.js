// ==UserScript==
// @name         buy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://wap.showstart.com/pages/activity/detail/*
// @match        https://wap.showstart.com/pages/order/activity/list/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=showstart.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  let type = 3;
  let keyword = "湿地";
  let targetId = "172472";

  let $ = (val) => document.querySelector(val);
  let $$ = (val) => document.querySelectorAll(val);
  let getAddClass = (mutation) => mutation.addedNodes[0].className;

  let startBuy = () => {
    let step = 0;
    let target = document.querySelector("body");
    let startTime = Date.now();

    let checkPeople = () => {
      let target = $(".content .info-list:nth-child(2)");
      let isOk = !(target && target.innerText.includes("请选择"));
      if (!isOk) {
        target.querySelector(".tips").click();
        step = 5;
      }
      return isOk;
    };

    let clickPay = () => {
      console.log("===============点击提交订单=================");
      $(".payBtn").click();
      let time = Date.now() - startTime;
      console.log(`===============用时：${time}=================`);
      setTimeout(() => {
        observe.disconnect();
        window.location.replace(
          "https://wap.showstart.com/pages/order/activity/list/list"
        );
      }, 500);
    };

    let observe = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        // 找到出现时间
        // if (step >= 4) {
        //   console.group();
        //   console.log(mutation.type, mutation.target, mutation);
        //   if (mutation.type === "childList" && mutation.addedNodes.length) {
        //     console.log({ addClassName: mutation.addedNodes[0].className });
        //   }
        //   console.groupEnd();
        // }
        if (mutation.type === "childList") {
          let addedNodes = mutation.addedNodes;
          if (!addedNodes.length) return;
          // let addClassName = addedNodes[0].className;

          if (
            step === 0 &&
            getAddClass(mutation) === "shopping-bar bottom-bar"
          ) {
            $(".bottom-bar");
            $("#btnOther").click();
            console.log("========点击了立即购票了=========================");
            step = 1;
          } else if (step === 2 && getAddClass(mutation) === "bar bottom-bar") {
            let btnTarget = $(".uni-popup-insert .btn");
            console.log(
              `========按钮名称：${btnTarget.innerText}=========================`
            );
            if (!["即将开售", "APP开票提醒"].includes(btnTarget.innerText)) {
              console.log("========开售时间已经到了=========================");
              if (btnTarget.innerText === "APP缺票登记") {
                window.location.reload();
                return;
              }
              if (type !== 0) {
                console.log(
                  "========试试点击立即购买========================="
                );
              } else {
                console.log("========点击立即购买=========================");
              }
              btnTarget.click();
              step = 3;
            } else {
              window.location.reload();
              return;
            }
          } else if (step === 3 && getAddClass(mutation) === "footer-bar") {
            step = 4;
          } else if (step === 5 && getAddClass(mutation) === "list-wrap") {
            $(".uni-checkbox-wrapper").click();
            $(".pop-head uni-view:nth-child(2)").click();
            clickPay();
          }
        } else if (mutation.type === "attributes") {
          if (
            step === 1 &&
            mutation.target.className ===
              "uni-body pages-activity-detail-detail"
          ) {
            if (type !== 0) {
              $$(".ticket-list .list-item")[type].click();
            }
            console.log("========票类型选择好了=========================");
            step = 2;
          }
          if (
            step === 3 &&
            mutation.target.className === "btn appbuy blackBtn"
          ) {
            console.log("========按钮变黑，重新加载=========================");
            window.location.reload();
          }
          if (
            step === 4 &&
            mutation.attributeName === "class" &&
            mutation.target.tagName === "UNI-TOAST"
          ) {
            if ($(".payBtn") && $(".payBtn").innerText.length > 6) {
              let isOk = checkPeople();
              console.log(`===============是否有人: ${isOk}=================`);
              if (isOk) {
                clickPay();
              }
            }
          }
        }
      }
    });

    observe.observe(target, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  };

  let startList = () => {
    let target = document.querySelector("body");
    let observe = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        // 找到出现时间
        // if (true) {
        //   console.group();
        //   console.log(mutation.type, mutation.target, mutation);
        //   if (mutation.type === "childList" && mutation.addedNodes.length) {
        //     console.log({ addClassName: mutation.addedNodes[0].className });
        //   }
        //   console.groupEnd();
        // }
        if (mutation.type === "childList") {
          let { addedNodes } = mutation;
          if (!addedNodes.length) return;
          let addClassName = addedNodes[0].className;
          if (addClassName === "order-list") {
            let firstOne = $(".g-name") && $(".g-name").innerText;
            console.log(firstOne);
            if (firstOne && firstOne.includes(keyword)) {
              return;
            }
            let url = `https://wap.showstart.com/pages/activity/detail/detail?activityId=${targetId}`;
            window.location.replace(url);
          }
        }
      }
    });
    observe.observe(target, {
      attributes: true,
      childList: true,
      subtree: true,
    });
  };
  let map = new Map([
    [/detail\?activityId=/, startBuy],
    [/order\/activity\/list/, startList],
  ]);

  console.log("==============");
  for (let [key, value] of map) {
    if (key.test(location.href)) {
      value();
      break;
    }
  }
})();
