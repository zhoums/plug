import config from './config'
import util from './util'


let frontEndHost = "";
let moli_host = "";

if(process.env.NODE_ENV == "local"){
    moli_host = config.backEndHost_dev
    // frontEndHost = config.frontEndHost_dev
    frontEndHost = config.tbPlatform;
}else if(process.env.NODE_ENV == "production"){
    moli_host = config.backEndHost_pro
    // frontEndHost = config.frontEndHost_pro
    frontEndHost = config.tbPlatform
}

chrome.cookies.set({
    url: frontEndHost,
    name: config.checkPlugCookie,
    value: "check-plug-cookie-val",
}, function () {
})

//提前获取config内容
let configRes = null;


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    //提前获取config内容
    if(request.greeting == "triggerConfig") {
        util.$http('GET', `${moli_host}/spider/config.wb?${request.head}&version=1.0`)
            .then(function (data) {
                configRes = data;
            });
    }

    //返回已经取得的config结果configRes
    if (request.greeting == "fetchConfig") {
        //向前content返回消息
        sendResponse(configRes);
    }

    //触发回填数据
    if (request.greeting == "post2moli") {
        let _par = request.data
        if(request['header']['Content-Type']){
            _par = JSON.stringify(_par)
        }
        $.ajax({
            url: request.url,
            type: 'POST',
            headers: request.header,
            data: _par,
            success: function (res) {
                console.log(res);
            }
        })
        //向前content返回消息
        sendResponse({post2moli: 'post2moli'});
    }
});

