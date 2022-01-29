

//存储初值
import {getToken, removeToken, setToken} from "../../views/utils/auth.js";
import login from "../../api/user.js";

const state = () => ({
    //getToken来自auth，用的是依赖jk-cookie方法来获取token，然后吧token放在vuex里面
    token:getToken(),
    nickname:'JK',
    username:'',
    roles:[]
});
//存取被函数处理后的值
const getters ={
    nicknameFirstWord:(state)=>{
        return state.nickname.slice(0,1)
    }
};
//vuex为了解决mutations只有同步的问题,提出了actions(异步),专门用来解决mutations只有同步无异步的问题.
//用于改变数据(异步)
const actions ={
    login({ commit }, { username, password }) {
        return new Promise((resolve, reject) => {
            login(username.trim(), password)
                .then(response => {
                  const token =response.headers['authorization']

                    //只是记录一下token，会在控制台打印出来给你看
                    commit('SET_TOKEN', token);
                    setToken(token);
                    resolve();
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    logout({ commit }) {
        //清除vuex里面的token
        commit('SET_TOKEN', '');
        commit('SET_CURRENT_USER', null);
        //清除cookie里面的token
        removeToken();

    },


};

//用于改变数据(同步) mutations只有同步
const mutations={
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    SET_CURRENT_USER: (state, currentUser) => {
        state.currentUser = currentUser;
    }
};

export default {
    namespace:true,
    state,
    getters,
    actions,
    mutations,

}


