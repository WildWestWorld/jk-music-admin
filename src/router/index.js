import { createRouter, createWebHistory } from 'vue-router';
import Layout from "../views/layout/Layout.vue";
import Index from "../views/layoutChildren/Index.vue";
import Login from "../views/login/Login.vue";

//暴露layoutChildren 方便页面拿到里面的值
export const layoutChildren=[{
  path: '/index',
  name:"Index",
  //meta 可以使用到页面上 使用userRouter 里面的getRoutes()方法 获取到meta 具体看Layout页面
  meta:{title:'控制台', icon:'dashboard'},
  component: ()=>import("../views/layoutChildren/Index.vue"),
},{
  path: '/user',
  name:"User",
  meta:{title:'用户管理', icon:'manage_accounts'},
  component: ()=>import("../views/layoutChildren/User.vue"),
},{
  path: '/role',
  name:"Role",
  meta:{title:'角色管理', icon:'account_box'},
  component: ()=>import("../views/layoutChildren/Role.vue"),
},{
  path: '/music',
  name:"Music",
  meta:{title:'音乐管理', icon:'music_note'},
  component: ()=>import("../views/layoutChildren/Music.vue"),
},{
  path: '/artist',
  name:"Artist",
  meta:{title:'歌手管理', icon:'mic'},
  component: ()=>import("../views/layoutChildren/Artist.vue"),
},{
  path: '/play_list',
  name:"PlayList",
  meta:{title:'歌单管理', icon:'queue_music'},
  component: ()=>import("../views/layoutChildren/PlayList.vue"),
},{
  path: '/album',
  name:"Album",
  meta:{title:'专辑管理', icon:'library_music'},
  component: ()=>import("../views/layoutChildren/Album.vue"),
},{
  path: '/tag',
  name:"tag",
  meta:{title:'标签管理', icon:'receipt'},
  component: ()=>import("../views/layoutChildren/Tag.vue"),
},


  {
  path: '/freeMusic',
  name:"freeMusic",
  meta:{title:'乐库管理', icon:'audio_file'},
  component: ()=>import("../views/layoutChildren/FreeMusic.vue"),
},

  //children止
]

const routes = [
  {
    path: '/',
    name:"Layout",
    component: Layout,
    redirect:"/index",
    //layoutChildren 使我们自定义的数组
    children:layoutChildren,
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
