<template>

  <q-dialog v-model="prompt" persistent >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">新增用户</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="username" label="用户名" autofocus />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="password"  label="密码" autofocus @keyup.enter="prompt = false" />
      </q-card-section>


      <q-card-actions align="right" class="text-primary">
        <q-btn  label="确认" color="primary" v-close-popup @click="createUser(username.value,password.value)"/>
        <q-btn flat label="取消" v-close-popup  />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import {ref} from  'vue';
import { defineExpose } from 'vue'
import {createUserRequest, getPageByUsername} from "../../api/user.js";
import {useStore} from "vuex";
import {useQuasar} from "quasar";



const alert= ref(false);
const confirm = ref(false);

const prompt =ref(false);
const username =ref('');
const password =ref('');

const $q = useQuasar()

const store=useStore()

const emit = defineEmits(['fetchData']);

const fetchDataFromFather = ()=>{
  emit('fetchData')
}



const createUser = ()=>{
  //获取对象的时候不能放到函数外面，不然的话只能获取初值
  const user={username:username.value,password:password.value};
  createUserRequest(user).then(res=>{console.log(res);fetchDataFromFather();$q.notify({message:'创建成功',position:"top",type:'positive',});})


}

// const createUser =(username,password)=>{store.dispatch("createUser",{username,password}).then(res=>console.log(res))}
const togglePrompt =()=>{
  //转换对话框的显示状态
  prompt.value = !prompt.value
  //清空input
  username.value =''
  password.value=''
}

//暴露函数给父组件
  defineExpose({
    togglePrompt
  })

</script>

<style scoped>

</style>