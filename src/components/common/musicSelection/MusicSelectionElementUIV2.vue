<template>
  <div class="screening-config">
    <div class="title">选择音乐</div>
    <el-select-v2 @change=showValue  	 v-model="selectMusicList"     :options="MusicList"
                  filterable  multiple clearable
                  collapse-tags
                  collapse-tags-tooltip
                  popper-class="test"
                  :teleported="true"
                  size="large" placeholder="请选择音乐"  style=" width:100%;max-width: 320px; " >


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
import {defineProps} from "vue"
import {getArtistList} from "../../../api/artist.js";
import {getMusicList} from "../../../api/music.js";
const options=ref([])
const selectMusicList = ref('')
const MusicList =ref([])
const initMusicList =ref([])
const selectOptionWidth =ref(null)

onMounted(()=> {


  getMusicList().then(res => {
    // //传入已有的歌手
    if (props.MusicListFromFather !==null){
      selectMusicList.value=props.MusicListFromFather;
      console.log(props)
    }
    initMusicList.value = res.data

    MusicList.value=initMusicList.value



    MusicList.value=MusicList.value.map((item)=>({
      value:item.id,
      // label:item.name,

      label:item.name+'-'+item.artistVoList.map(item=>item.name).join('/'),
      url:item.file.url}))

  })



})




const emit =defineEmits(['MusicSelectionElementUI']);




const props = defineProps(
    {
      MusicListFromFather:{type:Array,default:[]},
    })





const showValue=()=>{
  emit('MusicSelectionElementUI',selectMusicList.value)
}






</script>

<style >





</style>