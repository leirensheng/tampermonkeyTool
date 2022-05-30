// ==UserScript==
// @name         YixueMain
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://cme22.91huayi.com/pages/course.aspx?cid=*
// @match        http://cme22.91huayi.com/pages/exam.aspx?cwid=*
// @match        http://cme22.91huayi.com/pages/exam_result.aspx?cwid=*
// @match        http://cme22.91huayi.com/course_ware/course_ware_polyv.aspx?cwid=*
// @match        http://cme23.91huayi.com/pages/course.aspx?cid=*
// @match        http://cme23.91huayi.com/pages/exam.aspx?cwid=*
// @match        http://cme23.91huayi.com/pages/exam_result.aspx?cwid=*
// @match        http://cme23.91huayi.com/course_ware/course_ware_polyv.aspx?cwid=*
// @match        http://cme24.91huayi.com/pages/course.aspx?cid=*
// @match        http://cme24.91huayi.com/pages/exam.aspx?cwid=*
// @match        http://cme24.91huayi.com/pages/exam_result.aspx?cwid=*
// @match        http://cme24.91huayi.com/course_ware/course_ware_polyv.aspx?cwid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91huayi.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  let sleep = (time = 5000 + Math.random() * 5000) =>
    new Promise((resolve) => {
      setTimeout(resolve, time);
    });

  let $ = (val) => document.querySelector(val);
  let $$ = (val) => document.querySelectorAll(val);

  let startList = async () => {
    await sleep();
    let allCourses = [...$$(".course")];
    console.log(allCourses);
    let target = allCourses.find(
      (one) =>
        one.querySelector("img").getAttribute("src") ===
        "../course_ware/images/anniu_01a.gif"
    );
    if (!target) {
      let isWatching = JSON.parse(localStorage.getItem("isWatching") || "[]");
      target = allCourses.find(
        (one) =>
          !isWatching.includes(one.querySelector("strong").innerText) &&
          one.querySelector("img").getAttribute("src") ===
            "../course_ware/images/pic_studing.gif"
      );
    }
    console.log("target", target);

    target.querySelector("strong").click();
    target.querySelector("strong").dispatchEvent(new Event("click"));
    await sleep();
  };

  let startVideo = async () => {
    let title = $("#jxmb").innerText.trim();
    let isWatching = JSON.parse(localStorage.getItem("isWatching") || "[]");
    let toStore = [...new Set([...isWatching, title])];
    localStorage.setItem("isWatching", JSON.stringify(toStore));
    let cwid = new URLSearchParams(location.search).get("cwid");

    let body = document.querySelector("body");
    body.click();
    body.dispatchEvent(new Event("click"));
    console.log(111, $(".pv-icon-btn-play"));

    await sleep(5000);
    let video = $("video");

    let removeWatching = () => {
      let isWatching = JSON.parse(localStorage.getItem("isWatching"));
      let toStore = isWatching.filter((one) => one !== title);
      localStorage.setItem("isWatching", JSON.stringify(toStore));
    };

    window.addEventListener("beforeunload", removeWatching);
    video.addEventListener("play", () => {
      console.log("播放");
    });
    video.addEventListener("ended", async () => {
      console.log("結束");
      removeWatching();
      toTest();
    });
    video.addEventListener("pause", async () => {
      console.log("暂停");
      answerOne();
    });
    video.muted = true;
    video.play();

    await sleep(1000);
    video.play();
    await sleep(1000);
    video.play();

    let toTest = async () => {
      $(".videolist .bnt1_0").click();
      await sleep();
      let testName = $("#jxmb").innerText;
      localStorage.setItem(cwid, testName);
      $(".r_bnt a:nth-child(2)").click();
    };

    let answerOne = async () => {
      // if(!$(".pv-ask-modal-answer")) return

      let labels = [...$$(".pv-ask-right label")];
      if (!labels) return;

      let ask = $(".pv-ask-right h3").innerText;
      if (!map[ask]) {
        map[ask] = [];
      }

      for (let one of labels) {
        let answer = one.innerText.replace(/\w/, "");
        if (!map[ask].includes(answer)) {
          one.click();
          await sleep();
          $(".pv-ask-foot button[data-type=pvSubmit]").click();
          await sleep();
          let footBtn = $(".pv-ask-modal-answer .pv-ask-foot button");
          console.log(footBtn.innerText);

          if (footBtn && footBtn.innerText === "再看一次") {
            map[ask].push(answer);
          }
          await sleep();

          footBtn.click();
          return;
        }
      }
    };
    // };

    let map = {};
  };
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
        2023: "B",
        "2022年度公需": "A",
        "2022年广东公需": "B",
        是否: "A",
      },
      "2. 数字经济助力“双循环”新发展格局": {
        我国国民经济: "A",
        第二次信息革: "B",
        数字: "A",
        迎接: "A",
      },
      "3.对数字经济的理论认识": {
        数字经济体系: "B",
        现时代: "A",
        数字产业化: "B",
        第十四个: "B",
        数字经济: "A",
        到2025年: "A",
      },
      "4.我国数字经济发展情况": {
        三次产业: "B",
        "2020年产业数": "A",
      },
      "5.广东省数字经济发展情况": {
        "2021年": "A",
        数字经济: "A",
        推动: "A",
        广东省: "A",
        预期: "B",
        深入: "B",
      },
      "6.数字化转型的由来和概念缘起": {
        当前产业周期: "A",
        "2021年": "B",
        下列: "E",
        从布局: "A",
        数据: "E",
        数字: "E",
        一级: "A",
      },
      "7.数字化引领治理现代化的作用机理": {
        数字产业化: "A",
        目前是: "B",
        "（）是数字经济": "B",
        "（）数字化": "C",
        平台: "B",
        根据: "C",
        "对（）": "A",
      },
      "8.数字化转型的一般性框架": {
        十四五愿景: "A",
        数据要素: "A",
        大数据: "A",
        全国: "B",
        目前: "D",
        数字: "A",
        下一步: "B",
      },
      "9.数据要素和算力的内涵与空间意义": {
        数字经济: "A",
        "“东数西算”": "A",
        "“东数西算”中的“数”": "A",
        "“东数西算”中的“算”": "B",
        数字经济中: "A",
        "“东数西算”是": "A",
        "“东数西算”中利用": "A",
        数据: "A",
      },
      "10.数字经济时代基础设施的空间演变": {
        老基建与新基建: "B",
        以下: "A",
        "“东数西算”采取": "B",
        数字: "A",
        东数西算现有: "B",
        "“东数西算”的空间": "D",
      },
      "11.东数西算对地方经济发展的影响": {
        "“东数西算”": "A",
        东数西算对西部: "D",
        以下: "E",
        "“东数西算”对全国": "E",
        "“东数西算”未来": "D",
        "“东数西算”有助于": "A",
      },
      "12.数字经济概述": {
        数字技术: "A",
        数字经济: "A",
        "2022年": "D",
        对应: "C",
        "数字经济的“四化”": "E",
        数字经济产业链: "E",
        以下: "C",
      },
      "13.产业数字化转型": {
        数字化转型: "A",
        传统数字化: "B",
        以下哪项不是数字化: "A",
        数字化转型实施: "A",
        以下哪项不是敏捷式: "D",
        数字化转型是一件: "A",
      },
      "14.数字化转型方法": {
        虚拟人: "B",
        元宇宙: "A",
        区块链: "A",
        以下: "C",
        元宇宙是一个: "A",
        元宇宙的核心: "E",
        元宇宙中的虚拟人: "C",
      },
      "15.敏捷式转型实践": {
        我国: "B",
        元宇宙: "A",
        元宇宙的典型: "E",
        产业: "A",
        元宇宙作为: "C",
        随着: "D",
        以下: "B",
      },
      "16.创新与数字化转型": {
        过去的时代: "A",
        创新的认知: "A",
        数字化转型: "A",
        数据: "B",
        释放: "A",
        在数字: "A",
        数字: "B",
        零售: "E",
      },
      "17.数字化转型的现状及趋势": {
        释放数据: "A",
        创新: "E",
        数字化资源: "B",
        数字化转型: "A",
        数字化包括: "A",
        数据: "E",
      },
      "18.可持续创新绩效评价体系": {
        绩效评价: "B",
        美的数字化: "A",
        交互: "C",
        以下: "D",
        美的: "E",
        绩效: "B",
        全面: "D",
      },
      "19.制造业数字化转型背景": {
        为了摆脱: "B",
        数字化转型: "B",
        "21世纪": "A",
        "2020年": "A",
      },
      "20.数字化转型核心技术": {
        智能工厂规划的步骤是: "C",
        数字化工厂: "A",
        智能工厂规划: "C",
        智能工厂的关键: "A",
        数字化转型: "D",
        智能柔性: "D",
      },
      "21.数字化转型典型应用场景": {
        游标卡尺: "A",
        下列属于APS: "D",
        数字化: "B",
        下列不属于智能: "D",
        智能: "B",
        下列不属于数字: "D",
      },
      "22.数字化转型发展趋势": {
        为了实现: "B",
        数字化工厂: "A",
        MES: "C",
        工业: "C",
        数字孪生: "A",
        算法: "B",
      },
      "23.数字基础设施之工业互联网标识解析体系，促进行业数字化转型": {
        "2020年": "A",
        "21世纪": "A",
        数字化转型: "B",
        我国: "B",
        数字经济体系: "C",
        把握: "C",
        数字经济成为: "A",
      },
      "24.数字基础设施之工业互联网平台，促进区域数字化转型": {
        德国工业: "A",
        我国: "D",
        工业互联网: "B",
        工业互联网标识: "D",
        工业互联网的三大: "D",
        日本: "D",
      },
      "25.数字基础设施之工业区块链，促进产业数字化转型": {
        制造业: "A",
        区块链技术: "D",
        目前: "B",
        区块链不是: "A",
        区块链适用: "A",
        区域: "B",
      },
      "26.个人信息保护法的立法目的": {
        中华人民: "B",
        个人信息: "A",
      },
      "27.个人信息域外效力及核心原则": {
        网络安全: "A",
        个人信息: "A",
      },
      "28.个人信息跨境提供的规则": {
        任何国家: "A",
        任何组织: "A",
      },
      "29.数字化转型中的法律法规概述": {
        数据安全法: "A",
        个人信息: "B",
        下列属于地方性: "B",
        下列不属于敏感: "D",
        数字经济的内涵: "A",
        数字经济的概念: "B",
      },
      "30.重点法律法规条款介绍与案例分析": {
        网络安全法: "B",
        出口: "B",
        "下列不属于《数据安全法》": "C",
        "下列不属于《网络安全法》": "D",
        "《个人信息保护法》": "B",
      },
      "31.《个人信息保护法》": {
        个人要求: "B",
        个人信息: "A",
        "《个人信息保护法》": "B",
        下列: "B",
        处理: "B",
        个人信息处理者: "B",
      },
      "32.《广东省数字经济促进条例》": {
        广东省: "A",
        "《广东省数字经济促进条例》规定的内容": "D",
        徐玉玉: "C",
        "《广东省数字经济促进条例》规定的保障": "D",
        "《广东省数字经济促进条例》包括": "D",
        "《数字经济促进条例》规定对新技术": "A",
      },
    };
    let cwid = new URLSearchParams(location.search).get("cwid");
    console.log(cwid);

    let title = localStorage.getItem(cwid);

    let keys = Object.keys(obj);
    let value;
    for (let key of keys) {
      if (key.includes(title)) {
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
    [/course\.aspx/, startList],
    [/exam_result\.aspx/, startTestRes],
    [/course_ware_polyv\.aspx/, startVideo],
    [/exam\.aspx/, startTest],
  ]);

  for (let [key, value] of map) {
    if (key.test(location.href)) {
      value();
    }
  }
})();
