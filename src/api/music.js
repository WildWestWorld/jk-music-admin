import request from "./request.js";

export const getMusicList =(searchWord)=>{
    return request.get("/music",{params:{searchWord}})
}

export const getMusicSelectionList =(searchWord)=>{
    return request.get("/music/selection",{params:{searchWord}})
}

export const getPageByMusicName=( pageNum,pageSize,searchWord)=>{
    return request.get("/music/pages",{params:{ pageNum,pageSize,searchWord}})
}

export const createMusicRequest =(music)=>{
    return request.post("/music",music)
}

export const updateMusic =(id,music)=>{
    return request.put(`/music/${id}`,music)
}

export const deleteMusic =(id)=>{
    return request.delete(`/music/${id}`)
}


//变更音乐的上架状态状态
export const changeMusicStateToPublic =(id)=>{
    return request.post(`/music/${id}/public`)
}

export const changeMusicStateToClosed =(id)=>{
    return request.post(`/music/${id}/closed`)
}

export const changeMusicStateToWaited =(id)=>{
    return request.post(`/music/${id}/waited`)
}

