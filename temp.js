(function() {
    'use strict';

function doExchange(arr, depth,results,result)
{
    for (var i = 0; i < arr[depth].length; i++) {
        result[depth] = arr[depth][i]
        if (depth != arr.length - 1) {
            doExchange(arr, depth + 1,results,result)
        } else {
            results.push(result.join('|'))
        }
    }
    return results
}

function getAllTimes(arr)
{
    let results = [];
   let  result = [];
    return doExchange(arr, 0,results,result);
}




    let $$ = (val) => document.querySelectorAll(val);
    let cwid =new URLSearchParams(location.search).get('cwid')





    let curConfig= GM_getValue(cwid)||{titles:[],allTimes:[],wrongArr:[]}

    console.log(111,curConfig)

        if(location.href.indexOf("exam_result")!==-1){
        let isFail = $("input[value=重新考试]")
      if(isFail){
          curConfig.wrongArr.push(curConfig.temp)
          isFail.click()
      }
        return
    }

    let doms = [...$$('tbody>tr[align=left]')]
    let all
    let initOrder = ()=>{
      curConfig.titles= doms.map(one=> one.querySelector('.tablestyle').innerText)
      curConfig.options= doms.map(one=> [...one.querySelectorAll('table:nth-child(2) label')].map((_,i)=>i))
      curConfig.allTimes=  getAllTimes(curConfig.options)
    }

    if(!curConfig.allTimes.length){
        initOrder()
    }



    for(let one of curConfig.allTimes.filter(one=> !curConfig.wrongArr.includes(one))){
        let cur = one.split("|")
        console.log('测试'+one)
        cur.forEach((order,index)=>{
           let curTitle = curConfig.titles[index]
           let target =  doms.find(_=>_.querySelector('td table:first-child').innerText===curTitle)
           console.log(curTitle,target,doms)
           let curLabel =  [...target.querySelectorAll('table:nth-child(2) label')][order]
           curLabel.click()
        })
       curConfig.temp = cur

     GM_setValue(cwid,curConfig)

       $("[name=btn_submit]").click()


    }




   console.log(curConfig)






    // Your code here...
})();