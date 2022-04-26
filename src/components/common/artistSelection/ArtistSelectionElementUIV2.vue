<template>
  <div class="screening-config">

  <div class="title">选择歌手</div>
    <el-select-v2 @change=showValue v-model="selectArtistList"     :options="artistList"
                  filterable  multiple clearable
                  popper-class="test"

                  size="large" placeholder="请选择歌手"  style="width:100%;max-width: 320px;" >


      <template #default="{ item }">
        <span style="float: left">{{ item.label }}</span>
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
import {getArtistList, getArtistSelectionList} from "../../../api/artist.js";
const options=ref([])
const selectArtistList = ref('')
const artistList =ref([])
const initArtistList =ref([])

onMounted(()=> {


  getArtistSelectionList().then(res => {
    // //传入已有的歌手
    if (props.artistListFromFather !==null){
      selectArtistList.value=props.artistListFromFather;
    }
    initArtistList.value = res.data

    artistList.value=initArtistList.value

    artistList.value=artistList.value.map((item)=>({value:item.id,
      label:item.name,
      // url:item.photo.url
      }))

  })



})




const emit =defineEmits(['ArtistSelectionElementUI']);




const props = defineProps(
    {
      artistListFromFather:{type:Array,default:[]},
    })





const showValue=()=>{
  emit('ArtistSelectionElementUI',selectArtistList.value)
}


</script>

<style scoped>

.title {
}
</style>