
import request from "./request.js";
//意味着我们请求sayhello会   调用后端接口名字+/hello
export const login= (username,password)=>{
    return request.post('/tokens',{username,password})
}
//该post方法，传入的是个对象
export const createUserRequest= (user)=>{
    return request.post('/users',user)
}
export const getPageByUsername=( pageNum,pageSize,searchWord)=>{
    return request.get("/users/pages",{params:{ pageNum,pageSize,searchWord}})
}
export const getCurrentUserByToken=()=>{
    return request.get('/users/currentUser')
}

export default login;