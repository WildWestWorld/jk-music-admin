import request from "./request.js";

export const getMusicList =(searchWord)=>{
    return request.get("/album",{params:{searchWord}})
}

export const getPageByAlbumName=( pageNum,pageSize,searchWord)=>{
    return request.get("/album/page",{params:{ pageNum,pageSize,searchWord}})
}

export const createAlbumRequest =(album)=>{
    return request.post("/album",album)
}

export const updateAlbum =(id,album)=>{
    return request.put(`/album/${id}`,album)
}

export const deleteAlbum =(id)=>{
    return request.delete(`/album/${id}`)
}


//变更歌单的上架状态状态
export const changeAlbumStateToPublic =(id)=>{
    return request.post(`/album/${id}/public`)
}

export const changeAlbumStateToClosed =(id)=>{
    return request.post(`/album/${id}/closed`)
}

export const changeAlbumStateToWaited =(id)=>{
    return request.post(`/album/${id}/waited`)
}

