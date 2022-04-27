<template>

  <q-dialog v-model="prompt" persistent>
    <q-card style="min-width: 392px">
      <el-card shadow="always" style="width: 100%">

        <q-card-section>
          <div class="text-h6">新增用户</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input filled v-model="username" label="用户名" autofocus lazy-rules
                   :rules="[
                       val => val !== null && val !== '' || '请输入用户名',
                       val => val && val.length >=4 || '用户名长度应该大于4个字符',
                       val => val && val.length <=64 || '用户名长度应该小于64个字符'

                       ]"/>
        </q-card-section>

        <q-card-section class="q-pt-none" v-if="!isEdit">
          <q-input filled v-model="password" label="密码" autofocus lazy-rules type="password"
                   :rules="[
                       val => val !== null && val !== '' || '请输入密码',
                       val => val && val.length >=6 || '密码长度应该大于6个字符',
                       val => val && val.length <=64 || '密码长度应该小于64个字符'
                       ]"/>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input filled v-model="nickname" label="昵称" autofocus lazy-rules

                   :rules="[
                       val => val !== null && val !== '' || '请输入昵称',
                       val => val && val.length >=2 || '昵称长度应该大于2个字符',
                       val => val && val.length <=64 || '昵称长度应该小于64个字符'
                       ]"/>
        </q-card-section>
        <q-card-section class="q-pt-none">

          <div class="text-h8">选择性别</div>

            <q-radio v-model="gender" val="男" label="男" color="teal" />
            <q-radio v-model="gender" val="女" label="女" color="orange" />
            <q-radio v-model="gender" val="未知" label="未知" color="red" />


        </q-card-section>

        <q-card-section class="q-pt-none">
          <RoleListSelectionElementUIV2 @RoleSelectionElementUI="inputSelectRoleList" :RoleListFromFather="roleListIdListFromFather"></RoleListSelectionElementUIV2>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <PlayListSelectionElementUIV2 @PlaySelectionElementUI="inputSelectPlayList" :PlayListFromFather="playListIdListFromFather"></PlayListSelectionElementUIV2>
        </q-card-section>



        <!--        <q-card-section class="q-pt-none">-->
        <!--          <q-input filled v-model="description" label="歌单描述" autofocus @keyup.enter="prompt = false"/>-->
        <!--        </q-card-section>-->

        <!--        <q-card-section class="q-pt-none">-->
        <!--          <q-toggle-->
        <!--              v-model="special"-->
        <!--              checked-icon="check"-->
        <!--              color="pink"-->
        <!--              unchecked-icon="clear"-->
        <!--              label="是否设置该歌单为特色歌单"-->

        <!--          />-->
        <!--        </q-card-section>-->


        <!--        <q-card-section class="q-pt-none">-->
        <!--          <q-toggle-->
        <!--              v-model="recommended"-->
        <!--              checked-icon="check"-->
        <!--              color="bule"-->
        <!--              unchecked-icon="clear"-->
        <!--              label="是否推荐该歌单"-->
        <!--              keep-color-->

        <!--          />-->
        <!--        </q-card-section>-->



        <!--        <q-card-section class="q-pt-none">-->
        <!--          <q-input v-show="recommended" dense v-model="recommendFactor" label="推荐指数" autofocus @keyup.enter="prompt = false"/>-->
        <!--        </q-card-section>-->

        <!--        <q-card-section class="q-pt-none">-->
        <!--          <MusicSelectionElementUIV2 @MusicSelectionElementUI="inputSelectMusicList" :MusicListFromFather="musicIdListFromFather"></MusicSelectionElementUIV2>-->
        <!--        </q-card-section>-->

        <!--        <q-card-section class="q-pt-none">-->
        <!--          <Uploader :label="label" @uploadedGF="uploadedGF" :fileEdit="fileEdit"></Uploader>-->
        <!--        </q-card-section>-->

        <q-card-actions align="right" class="text-primary">
          <q-btn label="确认" color="primary" v-close-popup @click="isEdit?editUser():createUser()"/>
          <q-btn flat label="取消" v-close-popup/>
        </q-card-actions>

      </el-card >
    </q-card>


  </q-dialog>

</template>

<script setup>
import {defineExpose, onMounted} from 'vue'
import {ref,defineProps,nextTick} from "vue"

import {useStore} from "vuex";
import {useQuasar} from "quasar";
import {createUserRequest, updateUser} from "../../api/user.js";
import {createMusicRequest, updateMusic} from "../../api/music.js";

import Uploader from "../common/uploader/Uploader.vue"
import CosUploader from "../common/uploader/uploaderComponent/useCosUploader.js";
import MusicSelectionElementUIV2 from "../common/musicSelection/MusicSelectionElementUIV2.vue"
import PlayListSelectionElementUIV2 from "../common/playListSelection/PlayListSelectionElementUIV2.vue"
import RoleListSelectionElementUIV2 from "../common/roleSelection/RoleSelectionElementUIV2.vue"

import {createArtistRequest, updateArtist} from "../../api/artist.js";

import {createPlayListRequest, updatePlayList} from "../../api/play_list.js";
import {createTagRequest, updateTag} from "../../api/tag.js";


const alert = ref(false);
const confirm = ref(false);

const prompt = ref(false);
const name = ref('');
const username =ref('');
const password =ref('');
const nickname =ref('');
const gender =ref(null);

const description=ref('');
const file = ref(null)
const fileId =ref(null)
const fileEdit =ref(null)
const id =ref(null)
const recommendFactor=ref(null)
const recommended=ref(null)
const special=ref(false)
const musicIdList= ref(null)


const musicIdListFromChild=ref(null);
const musicIdListFromFather=ref(null);

const playListIdListFromChild=ref(null);
const playListIdListFromFather=ref(null);

const roleListIdListFromChild=ref(null);
const roleListIdListFromFather=ref(null);

const artist = ref(props.rowData||{name: '', remark: '', file: null})
const playList=ref(null)
const user=ref(null)

const isEdit =ref(null)



const label = ref('封面文件');

const $q = useQuasar()

const store = useStore()

const emit = defineEmits(['fetchData']);


onMounted(()=> {


})

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


//子组件
const RefChildrenMusic=ref(null)

const initMusicData=()=>{
  RefChildrenMusic.value.getMusicListData();
}


const createUser = () => {
  //获取对象的时候不能放到函数外面，不然的话只能获取初值
  // playList.value = {name: name.value, description: description.value, coverId:fileId.value,musicIdList:musicIdListFromChild.value,recommendFactor:recommendFactor.value,recommended:recommended.value,special:special.value};
  user.value ={username:username.value,password:password.value,nickname:nickname.value,gender:gender.value,roleIdList:roleListIdListFromChild.value,playListIdList:playListIdListFromChild.value}


  createUserRequest(user.value).then(res => {
    console.log(res);
    fetchDataFromFather();
    $q.notify({message: '创建成功', position: "top", type: 'positive',});

  })



}

const editUser = ()=>{
  // playList.value = {id:id.value,name: name.value, description: description.value, coverId:fileId.value,musicIdList:musicIdListFromChild.value,recommendFactor:recommendFactor.value,recommended:recommended.value,special:special.value};
  // if (playList.value.recommended === false){
  //   playList.value.recommendFactor =0;
  // }
  // user.value ={id:id.value,name:name.value,musicIdList:musicIdListFromChild.value,playListIdList:playListIdListFromChild.value}
  user.value ={id:id.value,username:username.value,nickname:nickname.value,gender:gender.value,roleIdList:roleListIdListFromChild.value,playListIdList:playListIdListFromChild.value}

  updateUser(user.value.id,user.value).then(res=>{
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
  special.value=false;

  musicIdListFromChild.value=null
  musicIdListFromFather.value=null

  playListIdListFromChild.value=null
  playListIdListFromFather.value=null

  roleListIdListFromChild.value=null
  roleListIdListFromFather.value=null

  console.log(isEdit.value)
  //转换对话框的显示状态
  prompt.value = !prompt.value



  //清空input
  name.value = ''
  description.value = ''

  username.value='';
  password.value='';
  nickname.value='';
  gender.value=null;

}

const togglePromptEdit =()=>{

  isEdit.value=true;

  username.value='';
  password.value='';
  nickname.value='';
  gender.value=null;

  file.value=null;
  fileId.value=null;
  fileEdit.value=null;
  id.value =null;

  musicIdListFromChild.value=null
  musicIdListFromFather.value=null

  playListIdListFromChild.value=null
  playListIdListFromFather.value=null

  roleListIdListFromChild.value=null
  roleListIdListFromFather.value=null

  nextTick(()=>{
    //转换对话框的显示状态
    prompt.value = !prompt.value

  })




  username.value=props.rowData.username;
  password.value=props.rowData.password;
  nickname.value=props.rowData.nickname;
  gender.value=props.rowData.gender;


  // description.value=props.rowData.description;

  // if (props.rowData.photo !== null){
  //   file.value=props.rowData.cover;
  //   fileId.value=props.rowData.cover.id;
  // }

  // fileEdit.value=props.rowData.cover

  id.value = props.rowData.id;
  // recommendFactor.value=props.rowData.recommendFactor
  // recommended.value=props.rowData.recommended
  // special.value=props.rowData.special

  // musicIdListFromChild.value=props.rowData.musicList.map(item=>item.id)
  // musicIdListFromFather.value=musicIdListFromChild.value
  //
  //
  if (props.rowData.playList) {
    playListIdListFromChild.value=props.rowData.playList.map(item=>item.id)
    playListIdListFromFather.value=playListIdListFromChild.value
  }


  if (props.rowData.roleList) {
    roleListIdListFromChild.value = props.rowData.roleList.map(item => item.id)
    roleListIdListFromFather.value = roleListIdListFromChild.value
  }
}

const inputSelectMusicList=(musicIdList)=>{
  musicIdListFromChild.value=musicIdList
  console.log(musicIdListFromChild.value)
}

const inputSelectPlayList=(playListIdList)=>{
  playListIdListFromChild.value=playListIdList
  console.log(playListIdListFromChild.value)
}
const inputSelectRoleList=(roleListIdList)=>{
  roleListIdListFromChild.value=roleListIdList
  console.log(roleListIdListFromChild.value)
}
//暴露函数给父组件
defineExpose({
  togglePrompt,
  togglePromptEdit
})


</script>

<style scoped>

</style>