import router from './router';
import store from './store';
import {getToken} from "./utils/auth.js";

//该文件为路由守卫配置

//注意使用之前要在main.js中注册
const whiteList = ['/login', '/403', '/404'];
//router.beforeEach（）一般用来做一些进入页面的限制
//to 跳转的页面
//from跳转前的页面
//next放行去的页面
router.beforeEach(async (to, from, next) => {
    //从cookie中拿token
   const hasToken =getToken();
   //如果有token
   if(hasToken){
       //如果跳转的是login页面
       if (to.path === '/login'){
           //就跳转到原始目录
           next({path:'/'})
           //如果不是login页面，就自然放行，想去哪去哪
       }else {
           next();
       }
       //如果没有token
   }else{
       //如果在白名单里面到得到要跳转的页面就放行
       if(whiteList.indexOf(to.path) !== -1){
           next();
           //找不到就放到跳转到login页面，并且redirect表示，${to.path}保留他想跳转的页面 我们会在login页面再次使用到保留的参数
       }else{
           next(`/login?redirect=${to.path}`)
       }
   }
})