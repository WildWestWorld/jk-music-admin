<template>
  <div>
    <q-uploader
        :url="url"
        style="max-width: 300px"
        @added="onFileAdded"

        :factory ="startUpload"
    />
  </div>
</template>

<script setup>
import {ref} from 'vue';
import COS from 'cos-js-sdk-v5'
import {finishUpload, initUpload} from "../../../api/file.js";
import { computed } from 'vue'
import md5 from "md5";
import {useStore} from "vuex";
import {useQuasar} from "quasar";


const url =ref("/api/files/upload_init");
const filesArray = ref(null)
const uploadFile = ref({name:'',size: null,hashKey:null,ext: null})

const fileId =ref(null)
//Set是es6新增的数据结构，似于数组，但它的一大特性就是所有元素都是唯一的，没有重复的值，我们一般称为集合。
const uploadedFiles = ref(new Set());
const taskId = ref('');

const store =useStore();
const bucket = store.getters.bucket;
const region = store.getters.region;

const CosNeedParam =ref({TmpSecretId:null,TmpSecretKey: null,SecurityToken:null,StartTime: null,ExpiredTime:null,ScopeLimit: true});


const $q = useQuasar()


const onFileAdded =(file)=>{
  console.log(file)
  filesArray.value =file;
  console.log(filesArray.value[0])

  uploadFile.value={
    name: filesArray.value[0].name.substring(0, filesArray.value[0].name.lastIndexOf('.')),
    size: filesArray.value[0].size,
    hashKey: md5(filesArray.value[0].lastModified+new Date().getTime()),
    ext: filesArray.value[0].name.substring(filesArray.value[0].name.lastIndexOf('.')+1)
  }




}

//初始化cos
const createCos =()=>{
  return new COS({
    getAuthorization: function (options, callback) {
      callback({
        TmpSecretId: CosNeedParam.value.TmpSecretId,
        TmpSecretKey: CosNeedParam.value.TmpSecretKey,
        SecurityToken: CosNeedParam.value.SecurityToken,
        StartTime: CosNeedParam.value.StartTime , // 时间戳，单位秒，如：1580000000
        ExpiredTime: CosNeedParam.value.ExpiredTime      ,
        ScopeLimit: true // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
      })
    }
  })
}

const startUpload= ()=>{
  //向后端请求后得到的参数
  initUpload(uploadFile.value).then(res => {
    console.log(res.data);

    fileId.value = res.data.fileId;
    console.log(fileId)

    CosNeedParam.value.TmpSecretId=res.data.secretId;
    CosNeedParam.value.TmpSecretKey=res.data.secretKey;
    CosNeedParam.value.SecurityToken= res.data.sessionToken;
    CosNeedParam.value.StartTime= res.data.startTime ; // 时间戳，单位秒，如：1580000000
    CosNeedParam.value.ExpiredTime= res.data.expiredTime;

    //使用方法初始化cos
    const cos =createCos();
    cos.uploadFile({
      Bucket: bucket,
      Region: region,
      Key: uploadFile.value.hashKey,
      Body: filesArray.value[0],
      SliceSize: 1024 * 1024 * 10,

      onFileFinish: () => {
        finishUpload(fileId.value).then(res=>{
          console.log(res.data)
          uploadedFiles.value.add(filesArray.value[0]);

          $q.notify({
            type: 'positive',
            message: '上传成功',
            position:"top"
          })


        })
      }

    }).then(res=>{console.log(res)})

  })

}




</script>

<style scoped>

</style>