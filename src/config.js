let config ={
    checkPlugCookie:"check-plug-cookie",//检测是否安装插件的cookie名称，值在代码中写

    tbPlatform:'https://we.taobao.com/',//需要抓取数据的淘宝页面域名

    backEndHost_dev:'http://molitest.willbe.net.cn/spider',//DEV 用于接收数据的后台接口域名
    frontEndHost_dev:'http://molitest.willbe.net.cn/spider',//DEV 需要触发爬数据的前台域名

    backEndHost_pro:'http://molitest.willbe.net.cn/spider',//PRO 用于接收数据的后台接口域名
    frontEndHost_pro:'http://molitest.willbe.net.cn/spider',//PRO 需要触发爬数据的前台域名
}

export default config;