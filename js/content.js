
$(function(){

    // const headObj = {tk:'100000',darenId:10000};
    //
    let darenId = $(this).attr("data-darenId")||10000,
        darenName = $(this).attr("data-darenName")|10000,
        tk = $(this).attr("data-token")||10000;

    chrome.runtime.sendMessage({greeting: "triggerConfig",head:"tk="+tk+"&darenId="+darenId+"&darenName="+darenName}, function(response) {

    });


    $("#smartSet").on("click",function(){
        let darenId = $(this).attr("data-darenId"),
            tk = $(this).attr("data-token");
        let headObj={darenId:darenId,tk:tk,darenName:darenName}
        chrome.runtime.sendMessage({greeting: "fetchConfig"}, function(response) {
            fetchTBdata(response.result,headObj);
        });
    })

    /*if(get_cookie('check-plug-cookie')){
        console.log('lllllll')
        setTimeout(function(){
            chrome.runtime.sendMessage({greeting: "fetchConfig"}, function(response) {
                fetchTBdata(response.result,headObj);
            });
        },3000)
    }*/
})

function fetchTBdata(urlList,headObj){
    //item
    $.each(urlList,function(id,item){
        let argumentList = [];
        let postMoliHeadParam = [];
        item.requestArgs.forEach(function(requestArg,index){
            let _headObj = Object.assign({},headObj);
            if(item.apiMethod === "get"){
                argumentList.push(requestArg.getArgs);
                if(requestArg.backArgs){
                    requestArg.backArgs.forEach((backArg,ind)=>{
                        _headObj[backArg]=requestArg['getArgs'][backArg];
                    })
                }
            }else{
                argumentList.push(requestArg.postArgs);
                if(requestArg.backArgs){
                    requestArg.backArgs.forEach((backArg,ind)=>{
                        _headObj[backArg]=requestArg['postArgs'][backArg];
                    })
                }
            }
            if(item.contentType){
                _headObj["Content-Type"]=item.contentType;
            }
            //head参数在这里设置
            postMoliHeadParam.push(_headObj);

        })
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

            $.ajax({
                url:item.apiUrl+search,
                type:item.apiMethod||'GET',
                success:function (data) {
                    var success_flag =item.succFlag.split(":")
                    if(data[success_flag[0]].toString()==$.trim(success_flag[1])) {
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
                                } else if (field.dataType === "list") {
                                    param[field['backArg']]= new Array();

                                    //todo
                                    if(level.length==1){
                                        if(data[''+level[0]]&& data[''+level[0]].length>0){
                                            data[''+level[0]].forEach((item,index)=>{
                                                let objItem = {}
                                                $.each(_feild,function(_id,_it){
                                                    var _param = _it.split(":");
                                                    objItem[_param[1]] = item[''+_param[0]];//字段名有中文
                                                })
                                                param[field['backArg']].push(objItem);
                                            })
                                        }
                                    }else if(level.length==2){
                                        if(data[''+level[0]][''+level[1]] && data[''+level[0]][''+level[1]].length>0){
                                            data[''+level[0]][''+level[1]].forEach((item,index)=>{
                                                let objItem = {}
                                                $.each(_feild,function(_id,_it){
                                                    var _param = _it.split(":");
                                                    objItem[_param[1]] = item[''+_param[0]];//字段名有中文
                                                })
                                                param[field['backArg']].push(objItem);
                                            })
                                        }
                                    }else if(level.length==3){
                                        if(data[''+level[0]][''+level[1]][''+level[2]] && data[''+level[0]][''+level[1]][''+level[2]].length>0){
                                            data[''+level[0]][''+level[1]][''+level[2]].forEach((item,index)=>{
                                                let objItem = {}
                                                $.each(_feild,function(_id,_it){
                                                    var _param = _it.split(":");
                                                    objItem[_param[1]] = item[''+_param[0]];//字段名有中文
                                                })
                                                param[field['backArg']].push(objItem);
                                            })
                                        }

                                    }else if(level.length==4){
                                        if(data[''+level[0]][''+level[1]][''+level[2]][''+level[3]] && data[''+level[0]][''+level[1]][''+level[2]][''+level[3]].length>0){
                                            data[''+level[0]][''+level[1]][''+level[2]][''+level[3]].forEach((item,index)=>{
                                                let objItem = {}
                                                $.each(_feild,function(_id,_it){
                                                    var _param = _it.split(":");
                                                    objItem[_param[1]] = item[''+_param[0]];//字段名有中文
                                                })
                                                param[field['backArg']].push(objItem);
                                            })
                                        }

                                    }else if(level.length==5){
                                        if(data[''+level[0]][''+level[1]][''+level[2]][''+level[3]][''+level[4]] && data[''+level[0]][''+level[1]][''+level[2]][''+level[3]][''+level[4]].length>0){
                                            data[''+level[0]][''+level[1]][''+level[2]][''+level[3]][''+level[4]].forEach((item,index)=>{
                                                let objItem = {}
                                                $.each(_feild,function(_id,_it){
                                                    var _param = _it.split(":");
                                                    objItem[_param[1]] = item[''+_param[0]];//字段名有中文
                                                })
                                                param[field['backArg']].push(objItem);
                                            })
                                        }
                                    }

                                } else {
                                    param[field['dataField']] = data[field['dataField']]
                                }
                            }else{
                                param[field['dataField']] = data[field['dataField']]
                            }
                        })
                        chrome.runtime.sendMessage({greeting: "post2moli",url:item.serviceUrl,data:param,header:postMoliHeadParam[index]}, function(response) {
                            // console.log(response);
                        });

                    }
                }
            })

            var time = Math.random()*(90-13+1)+13;
            setTimeout(function () {


            },time*100)
        })
    })
}


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