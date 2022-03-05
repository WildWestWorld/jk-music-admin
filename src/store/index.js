import { createStore, createLogger } from 'vuex';
import user from "./modules/user.js";
import setting from "./modules/setting.js";

//vuex的配置
//判断是是否是开发模式
const debug = process.env.NODE_ENV !== 'production';

export default createStore({
    modules: {
        user,
        setting
    },
    //开启日志工具
    plugins: debug ? [createLogger()] : []
});
