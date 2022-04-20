import axios from "axios";
import request from "./request.js";

const gm_request = axios.create({
    baseURL: '/gm',  // 注意！！ 这里是全局统一加上了 '/api' 前缀，也就是说所有接口都会加上'/api'前缀在，页面里面写接口的时候就不要加 '/api'了，否则会出现2个'/api'，类似 '/api/api/user'这样的报错，切记！！！
    timeout: 5000
})

const test_request = axios.create({
    baseURL: '/test',  // 注意！！ 这里是全局统一加上了 '/api' 前缀，也就是说所有接口都会加上'/api'前缀在，页面里面写接口的时候就不要加 '/api'了，否则会出现2个'/api'，类似 '/api/api/user'这样的报错，切记！！！
    timeout: 5000
})
export const searchFromGM =(ua,version,text,pageNo,pageSize,searchSwitch)=>{
    // return gm_request.get('',{params:version,text,pageNo,pageSize,searchSwitch})

    return gm_request.get("/MIGUM3.0/v1.0/content/search_all.do",{params:{ ua,version,text,pageNo,pageSize,searchSwitch}})

}

export const freeMusicFromFreeMp3 =(data)=>{
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }



    return test_request.post("/search", data,config)

}