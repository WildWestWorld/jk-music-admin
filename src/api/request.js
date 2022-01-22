import axios from "axios";
//https://jk-music-1577517-1309371796.ap-shanghai.run.tcloudbase.com
//baseURL是后端地址

const baseURL = import.meta.env.VITE_API_HOST
const instance =axios.create({
    baseURL
})

const{get,post,put} =instance

export {get,post,put}
