import COS from 'cos-js-sdk-v5';
import {createUploaderComponent, useQuasar} from 'quasar';

import { computed, ref ,defineEmits} from 'vue';
import md5 from 'md5';
import { useStore } from 'vuex';
import {finishUpload, initUpload} from "../../../../api/file.js";


//用于自定义上传组件
export default createUploaderComponent({
    // defining the QUploader plugin here

    name: 'CosUploader', // your component's name

    props: {
        // ...your custom props
    },

    emits: ['uploadedF'],

    injectPlugin({ props, emit, helpers }) {

        const fileId = ref(null);
        const filesArray = ref(null)
        const uploadFile = ref({name:'',size: null,hashKey:null,ext: null})
        const CosNeedParam =ref({TmpSecretId:null,TmpSecretKey: null,SecurityToken:null,StartTime: null,ExpiredTime:null,ScopeLimit: true});

        const uploadedFiles = ref(new Set());

        const store = useStore();
        const bucket = store.getters.bucket;
        const region = store.getters.region;

        const isUploading = ref(false);
        const isBusy = ref(false);

        const taskId = ref('');

        const $q = useQuasar()

        const abort = e => {

        };

        const upload = () => {
            console.log(helpers)
            //获取file对象
            filesArray.value = helpers.queuedFiles._rawValue
            uploadFile.value={
                name: filesArray.value[0].name.substring(0, filesArray.value[0].name.lastIndexOf('.')),
                size: filesArray.value[0].size,
                hashKey: md5(filesArray.value[0].lastModified+new Date().getTime()),
                ext: filesArray.value[0].name.substring(filesArray.value[0].name.lastIndexOf('.')+1)
            }
            startUpload();
            isUploading.value = true;
        };

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

        //开始上传
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
                    onTaskReady(id) {
                        taskId.value = id;

                    },

                    onProgress: function (progressData) {
                        isBusy.value = false;
                        isUploading.value = true;
                        helpers.updateFileStatus(filesArray.value[0], 'uploading', progressData.loaded);
                    },

                    onFileFinish: () => {
                        //改变上传状态 变为上传完成
                        finishUpload(fileId.value).then(res=>{
                            console.log(res.data)

                            helpers.updateFileStatus(filesArray.value[0], 'uploaded', filesArray.value[0].size);
                            helpers.uploadedFiles.value.push(filesArray.value[0])	;
                            helpers.uploadedSize.value = helpers.uploadedSize.value+filesArray.value[0].size;
                            helpers.queuedFiles.value = [];
                            isUploading.value = false;

                            emit("uploadedF",res.data)

                            uploadedFiles.value.add(filesArray.value[0]);
                            console.log(helpers)
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



        //废弃
        const uploadFiles = () => {
            const file = helpers.queuedFiles.value[0];

            cos.uploadFile({
                Bucket: bucket,
                Region: region,

                Body: file,
                SliceSize: 1024 * 1024 * 10,

                onTaskReady(id) {
                    taskId.value = id;

                },
                onProgress: function (progressData) {
                    isBusy.value = false;
                    isUploading.value = true;
                    helpers.updateFileStatus(file, 'uploading', progressData.loaded);
                },
                onFileFinish: () => {
                    finishUpload(fileId.value).then(uploadedFile => {
                        helpers.updateFileStatus(file, 'uploaded', file.size);
                        helpers.uploadedFiles.value = [file];
                        helpers.uploadedSize.value = file.size;
                        helpers.queuedFiles.value = [];
                        isUploading.value = false;

                        emit('file-uploaded', uploadedFile);
                    });
                }
            });
        };

        return {
            isUploading,
            abort,
            upload
        };
    }
});