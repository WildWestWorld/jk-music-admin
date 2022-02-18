<template>
  <div>欢迎{{ nickname }}</div>
  <q-btn @click="logout">退出</q-btn>
</template>

<script >
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: "Index",
  setup(){
    const store =useStore();

    return{
      nickname:computed(()=> store.state.user.nickname),
      //执行完vuex里面的'logout'后使用window.location.reload()刷新页面
      logout:()=>store.dispatch('logout').then(()=>window.location.reload())
    };

  }

}
</script>

<style scoped>

</style>