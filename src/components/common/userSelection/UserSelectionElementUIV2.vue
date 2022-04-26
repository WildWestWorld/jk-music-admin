<template>
  <div class="screening-config">
    <div class="title">选择标签</div>
    <el-select-v2 @change=showValue  	 v-model="selectUserList"     :options="UserList"
                  filterable  multiple clearable
                  collapse-tags
                  collapse-tags-tooltip
                  popper-class="test"
                  :teleported="true"
                  size="large" placeholder="请选择标签"  style=" width:100%;max-width: 320px; " >


      <template #default="{ item }" style="width: 100%;">
        <span style="margin-right: 8px;" >{{ item.label }}</span>


        <!--        <img style="float: right;width: 30px;height: 30px" :src="item.url" />-->
      </template>

    </el-select-v2>
  </div>
</template>

<script setup>
import 'element-plus/es/components/message/style/css'
import { ElMessage,ElSelect,ElOption,ElCard,ElSelectV2 } from 'element-plus'

import {onMounted, ref,onBeforeMount} from 'vue'
import {defineProps,defineExpose} from "vue"
import {getArtistList} from "../../../api/artist.js";
import {getMusicList} from "../../../api/music.js";
import {getTagList} from "../../../api/tag.js";
import {getRoleList} from "../../../api/role.js";
import {getUserList} from "../../../api/user.js";
const options=ref([])
const selectUserList = ref('')
const UserList =ref([])
const initUserList =ref([])
const selectOptionWidth =ref(null)


onMounted(()=> {

  getUserListData()



})

const getUserListData=()=>{

  getUserList().then(res => {
    // //传入已有的歌手
    if (props.UserListFromFather !==null){
      selectUserList.value=props.UserListFromFather;
      console.log(props)
    }
    initUserList.value = res.data

    UserList.value=initUserList.value



    UserList.value=UserList.value.map((item)=>({
      value:item.id,
      // label:item.name,

      label:item.username,
    }))

  })
}


const emit =defineEmits(['UserSelectionElementUI']);




const props = defineProps(
    {
      UserListFromFather:{type:Array,default:[]},
    })


defineExpose({
  getUserListData
})


const showValue=()=>{
  emit('UserSelectionElementUI',selectUserList.value)
}






</script>

<style >





</style>