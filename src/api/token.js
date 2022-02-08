import request from "./request.js";

export const createToken=(username,password)=>{
    return request.post("/tokens",{username,password});
}