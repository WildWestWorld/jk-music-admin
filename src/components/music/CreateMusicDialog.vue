<template>

  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 392px">
      <el-card shadow="always" style="width: 100%">

      <q-card-section>
        <div class="text-h6">新增音乐</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="name" label="音乐名" autofocus lazy-rules
                 :rules="[ val => val && val.length > 0 || '请输入音乐名']"/>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="description" label="描述" autofocus @keyup.enter="prompt = false"/>
      </q-card-section>




      <q-card-section class="q-pt-none">
        <ArtistSelectionElementUIV2 @ArtistSelectionElementUI="inputSelectArtistList" :artistListFromFather="artistIdListFromFather"></ArtistSelectionElementUIV2>
      </q-card-section>

        <q-card-section class="q-pt-none">
          <Uploader :label="musicPhotoLabel" @uploadedGF="uploadedGF" :fileEdit="musicPhotoFileEdit"></Uploader>
        </q-card-section>


      <q-card-section class="q-pt-none">
        <Uploader :label="musicLabel" @uploadedGF="uploadedGF" :fileEdit="fileEdit"></Uploader>
      </q-card-section>



      <q-card-actions align="right" class="text-primary">
        <q-btn label="确认" color="primary" v-close-popup @click="isEdit?editMusic():createMusic()"/>
        <q-btn flat label="取消" v-close-popup/>
      </q-card-actions>
      </el-card>
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

import Uploader from "../common/uploader/Uploader.vue"
import CosUploader from "../common/uploader/uploaderComponent/useCosUploader.js";
import ArtistSelectionElementUI from "../common/artistSelection/ArtistSelectionElementUI.vue"
import ArtistSelectionElementUIV2 from "../common/artistSelection/ArtistSelectionElementUIV2.vue"

import ArtistSelection from "../common/artistSelection/ArtistSelection.vue"


const alert = ref(false);
const confirm = ref(false);

const prompt = ref(false);
const name = ref('');
const description = ref('');

const file = ref(null)
const fileId =ref(null)
const fileEdit =ref(null)

const musicPhotoFile = ref(null)
const musicPhotoFileId =ref(null)
const musicPhotoFileEdit =ref(null)

const id =ref(null)
const music = ref(props.rowData||{name: '', description: '', file: null})
const artistIdListFromChild=ref([]);
const artistIdListFromFather=ref([]);
const isEdit =ref(null)



const musicLabel = ref('音乐文件');
const musicPhotoLabel = ref('封面文件');

const $q = useQuasar()

const store = useStore()

const emit = defineEmits(['fetchData']);

const fetchDataFromFather = () => {
  emit('fetchData')
}


const props = defineProps(
    {rowData:{type:Object,default(){return null}}}
)


const inputSelectArtistList=(artistIdList)=>{
  artistIdListFromChild.value=artistIdList
  console.log(artistIdListFromChild.value)
}


const uploadedGF = (res) => {

if (res !== null) {

  if (res.label.toString().indexOf(musicPhotoLabel.value) !== -1) {

    musicPhotoFile.value = res;
    console.log(musicPhotoFile.value)
    if (musicPhotoFile.value !== null) {
      musicPhotoFileId.value = musicPhotoFile.value.id;
      console.log(musicPhotoFile.value)

    }

  }

  if (res.label.toString().indexOf(musicLabel.value) !== -1) {

    file.value = res;
    if (file.value !== null) {
      fileId.value = file.value.id;
      console.log(file.value)
    }

  }


}else {
  musicPhotoFile.value=null
  musicPhotoFileId.value=null
}


}



const createMusic = () => {
  //获取对象的时候不能放到函数外面，不然的话只能获取初值
  music.value = {name: name.value, description: description.value, fileId:fileId.value,file: file.value,photoId:musicPhotoFileId.value,artistIdList:artistIdListFromChild.value};



  createMusicRequest(music.value).then(res => {
    console.log(res);
    fetchDataFromFather();
    $q.notify({message: '创建成功', position: "top", type: 'positive',});

  })



}

const editMusic = ()=>{
  music.value = {id:id.value,name: name.value, description: description.value, fileId:fileId.value,file: file.value,photoId:musicPhotoFileId.value,artistIdList:artistIdListFromChild.value};

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

  musicPhotoFile.value=null;
  musicPhotoFileId.value=null;
  musicPhotoFileEdit.value=null;

  id.value =null;
  artistIdListFromChild.value=null;
  artistIdListFromFather.value=null;

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

  musicPhotoFile.value=null;
  musicPhotoFileId.value=null;
  musicPhotoFileEdit.value=null;

  id.value =null;
  artistIdListFromChild.value=null


  //转换对话框的显示状态
  prompt.value = !prompt.value

  name.value=props.rowData.name;
  description.value=props.rowData.description;
  if (props.rowData.file !== null){
    file.value=props.rowData.file;
    fileId.value=props.rowData.file.id;
    fileEdit.value=props.rowData.file
  }


  if(props.rowData.photo !== null){
    musicPhotoFile.value=props.rowData.photo;
    musicPhotoFileId.value=props.rowData.photo.id;
    musicPhotoFileEdit.value=props.rowData.photo
  }

  id.value = props.rowData.id;
  artistIdListFromChild.value=props.rowData.artistVoList.map(item=>item.id)
  artistIdListFromFather.value=artistIdListFromChild.value

}



//暴露函数给父组件
defineExpose({
  togglePrompt,
  togglePromptEdit
})


</script>

<style scoped>

</style>