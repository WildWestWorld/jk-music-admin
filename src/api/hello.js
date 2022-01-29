
import request from "./request.js";
//意味着我们请求sayhello会   调用后端接口名字+/hello
export const sayHello= ()=>{
    return request.get("/hello")
}
export default sayHello;