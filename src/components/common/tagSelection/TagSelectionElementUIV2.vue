<template>
  <div class="screening-config">
    <div class="title">选择标签</div>
    <el-select-v2 @change=showValue  	 v-model="selectTagList"     :options="TagList"
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
const options=ref([])
const selectTagList = ref('')
const TagList =ref([])
const initTagList =ref([])
const selectOptionWidth =ref(null)


onMounted(()=> {

  getTagListData()



})

const getTagListData=()=>{

  getTagList().then(res => {
    // //传入已有的歌手
    if (props.TagListFromFather !==null){
      selectTagList.value=props.TagListFromFather;
      console.log(props)
    }
    initTagList.value = res.data

    TagList.value=initTagList.value



    TagList.value=TagList.value.map((item)=>({
      value:item.id,
      // label:item.name,

      label:item.name,
      }))

  })
}


const emit =defineEmits(['TagSelectionElementUI']);




const props = defineProps(
    {
      TagListFromFather:{type:Array,default:[]},
    })


defineExpose({
  getTagListData
})


const showValue=()=>{
  emit('TagSelectionElementUI',selectTagList.value)
}






</script>

<style >





</style>