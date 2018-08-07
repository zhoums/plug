$(function(){
  chrome.runtime.sendMessage({type: "GET_GLOBAL"}, function(response) {
      const global = response.data
      $.ajax({
        url:global.dataUrl + '/datacount/checkVersion.wb',
        data:{version:global.version, token:global.token},
        dataType:'json'
      }).done(function(res){
        if(!res.result) {
          $.ajax({
            url:global.dataUrl + '/datacount/getVersionDownload.wb',
            data:{token:global.token},
            dataType:'json'
          }).done(function(res){
            if(res.status == 0) {
              $('.alert-danger a').attr('href',res.result)
              $('.alert-danger').removeClass('hidden')
            }
          }).fail(function(){
            $('.alert-danger').html('无法获取插件更新地址')
            $('.alert-danger').removeClass('hidden')
          })

        } else {
          $('.alert-danger').addClass('hidden')
        }
      }).fail(function(){
        $('.alert-danger').html('无法获取插件当前版本')
        $('.alert-danger').removeClass('hidden')
      })
  });
})
