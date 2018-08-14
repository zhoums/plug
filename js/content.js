function fetchTBdata(urlList){
    //item
    console.log('urlList',urlList)
    $.each(urlList,function(id,item){
        console.log('item',item)
        let argumentList = [];
        let postMoliAsideParam = [];
        item.requestArgs.forEach(function(requestArg,index){
            if(item.apiMethod === "get"){
                argumentList.push(requestArg.getArgs);
                if(requestArg.backArgs){
                    let item={};
                    requestArg.backArgs.forEach((backArg,ind)=>{
                        console.log('backArgs',backArg)
                        item[backArg]=requestArg['getArgs'][backArg];
                    })
                    postMoliAsideParam.push(item)
                }
                // postMoliAsideParam.push(requestArg.backArg)
            }else{
                argumentList.push(requestArg.postArgs);
                if(requestArg.backArgs){
                    let item={};
                    requestArg.backArgs.forEach((backArg,ind)=>{
                        console.log('backArgs',backArg)
                        item[backArg]=requestArg['postArgs'][backArg];
                    })
                    postMoliAsideParam.push(item)
                }
            }
        })
        console.log('argument==postMoliAsideParam',argumentList,postMoliAsideParam);
        argumentList.forEach((argument,index)=>{
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
                            $.each(item.fields, function (_index, field) {
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
                            param= Object.assign({},param,postMoliAsideParam[index]||"")
                            console.log('postttttt',Object.assign({},param));
                            console.log('postMoliAsideParam',postMoliAsideParam)
                            for( let item in param){
                                if(Array.isArray(param[item])){
                                    param[item] ='['+ param[item]+"]"
                                }
                            }
                            chrome.runtime.sendMessage({greeting: "post2moli",url:item.serviceUrl,data:param}, function(response) {
                                console.log(response);
                            });

                        }
                    }
                })

            },time*100)
        })
        // let argument = item.apiMethod === "get" ? item.requestArgs[0].getArgs : item.requestArgs[0].postArgs;

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