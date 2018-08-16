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
    });


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting == "oiu") {
        sendResponse(oi);
    }

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
                console.log('postres', res);
            }
        })
        sendResponse({post2moli: 'post2moli'});
    }
});

