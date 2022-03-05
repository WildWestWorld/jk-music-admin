<template>
  <div>
<!--    v-if 为真的时候显示-->
    <CosUploader :label="props.label"  @uploadedF="uploadedF" v-if="file === null"></CosUploader>

    <div v-else>
      {{file.name+'.'+file.ext}}
      <q-btn @click="reUpload">重新上传</q-btn>

    </div>

  </div>


</template>

<script setup>
import CosUploader from "./uploaderComponent/useCosUploader.js";
import {ref,defineProps,defineEmits} from "vue"

const props = defineProps({label:{type:String}})
const emit = defineEmits(['uploadedGF'])


const file =ref(null)

const reUpload =()=>{
  file.value=null;
  emit('uploadedGF',null)

}

const uploadedF = (res)=>{
  file.value = res;
  emit('uploadedGF',file.value)
  console.log(file)
}

</script>

<style scoped>

</style>