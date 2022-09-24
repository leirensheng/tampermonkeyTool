
let startOrder = async () => {
    let name = "章瑞莹";
    let city = "江西南昌";
    let code = "360425200506031021";
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

      location.reload()
      return
    } else {
      console.log("按钮可以点击");
      sendMsg('HasTicket')
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
            setTimeout(()=>{
              try{
                let isSuccess = $('iframe').contentWindow.document.body.innerText.includes('下单成功')
                if(isSuccess){
                  sendMsg('ticketSuccess')
                }
              }catch(e){
                console.log(e)
              }
            },2000)
          }
        }
      }
    });
  
    observe.observe(target, { attributes: true, childList: true, subtree: true });
  };
  
  let sendMsg = (content) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `http://wxpusher.zjiecode.com/api/send/message/?appToken=AT_s8ql37DbRNkrItpYhUK60xNNTeNE3ekp&content=${content}&uid=UID_ZFqEpe7kmm27SJ466yXdnbeWyIgL&url=http%3a%2f%2fwxpusher.zjiecode.com`,
        onload: function (response) {
          //这里写处理函数
        }
      })
    }

    startOrder()