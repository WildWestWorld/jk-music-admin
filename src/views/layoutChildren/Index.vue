<template>
  <div>欢迎{{ nickname }}</div>
  <uploader ></uploader>
  <q-btn @click="logout">退出</q-btn>
  <CosUploader :label="label"></CosUploader>
</template>

<script >
import {useStore} from "vuex";
import {computed,ref} from "vue";
import Uploader from "../../components/common/uploader/UploaderTest.vue";
import CosUploader from "../../components/common/uploader/uploaderComponent/useCosUploader.js";

export default {
  name: "Index",
  components: {Uploader,CosUploader},
  setup(){
    const store =useStore();
    const label =ref('我的天')
    return{
      nickname:computed(()=> store.state.user.nickname),
      //执行完vuex里面的'logout'后使用window.location.reload()刷新页面
      logout:()=>store.dispatch('logout').then(()=>window.location.reload()),
      label
    };

  }

}
</script>

<style scoped>

</style>