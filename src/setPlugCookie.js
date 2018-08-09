import config from '../js/config'
import util from './util'

const moli_host = 'http://molitest.willbe.net.cn/editor';

chrome.cookies.set({
    url:'https://we.taobao.com/',
    name: config.checkPlugCookie,
    value: "check-plug-cookie-val",
},function(){})
//https://sycm.taobao.com/custom/menu/getPersonalView.json


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.cmd== "mycmd"){
        let apiList = await util.$http('GET',`${moli_host}/spider/config.wb?version=1.0`);
        console.log('apiList',apiList,apiList.result)
        //返回到前端
        sendResponse({farewell: "I'm contentscript,goodbye!"});

    }
});