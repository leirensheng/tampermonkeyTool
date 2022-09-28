// ==UserScript==
// @name         谷歌镜像
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://g.vovososo.com/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vovososo.com
// @grant        none
// @run-at       document-body
// ==/UserScript==

(async function () {
  console.time();
  let selector = "[data-hveid=CCEQAA]";

  let $ = (val) => document.querySelector(val);
  let $$ = (val) => [...document.querySelectorAll(val)];

  let waitForCondition = (conditionFn, timeout) =>
    new Promise((resolve) => {
      let res = conditionFn();
      let isOk = (res) => (Array.isArray(res) ? res.length : res);
      if (isOk(res)) {
        resolve(res);
        return;
      } else {
        let observe = new MutationObserver((mutationsList) => {
          for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
              console.log(document.readyState, conditionFn);
              //   let addedNodes = mutation.addedNodes;
              //   if (!addedNodes.length) return;
              res = conditionFn();
              if (isOk(res)) {
                resolve(res);
                observe.disconnect();
                break;
              }
            }
          }
        });
        observe.observe($("body"), {
          attributes: true,
          childList: true,
          subtree: true,
        });
        if (timeout) {
          setTimeout(() => {
            resolve();
            observe.disconnect();
          }, timeout);
        }
      }
    });

  let dom = await waitForCondition(() => $(selector));
  dom.parentElement.removeChild(dom);

  function getQueryVariable(url, variable) {
    var query = url.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return false;
  }

  await waitForCondition(
    () =>
      $$("a[role=presentation]").length >= 6 ||
      ["complete", "interactive"].includes(document.readyState),
    1000
  );

  let res = $$("a[role=presentation]");
  console.log("目标个数", res);
  res.forEach((one) => {
    // console.log(one.href);
    one.setAttribute("target", "_blank");
    let oldUrl = getQueryVariable(new URL(one.href), "url");
    // console.log("oldUrl", oldUrl);
    if (oldUrl) {
      let realUrl = atob(oldUrl);
      //   console.log(realUrl);
      one.href = realUrl;
    }
  });
  console.timeEnd();
})();
