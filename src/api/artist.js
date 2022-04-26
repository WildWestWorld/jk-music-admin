import request from "./request.js";



export const getPageByArtistName=( pageNum,pageSize,searchWord)=>{
    return request.get("/artist/page",{params:{ pageNum,pageSize,searchWord}})
}

export const getArtistList =(searchWord)=>{
    return request.get("/artist",{params:{searchWord}})
}

export const getArtistSelectionList =(searchWord)=>{
    return request.get("/artist/selection",{params:{searchWord}})
}

export const createArtistRequest =(artist)=>{
    return request.post("/artist",artist)
}

export const updateArtist =(id,artist)=>{
    return request.put(`/artist/${id}`,artist)
}

export const deleteArtist =(id)=>{
    return request.delete(`/artist/${id}`)
}


//变更音乐的上架状态状态
export const changeArtistStateToPublic =(id)=>{
    return request.post(`/artist/${id}/public`)
}

export const changeArtistStateToClosed =(id)=>{
    return request.post(`/artist/${id}/closed`)
}

export const changeArtistStateToWaited =(id)=>{
    return request.post(`/artist/${id}/waited`)
}
