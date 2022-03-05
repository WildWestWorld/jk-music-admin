//setting接口 file里面 的bucket 和 region 会从这里面拿

 import request from "./request.js";

export const getSettingSiteInfo=()=>{
    return request.get("/setting/site")
 }