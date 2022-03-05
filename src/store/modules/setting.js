import {getSettingSiteInfo} from "../../api/setting.js";

const state =()=>({
    site:{
        bucket:null,
        region:null,
        storage:null
    }
});
//当state里面的值变化的时候
const getters ={
    bucket: state=>{
        return state.site.bucket
    },
    region: state=>{
        return state.site.region
    },

};

const actions ={
    fetchSiteSetting({commit}){
        return new Promise((resolve,reject)=>{

            getSettingSiteInfo().then(res=>{
                commit('SITE_SETTING_FETCHED',res.data);
                resolve(res.data);

            }).catch(error=>{reject(error)})

        })

    }
};

const mutations ={
    SITE_SETTING_FETCHED:(state,siteSetting)=>{
        state.site =siteSetting
    }
}

export default {
    namespace:true,
    state,
    getters,
    actions,
    mutations,

}

