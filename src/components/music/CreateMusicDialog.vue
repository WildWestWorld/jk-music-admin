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
        <Uploader :label="label" @uploadedGF="uploadedGF" :fileEdit="fileEdit"></Uploader>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn label="确认" color="primary" v-close-popup @click="isEdit?editMusic():createMusic()"/>
        <q-btn flat label="取消" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import {defineExpose} from 'vue'
import {ref,defineProps} from "vue"

import {useStore} from "vuex";
import {useQuasar} from "quasar";
import {createUserRequest} from "../../api/user.js";
import {createMusicRequest, updateMusic} from "../../api/music.js";

import Uploader from "../common/Uploader.vue"
import CosUploader from "../common/uploaderComponent/useCosUploader.js";


const alert = ref(false);
const confirm = ref(false);

const prompt = ref(false);
const name = ref('');
const description = ref('');
const file = ref(null)
const fileId =ref(null)
const fileEdit =ref(null)
const id =ref(null)
const music = ref(props.rowData||{name: '', description: '', file: null})

const isEdit =ref(null)



const label = ref('音乐上传');

const $q = useQuasar()

const store = useStore()

const emit = defineEmits(['fetchData']);

const fetchDataFromFather = () => {
  emit('fetchData')
}


const props = defineProps(
    {rowData:{type:Object,default(){return null}}}
)



const uploadedGF = (res) => {
  file.value = res;
  if (file.value !==null){
    fileId.value=file.value.id;
    console.log(file.value)
  }

}


const createMusic = () => {
  //获取对象的时候不能放到函数外面，不然的话只能获取初值
  music.value = {name: name.value, description: description.value, fileId:fileId.value,file: file.value};



  createMusicRequest(music.value).then(res => {
    console.log(res);
    fetchDataFromFather();
    $q.notify({message: '创建成功', position: "top", type: 'positive',});

  })



}

const editMusic = ()=>{
  music.value = {id:id.value,name: name.value, description: description.value, fileId:fileId.value,file: file.value};

  updateMusic(music.value.id,music.value).then(res=>{
    console.log(res)

    fetchDataFromFather();
    $q.notify({message: '修改成功', position: "top", type: 'positive',});

  })
}


// const createUser =(username,password)=>{store.dispatch("createUser",{username,password}).then(res=>console.log(res))}
const togglePrompt = () => {
  isEdit.value=false;

  file.value=null;
  fileId.value=null;
  fileEdit.value=null;
  id.value =null;

  console.log(isEdit.value)
  //转换对话框的显示状态
  prompt.value = !prompt.value



  //清空input
  name.value = ''
  description.value = ''



}

const togglePromptEdit =()=>{

  isEdit.value=true;
  name.value='';
  description.value='';

  file.value=null;
  fileId.value=null;
  fileEdit.value=null;
  id.value =null;


  //转换对话框的显示状态
  prompt.value = !prompt.value

  name.value=props.rowData.name;
  description.value=props.rowData.description;
  if (props.rowData.file !== null){
    file.value=props.rowData.file;
    fileId.value=props.rowData.file.id;
  }

  fileEdit.value=props.rowData.file

  id.value = props.rowData.id;


}



//暴露函数给父组件
defineExpose({
  togglePrompt,
  togglePromptEdit
})


</script>

<style scoped>

</style>