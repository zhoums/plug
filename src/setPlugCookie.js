import config from '../js/config'
import util from './util'

const moli_host = config.backEndHost;

chrome.cookies.set({
    url: config.platform,
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

