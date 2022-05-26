(function () {
  let name = "";
  let city = "";
  let code = "";
  let $ = (val) => document.querySelector(val);
  let sleep = (val) => new Promise((resolve) => setTimeout(resolve, val));
  let setInputValue = (selector, val) => {
    let dom = document.querySelector(selector);
    if (!dom) return;
    dom.value = val;
    dom.dispatchEvent(new Event("input"));
    dom.dispatchEvent(new Event("blur"));
  };
  let buyBtn = $("#pay_btn>span");

  if (buyBtn.classList.contains("submit_bottom_cannot")) {
    console.log("不能买");
    history.back();
  } else {
    console.log("按钮可以点击");
  }

  let target = document.querySelector("body");
  let observe = new MutationObserver(async (mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === "childList") {
        let addedNodes = mutation.addedNodes;
        if (!addedNodes.length) return;
        if (addedNodes.length) {
          console.log(mutation.addedNodes[0]);
        }

        let addClassName = addedNodes[0].className;
        console.log(addClassName);
        if (addClassName === "custom content") {
          setInputValue("[placeholder=请填写身份证号]", code);
          setInputValue("[placeholder=请填写姓名]", name);
          setInputValue("[placeholder^=请填写来自哪个省]", city);

          await sleep(100);
          $("#pay_btn>span").click();
          await sleep(100);
          $("#pay_btn>span").click();
          await sleep(100);
          $("#pay_btn>span").click();
        }
      }
    }
  });

  observe.observe(target, { attributes: true, childList: true, subtree: true });
})();
