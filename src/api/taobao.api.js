import util from '../util'

const host1 = 'https://sycm.taobao.com/',
      host2 = 'https://we.taobao.com/';

function getConfig(){
    util.$http('GET',`${host}/spider/config.wb?version=1.0`,function(res){console.log(res)})
}

export {getConfig}
