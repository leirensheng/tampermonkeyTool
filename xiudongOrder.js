let target = document.querySelector("body");
let $ = (val) => document.querySelector(val);
let sleep = (time) =>
new Promise((resolve) => {
  setTimeout(resolve, time);
});
let isOk = false
let clickBtn 

let startClick =async ()=>{
    if(!isOk){
        $('.payBtn').click()
        await sleep(200)
        return startClick()
    }
}

let observe = new MutationObserver((mutationsList) => {
  for (let mutation of mutationsList) {
    // // 找到出现时间
    console.log(mutation)
    let target = $('.pay-pop-head')
    if (target) {
        isOk = true
    }
    if(!clickBtn){
        let clickBtn = $('.payBtn')&& $('.payBtn').innerText.length>'立即支付 ¥'.length
        console.log('1111')
        if(clickBtn){
            startClick()
        }
    }
  }
});

observe.observe(target, {
  childList: true,
  subtree: true,
});