(async function () {
  let sleep = (time) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  let $ = (val) => document.querySelector(val);
  let waitForSelectorAndClick = async (val,noClick) => {
    await sleep(200);
    if (!$(val)) {
      await waitForSelectorAndClick(val);
    } else if (!noClick) {
      $(val).click();
    }
  };

  let waitForSelector2AndClick = async (val) => {
    await sleep(200);
    let dom = document
      .querySelector("#tdialog-simple-iframe")
      .contentWindow.document.querySelector(val);
    if (!dom) {
      await waitForSelector2AndClick(val);
    } else {
      dom.click();
    }
  };

  await waitForSelectorAndClick(".status-field", true);
  let btn = document.querySelector("button");
  btn.innerHTML = "修复";
  btn.onclick = async () => {
    await waitForSelectorAndClick(".status-field");

    await waitForSelector2AndClick(".div-status #status_resolved[data-comment]");


    await waitForSelector2AndClick(
      `[data-field-name="resolution"] .dk_select.dk_cover`
    );

    await waitForSelector2AndClick('.dk_select  [title="已修改"]');

  };

  $(".status-field").parentElement.appendChild(btn);

  // await sleep(1000)
})();
