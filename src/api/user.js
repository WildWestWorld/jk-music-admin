
import request from "./request.js";
//意味着我们请求sayhello会   调用后端接口名字+/hello
export const login= (username,password)=>{
    return request.post('/tokens',{username,password})
}
//该post方法，传入的是个对象

export const getPageByUsername=( pageNum,pageSize,searchWord)=>{
    return request.get("/users/pages",{params:{ pageNum,pageSize,searchWord}})
}
export const getCurrentUserByToken=()=>{
    return request.get('/users/currentUser')
}

// export const getUserList=()=>{
//     return request.get('/users')
// }

export const getUserList =(searchWord)=>{
    return request.get("/users",{params:{searchWord}})
}

export const getPageByUserName=( pageNum,pageSize,searchWord)=>{
    return request.get("/users/pages",{params:{ pageNum,pageSize,searchWord}})
}

export const createUserRequest =(user)=>{
    return request.post("/users",user)
}

export const updateUser =(id,user)=>{
    return request.put(`/users/${id}`,user)
}

export const deleteUser =(id)=>{
    return request.delete(`/users/${id}`)
}



export default login;