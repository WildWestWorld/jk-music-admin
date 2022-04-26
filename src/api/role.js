import request from "./request.js";

export const getRoleList =(searchWord)=>{
    return request.get("/role",{params:{searchWord}})
}

export const getPageByRoleName=( pageNum,pageSize,searchWord)=>{
    return request.get("/role/pages",{params:{ pageNum,pageSize,searchWord}})
}

export const createRoleRequest =(role)=>{
    return request.post("/role",role)
}

export const updateRole =(id,role)=>{
    return request.put(`/role/${id}`,role)
}

export const deleteRole =(id)=>{
    return request.delete(`/role/${id}`)
}



