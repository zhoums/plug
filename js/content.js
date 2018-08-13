function fetchTBdata(urlList){
    //item
    console.log('urlList',urlList)
    $.each(urlList,function(id,item){
        console.log('item',item)
        var argument = item.apiMethod === "get" ? item.requestArgs[0].getArgs : item.requestArgs[0].postArgs;
        var search="?";
        for(var key in argument){
            if(search==="?"){
                search+=key+"="+argument[key];
            }else{
                search+="&"+key+"="+argument[key];
            }
        }
        search = search === "?" ? "" : search;
        console.log('test url',item.apiUrl ,search )
        var time = Math.random()*(90-13+1)+13;
        setTimeout(function () {
            console.log('===',item)
            $.ajax({
                url:item.apiUrl+search,
                type:item.apiMethod||'GET',
                success:function (data) {
                    var success_flag =item.succFlag.split(":")
                    console.log('success_flag',success_flag,data);
                    console.log('llllllll',data[success_flag[0]],success_flag[1])
                    //todo 这里不是所有都是在content有flag，flag应该固定在根目录
                    if(data[success_flag[0]].toString()==success_flag[1]) {
                        console.log(1,data)
                        var param = {};
                        //解析出每一个要传递到后台的参数
                        $.each(item.fields, function (index, field) {
                            if(field.dataRoot){
                                //这里不知有几层，暂时写死五层的情况
                                var level = field.dataRoot.split(".");
                                console.log('level',level);
                                var _feild = field.fields.split("|");
                                console.log('_feild',_feild)
                                if (field.dataType === "entity") {
                                    if(level.length==1){
                                        $.each(_feild,function(_id,_it){
                                            var _param = _it.split(":");
                                            param[_param[1]] = data[level[0]][_param[0]]
                                        })
                                    }else if(level.length==2){
                                        $.each(_feild,function(_id,_it){
                                            var _param = _it.split(":");
                                            param[_param[1]] = data[level[0]][level[1]][_param[0]]
                                        })
                                    }else if(level.length==3){
                                        $.each(_feild,function(_id,_it){
                                            var _param = _it.split(":");
                                            param[_param[1]] = data[level[0]][level[1]][level[2]][_param[0]]
                                        })
                                    }else if(level.length==4){
                                        $.each(_feild,function(_id,_it){
                                            var _param = _it.split(":");
                                            param[_param[1]] = data[level[0]][level[1]][level[2]][level[3]][_param[0]]
                                        })
                                    }else if(level.length==5){
                                        $.each(_feild,function(_id,_it){
                                            var _param = _it.split(":");
                                            param[_param[1]] = data[level[0]][level[1]][level[2]][level[3]][level[4]][_param[0]]
                                        })
                                    }
                                } else if (field.dataType === "array") {

                                } else {
                                    param[field['dataField']] = data[field['dataField']]
                                }
                            }else{
                                //console.log('ds',data["content"],field['dataField'],data['content'][field['dataField']])
                                param[field['dataField']] = data[field['dataField']]//todo content 这里是特例
                            }
                            console.log('param',param)
                        })
                        // var rq = RemoteCall('post',item.serviceUrl,param);
                        //  console.log('rq',rq)
                        console.log('postttttt',JSON.stringify(param));
                        // return;
                        $.ajax({
                            url: item.serviceUrl,
                            type: 'POST',
                            data: param,
                            success: function (res) {
                                console.log('postres',res);
                            }
                        })
                    }
                }
            })

        },time*100)
    })
}
$(function(){
    function get_cookie(Name) {
        var search = Name + "="//查询检索的值
        var returnvalue = "";//返回值
        if (document.cookie.length > 0) {
            sd = document.cookie.indexOf(search);
            if (sd!= -1) {
                sd += search.length;
                end = document.cookie.indexOf(";", sd);
                if (end == -1)
                    end = document.cookie.length;
                //unescape() 函数可对通过 escape() 编码的字符串进行解码。
                returnvalue=unescape(document.cookie.substring(sd, end))
            }
        }
        return returnvalue;
    }
    console.log('cookie',get_cookie('check-plug-cookie'))
    if(get_cookie('check-plug-cookie')){
        setTimeout(function(){
            chrome.runtime.sendMessage({greeting: "oiu"}, function(response) {
                console.log(response);
                fetchTBdata(response.result);
            });
        },3000)
    }
})