<template>
  <div>


    <!--    v-if 为真的时候显示-->
    <CosUploader :label="props.label+'上传'"  @uploadedF="uploadedF" v-if="file === null"></CosUploader>

    <div v-else>
<!--      {{file.name+'.'+file.ext}}-->
<!--      <q-btn @click="reUpload" >重新上传</q-btn>-->

      <q-field :color="props.label.toString().indexOf('封面') !== -1?'red':props.label.toString().indexOf('歌词') !== -1?'deep-purple-13':'blue'" filled :label="props.label+'名称'" stack-label >
        <template v-slot:prepend>
          <q-icon v-if="props.label.toString().indexOf('封面') !== -1" name="photo" />
          <q-icon v-if="props.label.toString().indexOf('音乐文件') !== -1" name="music_video" />
          <q-icon v-if="props.label.toString().indexOf('歌词') !== -1" name="note" />

        </template>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{file.name.search( /[^u4e00-u9fa5]/) !== -1?file.name.slice(0,15)+'.'+file.ext:file.name.slice(0,24)+'.'+file.ext}}</div>
        </template>
        <template v-slot:append>
          <q-icon name="close" class="cursor-pointer"  @click="reUpload"/>
        </template>
      </q-field>
    </div>














  </div>


</template>

<script setup>
import CosUploader from "./uploaderComponent/useCosUploader.js";
import {ref,defineProps,defineEmits,onMounted,nextTick} from "vue"
import 'element-plus/es/components/message/style/css'
import { ElMessage,ElSelect,ElOption,ElCard,ElSelectV2 } from 'element-plus'

const props = defineProps(
    {
      label:{type:String},
      fileEdit:{type:Object},
      musicPhotoFileEdit:{type:Object}

    })



const emit = defineEmits(['uploadedGF'])


const file =ref(null)
const text=ref('测试')


const reUpload =()=>{
  file.value=null;
  file.str=props.label
  // file.value


  console.log(props.label)
  console.log(file)
  emit('uploadedGF',file.value||file)

}

const fileFromFather =()=>{
    file.value= props.fileEdit
}

const uploadedF = (res)=>{
  file.value = res;
  emit('uploadedGF',file.value)
  console.log(file)

}




onMounted(fileFromFather)

</script>

<style scoped>

</style>