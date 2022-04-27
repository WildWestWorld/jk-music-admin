<template>
  <div class="screening-config">
    <div class="title">选择歌单</div>
    <el-select-v2 @change=showValue  	 v-model="selectPlayList"     :options="PlayList"
                  filterable  multiple clearable
                  collapse-tags
                  collapse-tags-tooltip
                  popper-class="test"
                  :teleported="true"
                  size="large" placeholder="请选择歌单"  style=" width:100%;max-width: 320px; " >


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
import {getPlayList, getPlaySelectionList} from "../../../api/play_list.js";

const options=ref([])
const selectPlayList = ref('')
const PlayList =ref([])
const initPlayList =ref([])
const selectOptionWidth =ref(null)


onMounted(()=> {

  getPlayListData()



})

const getPlayListData=()=>{

  getPlaySelectionList().then(res => {
    // //传入已有的歌手
    if (props.PlayListFromFather !==null){
      selectPlayList.value=props.PlayListFromFather;
      console.log(props)
    }
    initPlayList.value = res.data

    PlayList.value=initPlayList.value



    PlayList.value=PlayList.value.map((item)=>({
      value:item.id,
      // label:item.name,

      label:item.creator?item.name+'-'+item.creator.username:item.name,
    }))

  })
}


const emit =defineEmits(['PlaySelectionElementUI']);




const props = defineProps(
    {
      PlayListFromFather:{type:Array,default:[]},
    })


defineExpose({
  getPlayListData
})


const showValue=()=>{
  emit('PlaySelectionElementUI',selectPlayList.value)
}






</script>

<style >





</style>