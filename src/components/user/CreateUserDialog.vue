<template>

  <q-dialog v-model="prompt" persistent>
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
        <q-btn flat label="取消" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import {ref} from  'vue';
import { defineExpose } from 'vue'
import {createUserRequest} from "../../api/user.js";
import {useStore} from "vuex";
import user from "../../store/modules/user.js";


const alert= ref(false);
const confirm = ref(false);

const prompt =ref(false);
const username =ref('');
const password =ref('');


const store=useStore()
const createUser = ()=>{createUserRequest(username.value,password.value).then(res=>{console.log(res)})}
// const createUser =(username,password)=>{store.dispatch("createUser",{username,password}).then(res=>console.log(res))}
const togglePrompt =()=>{
  prompt.value = !prompt.value

}

//暴露函数给父组件
  defineExpose({
    togglePrompt
  })

</script>

<style scoped>

</style>