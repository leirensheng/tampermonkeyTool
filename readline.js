const readline = require('readline')
const fs= require('fs')
const rl = readline.createInterface({
    input: fs.createReadStream('./file.txt'),
    output: process.stdout,
    terminal:false
})
let obj = {}
let curTitle
rl.on('line',line=>{
    console.log(line)
    if(!line)return
    if(/^\d+\./.test(line)){
        obj[line]={}
        curTitle=line
    }else{
        let [key,value]= line.split('：').map(one=> one.replace(/\(|\)/,''))
        obj[curTitle][key]=value
    }
})
rl.on('close',()=>{
    fs.writeFileSync('./a.json',JSON.stringify(obj,4,null))
})


 