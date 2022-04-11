<template>
  <el-card shadow="always" >
    <div class="title">选择音乐</div>
    <el-select-v2 @change=showValue v-model="selectMusicList"     :options="MusicList"
                  filterable  multiple clearable
                  size="large" placeholder="请选择音乐"  style="width:278px;" >


      <template #default="{ item }">
        <span style="float: left">{{ item.label }}</span>
<!--        <img style="float: right;width: 30px;height: 30px" :src="item.url" />-->
      </template>

    </el-select-v2>
  </el-card>

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

onMounted(()=> {


  getMusicList().then(res => {
    // //传入已有的歌手
    if (props.MusicListFromFather !==null){
      selectMusicList.value=props.MusicListFromFather;
    }
    initMusicList.value = res.data

    MusicList.value=initMusicList.value

    MusicList.value=MusicList.value.map((item)=>({value:item.id, label:item.name,url:item.file.url}))

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

<style scoped>

.title {
  padding: 0px 0 18px 0;
}
</style>