<template>
<!--  废弃，现在已经升级到V2-->
  <el-card shadow="always" >
    <div class="title">选择歌手</div>
  <el-select @change=showValue v-model="selectArtistList" filterable  multiple   size="large" placeholder="请选择歌手"  style="width:100%;" >

    <el-option
        v-for="item in artistList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
        style="width:278px"

    >
    <span style="float: left">{{ item.name }}</span>
      <img style="float: right;width: 30px;height: 30px" :src="item.photo.url" />

    </el-option>
  </el-select>

    </el-card>

</template>

<script setup>
import 'element-plus/es/components/message/style/css'
import { ElMessage,ElSelect,ElOption,ElCard } from 'element-plus'

import {onMounted, ref,onBeforeMount} from 'vue'
import {defineProps} from "vue"
import {getArtistList} from "../../../api/artist.js";

const selectArtistList = ref('')
const options = ref([])
const artistList =ref([])
const initArtistList =ref([])

onMounted(()=> {


  getArtistList().then(res => {
    // //传入已有的歌手
    if (props.artistListFromFather !==null){
      selectArtistList.value=props.artistListFromFather;
    }
    initArtistList.value = res.data

    artistList.value=initArtistList.value


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
  padding: 0px 0 18px 0;
}
</style>