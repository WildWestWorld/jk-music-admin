
import request from "./request.js";
//意味着我们请求sayhello会   调用后端接口名字+/hello
export const login= (username,password)=>{
    return request.post('/login',{username,password})
}
export default login;