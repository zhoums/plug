import config from '../js/config'
import {getConfig} from './api/spider.api'

chrome.cookies.set({
    url:'https://we.taobao.com/',
    name: config.checkPlugCookie,
    value: "check-plug-cookie-val",
},function(){})
//https://sycm.taobao.com/custom/menu/getPersonalView.json


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.cmd== "mycmd"){
        let apiList = await getConfig();
        console.log('apiList',apiList,apiList.result,getConfig())
        //返回到前端
        sendResponse({farewell: "I'm contentscript,goodbye!"});

    }
});