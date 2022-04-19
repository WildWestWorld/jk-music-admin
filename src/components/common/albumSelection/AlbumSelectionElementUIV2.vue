<template>
  <div class="screening-config">
    <div class="title">选择专辑</div>
    <el-select-v2 @change=showValue  	 v-model="selectAlbumList"     :options="AlbumList"
                  filterable  multiple clearable
                  collapse-tags
                  collapse-tags-tooltip
                  popper-class="test"
                  :teleported="true"
                  size="large" placeholder="请选择专辑"  style=" width:100%;max-width: 320px; " >


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
import {getAlbumList} from "../../../api/album.js";
const options=ref([])
const selectAlbumList = ref('')
const AlbumList =ref([])
const initAlbumList =ref([])
const selectOptionWidth =ref(null)

onMounted(()=> {


  getAlbumList().then(res => {
    // //传入已有的歌手
    if (props.AlbumListFromFather !==null){
      selectAlbumList.value=props.AlbumListFromFather;
      console.log(props)
    }
    initAlbumList.value = res.data

    AlbumList.value=initAlbumList.value



    AlbumList.value=AlbumList.value.map((item)=>({
      value:item.id,
      // label:item.name,

      label:item.name
     }))

  })



})




const emit =defineEmits(['AlbumSelectionElementUI']);




const props = defineProps(
    {
      AlbumListFromFather:{type:Array,default:[]},
    })





const showValue=()=>{
  emit('AlbumSelectionElementUI',selectAlbumList.value)
}






</script>

<style >





</style>