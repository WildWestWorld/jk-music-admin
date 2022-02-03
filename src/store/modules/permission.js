//用于存放页面左面导航栏的文字、图标以及点击后跳转的路径
//暂时不用


import router from "../../router";

const state={
    routes:[]
};
//同步
const mutations ={
    SET_ROUTES:(state,routes)=>{
        state.addRouters =routes;
    }
};

//异步
const actions ={
    generateRoutes({commit}){
        return new Promise(resolve => {
            let accessedRoutes =asyncRoutes ||[];
            commit('SET_ROUTES',accessedRoutes)
            resolve(accessedRoutes);
        })
    }
}