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
        "2023年4月30日之后2022年度公需科目是否还可以补学？": "B",
        "2022年度公需科目的学习是否有时间限制？": "A",
        "2022年广东公需科目有2个专题《数字化转型与产业创新发展》和《碳达峰、碳中和的实现路径与广东探索》都需要学习完成吗？": "B",
        "是否需要在广东省专业技术人员继续教育管理系统中进行注册？": "A",
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
        "推动数字经济发展的重点方向包括加速数据要素价值化进程、推进实体经济数字化转型、着力提升产业基础能力、深化数字经济开放合作、强化数字经济治理能力": "A",
        "广东省数字经济发展规模领先其他省份，高达5.20万亿，且珠三角地区整体数字经济占GDP比重最高，达到46.9%": "A",
        "预期未来3-5年数字产业化规模依然占据主导地位，2020年产业数字化规模高达4万亿左右": "B",
        "深入实施数字中国发展战略，加快建设数字广东，全面推进经济社会各领域数字化转型发展，着力提升数字化生产力，充分发挥信息作为关键生产要素的重要价值，推动经济发展质量变革、效率变革和动力变革，建设全球领先的数字化发展高地": "B",
      },
      "6.数字化转型的由来和概念缘起": {
        "下列哪些选项为“新基建”的代表领域（ ）": "E",
        "从布局来看，（ ）仍是数据中心投资集中地，占总投资额的比重达到73.7%": "A",
        "数据中心是集（ ）三大要素于一身的数据基础设施": "D",
        "数字化转型的一般性框架是（ ）": "E",
        "一级节点是支撑大型城市群发展，满足中心节点数据传输需求（ ）": "A",
      },
      "7.数字化引领治理现代化的作用机理": {
        "（ ）是数字经济的核心，（ ）是数字经济发展的保障，（ ）是数字经济的发展的基础": "B",
        "（ ）数字化转型岗位占比提升最快": "C",
        "平台经济是以（ ）为核心": "B",
        "根据中国电子信息产业发展研究院发布数据（ ）省以总指数69.3居全国榜首": "C",
        "对（ ）经济增长的贡献率最高": "A",
      },
      "8.数字化转型的一般性框架": {
        "大数据交易的管理模式是会员制和注册制（ ）": "A",
        "全国1/3地方平台实现五级覆盖（ ）": "B",
        "目前，我国数字政府的发展处于（ ）": "D",
        "数字政府建设的核心目标是推进国家治理体系和治理能力现代化（ ）": "A",
        "下一步的下一步数字政府建设思路中的“三大融合”中不包括（ ）": "B",
      },
      "9.数据要素和算力的内涵与空间意义": {
        "“东数西算”中的“算”指的是（ ）": "B",
        "数字经济中的核心生产力是（ ）": "A",
        "“东数西算”是我国基于新一轮科技革命和产业变革的大背景提出的战略工程（ ）": "A",
        "“东数西算”中利用的西部优势资源主要是（ ）": "A",
        "数据是数字经济时代新的生产要素（ ）": "A",
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
        "东数西算对西部企业的影响包括（ ）": "D",
        "以下对加快构建“东数西算”一体化算力体系的建议有（ ）": "E",
        "“东数西算”对全国区域发展格局的意义有（ ）": "E",
        "“东数西算”未来面临的挑战有 （ ）": "D",
        "“东数西算”有助于促进我国区域平衡协调发展（ ）": "A",
      },
      "12.数字经济概述": {
        "2022年1月，《求是》刊发习总书记重要文章《不断做强做优做大我国数字经济》，点明数字经济三个重大意义和七点部署（ ）": "D",
        "对应《国民经济行业分类》，以下属于数字经济的分类的是（ ）": "C",
        "数字经济的“四化”框架包括哪些内容（ ）": "E",
        "数字经济产业链的上中下游包括哪些关键环节（ ）": "E",
        "以下不属于总书记关于“不断做强做优做大我国数字经济”的七点部署的是（ ）": "C",
      },
      "13.产业数字化转型": {
        "传统数字化转型相比敏捷式数字化转型，更适用于广大中小企业的数字化转型（ ）": "B",
        "以下哪项不是数字化成熟度评估德勤DMM模型关注的重点（ ）": "A",
        "数字化转型实施需进行近、中、远期规划，并循序渐进地提升数字化能力（ ）": "A",
        "以下哪项不是敏捷式数字化转型的益处（ ）": "D",
        "数字化转型是一件知易行难、持续不断的过程（ ）": "A",
      },
      "14.数字化转型方法": {
        "区块链应用到元宇宙中主要是，其有助于粘合元宇宙各技术系统，并提供价值交换的去中介信任保障（ ）": "A",
        "以下不属于数字孪生特征的是（ ）": "C",
        "元宇宙是一个实现虚拟与现实映射交互、构建一个能够产生超越现实世界的价值的数字宇宙（ ）": "A",
        "元宇宙的核心关键技术包括但不限于（ ）": "E",
        "元宇宙中的虚拟人按使用场景分类主要有（ ）": "C",
      },
      "15.敏捷式转型实践": {
        "元宇宙的典型应用场景包括但不限于（ ）": "E",
        "产业元宇宙将会成为元宇宙形态发展的必然趋势，为实体经济服务，将带来巨大的商业机会（ ）": "A",
        "元宇宙作为现有各种技术的组合和升级，被业界广泛誉为（ ）": "C",
        "随着元宇宙的爆发式发展，以下哪一年被称为“元宇宙元年”（ ）": "D",
        "以下哪一项技术为元宇宙提供了去中心化的清结算平台和价值传递机制（ ）": "B",
      },
      "16.创新与数字化转型": {
        "数据是继土地、劳动力、资本、技术之后的第五大生产要素，在数字化转型中起着重要作用但不是核心关键作用（ ）": "B",
        "释放数据价值的有效路径是（ ）": "A",
        "在数字银行业务办理平台化、一站式的基础上，银行业务综合化、智能化将是未来发展趋势（ ）": "A",
        "数字时代的生产要素包括土地、劳动、资本、技术（ ）": "B",
        "零售业经历的阶段包括（ ）": "E",
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
        "绩效评价方法中群体专家打分法易受数据本身影响（ ）": "B",
        "交互设计的大方向是（ ）": "C",
        "以下属于主观绩效评价方法的是（ ）": "D",
        "美的数字化战略方向包括（ ）": "E",
        "全面数字化和全面智能化是美的集团哪一年确定的核心战略（ ）": "D",
      },
      "19.制造业数字化转型背景": {
        为了摆脱: "B",
        数字化转型: "B",
        "21世纪": "A",
        "2020年": "A",
      },
      "20.数字化转型核心技术": {
        "智能工厂规划的步骤是（）": "C",
		"数字化工厂是一个迭代升级、不断演化的过程，在每一个周期告一段落的时候，需要对建设效果进行客观的评价（）": "A",
        "智能工厂的关键特征不包括（）": "A",
        "数字化转型的价值维度不包括（）": "D",
        "智能柔性化产线主要面向（）": "D",
      },
      "21.数字化转型典型应用场景": {
        "下列属于APS系统应用时需要考虑的要素不包括（）": "D",
        "数字化工厂物联网的关键技术包括（）①自动识别技术；②设备集成技术；③网络通信技术；④移动定位技术": "B",
        "下列不属于智能装备的是（）": "D",
        "智能调度是基于生产制造现场实时数据，动态生成最优调度指令，保障生产效率最大化，没必要与生产计划协同（）": "B",
        "下列不属于数字化生产管控平台建设目标的是（）": "D",
      },
      "22.数字化转型发展趋势": {
		"数字化工厂运营平台主要解决企业运营层面的数据管理和流程处理问题，例如ERP、SCM、CRM等系统（）": "A",
        "MES以订单角度出发对生产过程进行监控的表现形式是（）": "C",
        "工业大数据平台核心任务的是（）": "C",
        "数字孪生引擎主要包括数字孪生核心组件、实时数据驱动引擎、实时渲染引擎和可视化工具集（）": "A",
        "算法和模型是工业大数据平台两大核心，为了实现平台产业化，可以通过研发一种通用的算法模型解决不同企业定制需求（ ）": "B",
      },
      "23.数字基础设施之工业互联网标识解析体系，促进行业数字化转型": {
        "数字化转型将不会在( )等方面实现变革和重塑": "B",
        "我国数字经济规模已经跃居全球第一( )": "B",
        "数字经济体系的主要内容不包括( )": "C",
        "把握数字经济发展趋势和规律 推动我国数字经济健康发展”是( )十九届中央政治局第三十四次集体学习时提出的": "C",
        "数字经济成为推动国民经济持续稳定增长的关键动力，我国数字经济年均增长已经高于同期GDP( )": "A",
      },
      "24.数字基础设施之工业互联网平台，促进区域数字化转型": {
        "德国工业4.0首次提出的时间是（ ）": "A",
        "我国工业互联网标识解析体系的国家顶级节点位于北京、上海、广州、重庆以及（ ）": "D",
        "工业互联网标识数据采集需要的主动标识载体不包括（ ）": "D",
        "工业互联网的三大体系不包括（ ）": "D",
        "日本产业价值链促进联盟IVI的牵头企业不包括（ ）": "D",
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
        "《数据安全法》所说的数据是指任何以电子或者其他方式对信息的记录（ ）": "A",
        "下列属于地方性法规的是（ ）": "B",
        "下列不属于敏感个人信息的是（ ）": "D",
        "数字经济的内涵不包括（ ）": "A",
        "数字经济的概念不包含（ ）": "B",
      },
      "30.重点法律法规条款介绍与案例分析": {
        "下列不属于《数据安全法》规定的一般安全制度的是（ ）": "C",
        "下列不属于《网络安全法》规定的网络运营者一般安全保护义务的是（ ）": "D",
        "《个人信息保护法》规定的个人信息包括匿名化处理后的信息（ ）": "B",
      },
      "31.《个人信息保护法》": {
        "个人要求个人信息处理者对其个人信息处理规则进行解释说明的，如果解释说明涉及商业秘密的，个人信息处理者可以拒绝（ ）": "B",
        "《个人信息保护法》规定个人信息处理者不应当采取下列哪些措施确保个人信息处理活动符合法律、行政法规的规定，并防止未经授权的访问以及个人信息泄露、篡改、丢失（ ）": "B",
        "下列不属于《个人信息保护法》基本原则的是（ ）": "B",
        "处理个人信息侵害个人信息权益造成损害，个人信息处理者在以下什么情况下应当承担损害赔偿等侵权责任（ ）": "B",
		"个人信息处理者处理个人信息任何情况下都需要取得个人的同意（ ）": "B",
      },
      "32.《广东省数字经济促进条例》": {
        "《广东省数字经济促进条例》规定的内容包括（ ）": "D",
        "徐玉玉案反映了数字经济发展中的哪一组价值冲突（ ）": "C",
        "《广东省数字经济促进条例》规定的保障措施不包括（ ）": "D",
        "《广东省数字经济促进条例》包括下列哪些章节（ ）": "D",
        "《数字经济促进条例》规定对新技术、新产业、新业态、新模式等实行包容审慎监管（ ）": "A",
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
