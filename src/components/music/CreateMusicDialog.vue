<template>

  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">新增用户</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="name" label="音乐名" autofocus lazy-rules
                 :rules="[ val => val && val.length > 0 || '请输入音乐名']"/>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="description" label="描述" autofocus @keyup.enter="prompt = false"/>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <Uploader :label="label" @uploadedGF="uploadedGF"></Uploader>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="确认" color="primary" v-close-popup @click="createMusic(name.value,description.value,file.value)"/>
        <q-btn flat label="取消" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import {ref} from 'vue';
import {defineExpose} from 'vue'

import {useStore} from "vuex";
import {useQuasar} from "quasar";
import {createUserRequest} from "../../api/user.js";
import {createMusicRequest} from "../../api/music.js";

import Uploader from "../common/Uploader.vue"
import CosUploader from "../common/uploaderComponent/useCosUploader.js";


const alert = ref(false);
const confirm = ref(false);

const prompt = ref(false);
const name = ref('');
const description = ref('');
const file = ref(null)

const music = ref({name: '', description: '', file: null})

const label = ref('音乐上传');

const $q = useQuasar()

const store = useStore()

const emit = defineEmits(['fetchData']);

const fetchDataFromFather = () => {
  emit('fetchData')
}

const uploadedGF = (res) => {
  file.value = res;
  console.log(file.value)
}


const createMusic = () => {
  //获取对象的时候不能放到函数外面，不然的话只能获取初值
  music.value = {name: name.value, description: description.value, file: file.value};

  createMusicRequest(music.value).then(res => {
    console.log(res);
    fetchDataFromFather();
    $q.notify({message: '创建成功', position: "top", type: 'positive',});
  })


}

// const createUser =(username,password)=>{store.dispatch("createUser",{username,password}).then(res=>console.log(res))}
const togglePrompt = () => {
  console.log(label.value)

  //转换对话框的显示状态
  prompt.value = !prompt.value
  //清空input
  name.value = ''
  description.value = ''
}

//暴露函数给父组件
defineExpose({
  togglePrompt
})


</script>

<style scoped>

</style>