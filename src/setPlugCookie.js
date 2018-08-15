import config from '../js/config'
import util from './util'

const moli_host = 'http://molitest.willbe.net.cn/spider';

chrome.cookies.set({
    url: 'https://we.taobao.com/',
    name: config.checkPlugCookie,
    value: "check-plug-cookie-val",
}, function () {
})

let oi = null;
util.$http('GET', `${moli_host}/spider/config.wb?tk=10000&darenId=45522&version=1.0`)
    .then(function (data) {
        oi = data;
        // sendResponse({dksk:'jfdslafjds'});
    });


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('request-request',request)
    if (request.greeting == "oiu") {
        sendResponse(oi);
    }
    if (request.greeting == "post2moli") {
        $.ajax({
            url: request.url,
            type: 'POST',
            headers: request.header,
            data: request.data,
            success: function (res) {
                console.log('postres', res);
            }
        })
        sendResponse({post2moli: 'post2moli'});
    }
});


let setCookie = function () {
    chrome.cookies.set({
        url: 'https://we.taobao.com/',
        name: config.checkPlugCookie,
        value: "check-plug-cookie-val",
    }, function () {
    })
}

//https://sycm.taobao.com/custom/menu/getPersonalView.json


let setBegin = function setBegin() {
    chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
        if (request.cmd == "mycmd") {
            let apiList = await util.$http('GET', `${moli_host}/spider/config.wb?version=1.0`);
            console.log('apiList', apiList, apiList.result)
            //返回到前端
            sendResponse(apiList.result);

        }
    });
}
