
  let startTestRes = async () => {
    await sleep();
    let cwid = new URLSearchParams(location.search).get("cwid");

    let isOk = $(".case4 b").innerText === "考试通过！";
    console.log(isOk);
    if (isOk) {
      localStorage.removeItem(cwid);
      await sleep();
      window.location.replace(
        "http://cme22.91huayi.com/pages/course.aspx?cid=4223a775-5cce-4dad-b62c-01146f705c7f"
      );
    }
  };
  let startTest = async () => {
    let obj = {
      "1. 2022年卫生健康行业公需科目学习问答": {
        "2023年4月30日之后2022年度公需科目是否还可以补学？": "B",
        "2022年度公需科目的学习是否有时间限制？": "A",
        "2022年广东公需科目有2个专题《数字化转型与产业创新发展》和《碳达峰、碳中和的实现路径与广东探索》都需要学习完成吗？": "B",
        "是否需要在广东省专业技术人员继续教育管理系统中进行注册？": "A",
      },
    };
    let cwid = new URLSearchParams(location.search).get("cwid");
    console.log(cwid);

    let title = localStorage.getItem(cwid);

    let keys = Object.keys(obj).sort((a,b)=>b.length -a.length);
    let value;
    for (let key of keys) {
      let temp =/^\d+\.(.*)/.exec(key)[1]
      if (temp.trim()===title.trim()) {
        value = obj[key];
        break;
      }
    }

    let doms = [...$$("tbody>tr[align=left]")];

    let askArr = Object.keys(value);

    await sleep();
    for (let one of doms) {
      let ask = one.querySelector("td table:first-child").innerText;
      let targetSimpleAsk = askArr.find((simpleAsk) => ask.includes(simpleAsk));
      let answer = value[targetSimpleAsk];
      console.log(answer);
      let labelDoms = [...one.querySelectorAll("table:nth-child(2) label")];
      let targetLableDom = labelDoms.find(
        (_) => _.innerText.indexOf(answer) === 0
      );
      targetLableDom.click();
      await sleep();
    }

    await sleep(10000);
    $("[name=btn_submit]").click();
  };

let map = new Map([
  [/exam_result\.aspx/, startTestRes],
  [/exam\.aspx/, startTest],
]);

for (let [key, value] of map) {
  if (key.test(location.href)) {
    value();
  }
}
