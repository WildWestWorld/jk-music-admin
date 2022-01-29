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
          <q-avatar color="primary" text-color="white">{{ nicknameFirstWord }}</q-avatar>


        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
        <!-- drawer content -->
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

export default {
  name: "Layout",

  setup () {
    //其实就是定义了一个变量leftDrawerOpen为false
    const leftDrawerOpen = ref(false)
    //使用vuex
    const store =useStore();
    return {
      nicknameFirstWord:computed(()=>{

        return store.getters.nicknameFirstWord}),
      //引入该变量
      leftDrawerOpen,
      //方法，就是把leftDrawerOpen值变为相反的值，这个值就是设定菜单是否展开
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }

    }
//setup止
  }

}
</script>

<style scoped>

</style>