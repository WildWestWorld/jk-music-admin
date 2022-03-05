import request from "./request.js";

export const initUpload = file=>{
    return request.post("/files/upload_init",file);
};
export const finishUpload = fileId =>{
    return request.post(`/files/${fileId}/upload_finish`)
}