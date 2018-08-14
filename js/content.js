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
            $.ajax({
                url:item.apiUrl+search,
                type:item.apiMethod||'GET',
                success:function (data) {
                    var success_flag =item.succFlag.split(":")
                    if(data[success_flag[0]].toString()==success_flag[1]) {
                        console.log(1,data)
                        var param = {};
                        //解析出每一个要传递到后台的参数
                        $.each(item.fields, function (index, field) {
                            if(field.dataRoot){
                                //这里不知有几层，暂时写死五层的情况
                                var level = field.dataRoot.split(".");
                                var _feild = field.fields.split("|");
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
                                param[field['dataField']] = data[field['dataField']]
                            }
                        })
                        console.log('postttttt',Object.assign({},param));
                        for( let item in param){
                            console.log(typeof param[item])
                            if(Array.isArray(param[item])){
                                param[item] ='['+ param[item]+"]"
                            }
                        }
                        console.log('cccccc',param)

                        chrome.runtime.sendMessage({greeting: "post2moli",url:item.serviceUrl,data:param}, function(response) {
                            console.log(response);
                        });

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