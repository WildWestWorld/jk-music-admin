import request from "./request.js";

export const getMusicList =(searchWord)=>{
    return request.get("/playlist",{params:{searchWord}})
}

export const getPageByPlayListName=( pageNum,pageSize,searchWord)=>{
    return request.get("/playlist/page",{params:{ pageNum,pageSize,searchWord}})
}

export const createPlayListRequest =(playlist)=>{
    return request.post("/playlist",playlist)
}

export const updatePlayList =(id,playlist)=>{
    return request.put(`/playlist/${id}`,playlist)
}

export const deletePlayList =(id)=>{
    return request.delete(`/playlist/${id}`)
}


//变更歌单的上架状态状态
export const changePlayListStateToPublic =(id)=>{
    return request.post(`/playlist/${id}/public`)
}

export const changePlayListStateToClosed =(id)=>{
    return request.post(`/playlist/${id}/closed`)
}

export const changePlayListStateToWaited =(id)=>{
    return request.post(`/playlist/${id}/waited`)
}

