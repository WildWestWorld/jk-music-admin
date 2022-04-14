<template>

  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 392px">
      <el-card shadow="always" style="width: 100%">

        <q-card-section>
          <div class="text-h6">新增专辑</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="name" label="专辑名字" autofocus lazy-rules
                   :rules="[ val => val && val.length > 0 || '请输入专辑名字']"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="description" label="专辑描述" autofocus @keyup.enter="prompt = false"/>
        </q-card-section>

<!--        <q-card-section class="q-pt-none">-->
<!--          <q-toggle-->
<!--              v-model="special"-->
<!--              checked-icon="check"-->
<!--              color="pink"-->
<!--              unchecked-icon="clear"-->
<!--              label="是否设置该歌单为特色歌单"-->

<!--          />-->
<!--        </q-card-section>-->


        <q-card-section class="q-pt-none">
          <q-toggle
              v-model="recommended"
              checked-icon="check"
              color="bule"
              unchecked-icon="clear"
              label="是否推荐该歌单"
              keep-color

          />
        </q-card-section>



        <q-card-section class="q-pt-none">
          <q-input v-show="recommended" dense v-model="recommendFactor" label="推荐指数" autofocus @keyup.enter="prompt = false"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <MusicSelectionElementUIV2 @MusicSelectionElementUI="inputSelectMusicList" :MusicListFromFather="musicIdListFromFather"></MusicSelectionElementUIV2>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <ArtistSelectionElementUIV2 @ArtistSelectionElementUI="inputSelectArtistList" :artistListFromFather="artistIdListFromFather"></ArtistSelectionElementUIV2>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <Uploader :label="label" @uploadedGF="uploadedGF" :fileEdit="fileEdit"></Uploader>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn label="确认" color="primary" v-close-popup @click="isEdit?editAlbum():createAlbum()"/>
          <q-btn flat label="取消" v-close-popup/>
        </q-card-actions>

      </el-card >
    </q-card>


  </q-dialog>

</template>

<script setup>
import {defineExpose} from 'vue'
import {ref,defineProps,nextTick} from "vue"

import {useStore} from "vuex";
import {useQuasar} from "quasar";
import {createUserRequest} from "../../api/user.js";
import {createMusicRequest, updateMusic} from "../../api/music.js";

import Uploader from "../common/uploader/Uploader.vue"
import CosUploader from "../common/uploader/uploaderComponent/useCosUploader.js";
import MusicSelectionElementUIV2 from "../common/musicSelection/MusicSelectionElementUIV2.vue"
import ArtistSelectionElementUIV2 from "../common/artistSelection/ArtistSelectionElementUIV2.vue"

import {createArtistRequest, updateArtist} from "../../api/artist.js";

import {createPlayListRequest, updatePlayList} from "../../api/play_list.js";
import {createAlbumRequest, updateAlbum} from "../../api/album.js";


const alert = ref(false);
const confirm = ref(false);

const prompt = ref(false);
const name = ref('');
const description=ref('');
const file = ref(null)
const fileId =ref(null)
const fileEdit =ref(null)
const id =ref(null)
const recommendFactor=ref(null)
const recommended=ref(null)
// const special=ref(false)
const musicIdList= ref(null)


const musicIdListFromChild=ref([]);
const musicIdListFromFather=ref([]);

const artistIdListFromChild=ref([]);
const artistIdListFromFather=ref([]);


const artist = ref(props.rowData||{name: '', remark: '', file: null})
const album=ref(null)
const isEdit =ref(null)



const label = ref('封面文件');

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


const createAlbum = () => {
  //获取对象的时候不能放到函数外面，不然的话只能获取初值
  album.value = {name: name.value, description: description.value, photoId:fileId.value,musicIdList:musicIdListFromChild.value,albumArtistIdList:artistIdListFromChild.value,recommendFactor:recommendFactor.value,recommended:recommended.value};



  createAlbumRequest(album.value).then(res => {
    console.log(res);
    fetchDataFromFather();
    $q.notify({message: '创建成功', position: "top", type: 'positive',});

  })



}

const editAlbum = ()=>{
  album.value = {name: name.value, description: description.value, photoId:fileId.value,musicIdList:musicIdListFromChild.value,albumArtistIdList:artistIdListFromChild.value,recommendFactor:recommendFactor.value,recommended:recommended.value};

  if (album.value.recommended === false){
    album.value.recommendFactor =0;
  }
  updateAlbum(id.value,album.value).then(res=>{
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
  recommended.value=false;
  recommendFactor.value=null;
  // special.value=false;

  musicIdListFromChild.value=null
  musicIdListFromFather.value=null

  artistIdListFromChild.value=null
  artistIdListFromFather.value=null

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

  file.value=null;
  fileId.value=null;
  fileEdit.value=null;
  id.value =null;

  musicIdListFromChild.value=null
  musicIdListFromFather.value=null

  artistIdListFromChild.value=null
  artistIdListFromFather.value=null

  nextTick(()=>{
    //转换对话框的显示状态
    prompt.value = !prompt.value

  })




  name.value=props.rowData.name;
  description.value=props.rowData.description;

  if (props.rowData.photo !== null){
    file.value=props.rowData.photo;
    fileId.value=props.rowData.photo.id;
  }

  fileEdit.value=props.rowData.photo

  id.value = props.rowData.id;
  recommendFactor.value=props.rowData.recommendFactor
  recommended.value=props.rowData.recommended
  // special.value=props.rowData.special



  musicIdListFromChild.value=props.rowData.musicVoList.map(item=>item.id)
  musicIdListFromFather.value=musicIdListFromChild.value

  artistIdListFromChild.value=props.rowData.albumArtistList.map(item=>item.id)
  artistIdListFromFather.value=artistIdListFromChild.value

}

const inputSelectMusicList=(musicIdList)=>{
  musicIdListFromChild.value=musicIdList
  console.log(musicIdListFromChild.value)
}

const inputSelectArtistList=(artistIdList)=>{
  artistIdListFromChild.value=artistIdList
  console.log(artistIdListFromChild.value)
}



//暴露函数给父组件
defineExpose({
  togglePrompt,
  togglePromptEdit
})


</script>

<style scoped>

</style>