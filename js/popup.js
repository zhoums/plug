$(function(){
    $("#ck").on("click",e => {
        alert('#ck')
        var bg = chrome.extension.getBackgroundPage();
        bg.setBegin();
    })
})