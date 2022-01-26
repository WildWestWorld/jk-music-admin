import { createRouter, createWebHistory } from 'vue-router';
import Layout from "../views/layout/Layout.vue";
import Index from "../views/layoutChildren/Index.vue";
import Login from "../views/login/Login.vue";



const routes = [
  {
    path: '/',
    name:"Layout",
    component: Layout,
    redirect:"/index",
    children:[{
      path: '/index',
      name:"Index",
      component: ()=>import("../views/layoutChildren/Index.vue"),
    },
        //children止
    ]
    //Layout系列止
  },{
    path: '/login',
    name:"Login",
    component: ()=>import("../views/login/Login.vue"),
  },{
  //    /:pathMatch(.*)   代表除以上页面之外的所有页面
    path: '/:pathMatch(.*)',
    name:"404",
    component: ()=>import("../views/error/404.vue"),
  },{
    path: '/403',
    name:"403无权限",
    component: ()=>import("../views/error/403.vue"),
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
