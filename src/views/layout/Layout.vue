<template>
  <div class="layout">
    <q-layout view="hHh lpR fFf">

      <q-header elevated class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>
            捷凯音乐
          </q-toolbar-title>

          <q-space />
          <q-avatar color="teal" text-color="white">{{ nicknameFirstWord }}

            <q-menu>
              <q-list style="min-width: 100px">
                <q-item clickable v-close-popup @click="handleLogout">
                  <q-item-section >退出</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-avatar>


        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>


        <q-list padding class="rounded-borders text-primary" >

          <q-item
              clickable
              v-ripple

              v-for="item in layoutChildren"
              :key="item.meta.title"

              :active="item.name === route.name"
              active-class="my-menu-link"
          >
            <q-item-section avatar>
              <q-icon :name=item.meta.icon />
            </q-item-section>

            <q-item-section>{{ item.meta.title}}</q-item-section>
          </q-item>



        </q-list>

      </q-drawer>

      <q-page-container>
        <router-view />

      </q-page-container>

    </q-layout>

  </div>


</template>

<script>
import { ref } from 'vue'
import {useStore} from "vuex";
import {computed} from "vue";

import {layoutChildren} from "../../router";
import {useRoute} from "vue-router";


export default {
  name: "Layout",

  setup () {
    //其实就是定义了一个变量leftDrawerOpen为false
    const leftDrawerOpen = ref(false)
    //定义一个数组，用于控制菜单的图标和名字
    const menuController=[{title:"控制台",icon:'dashboard'},{title:"用户管理",icon:'manage_accounts'}]
    //使用vuex
    const store =useStore();
    //使用route里面的route.name 也就是当前页面的路径
    const route =useRoute();

    return {
      nicknameFirstWord:computed(()=>{

        return store.getters.nicknameFirstWord}),
      //引入该变量
      leftDrawerOpen,
      //方法，就是把leftDrawerOpen值变为相反的值，这个值就是设定菜单是否展开
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      handleLogout:()=>store.dispatch('logout').then(()=>window.location.reload()),
      menuController,
      //这个值来自于router文件
      layoutChildren,
      route
    }
//setup止
  }

}
</script>

<style scoped>
.my-menu-link{
  color: white;
  background: blue;
}

</style>