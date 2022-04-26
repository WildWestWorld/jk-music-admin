import request from "./request.js";

export const getTagList =(searchWord)=>{
    return request.get("/tag",{params:{searchWord}})
}

export const getPageByTagName=( pageNum,pageSize,searchWord)=>{
    return request.get("/tag/pages",{params:{ pageNum,pageSize,searchWord}})
}

export const createTagRequest =(tag)=>{
    return request.post("/tag",tag)
}

export const updateTag =(id,tag)=>{
    return request.put(`/tag/${id}`,tag)
}

export const deleteTag =(id)=>{
    return request.delete(`/tag/${id}`)
}



