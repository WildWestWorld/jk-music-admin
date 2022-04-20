<template>
  <div class="page">

<!--    <div class="q-mt-md q-mb-md">-->
<!--      <q-btn color="primary" label="添加音乐" @click="toggleDialog()"/>-->
<!--    </div>-->

    <q-table
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="id"
        @update:pagination="updateData"

        v-model:pagination="pagination"

        v-model:rows-per-page-options="sortNum"
        :pagination-label="getPaginationLabel"

    >
      <!--      <template v-slot:body-cell-你想使用插槽columns的名字="props">-->

      <template v-slot:body-cell-name="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge  color="deep-orange-6" :label="props.value" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-singerName="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline color="blue" :label="props.row.singers.map(item=>item.name).join('/')"  />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-musicImage="props">
        <q-td :props="props" key="id">
          <div >
            <img :src="props.row.imgItems[2].img" alt="" style=" max-height: 75px">
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-lyric="props">
        <q-td :props="props" key="id">
          <div >
            <q-badge outline color="green" label="歌词下载"  @click="downLoadMusicLyc(props.row)" />


          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-albumName="props">
        <q-td :props="props" key="id">
          <div >
            <q-badge outline :color="props.row.albums?'red':'grey'" :label="props.row.albums?props.row.albums.map(item=>item.name).join('/'):'未被收录进专辑'"  />

          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-playMusic="props">
        <q-td :props="props" key="id">
          <div>
            <q-btn color="secondary" icon-right="play_circle_filled" label="音乐播放" @click="props.row.wantPlay= true" v-show="props.row.wantPlay!== true"/>

            <audio controls :src="props.row.rateFormats[0].url.replace('ftp://218.200.160.122:21','https://freetyst.nf.migu.cn')" v-if="props.row.newRateFormats[0].url !==null && props.row.wantPlay === true"></audio>
          </div>
        </q-td>
      </template>


      <template v-slot:body-cell-operation="props">
        <q-td :props="props">
          <div class="q-mt-md q-mb-md">
            <q-btn-dropdown color="primary" label="下载歌曲"  @click="downLoadMusicFilePQ(props.row)" split>

              <q-list>
                <q-item clickable v-close-popup  @click="downLoadMusicFileGQ(props.row)">
                  <q-item-section>
                    <q-item-label>下载高清音乐</q-item-label>
                  </q-item-section>
                </q-item>


                <q-item clickable v-close-popup  @click="downLoadMusicFileWS(props.row)">
                  <q-item-section>
                    <q-item-label>下载无损音乐</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup  @click="downLoadMusicImgSmall(props.row)" >
                  <q-item-section>
                    <q-item-label>音乐封面(小)</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup  @click="downLoadMusicImgMiddle(props.row)" >
                  <q-item-section>
                    <q-item-label>音乐封面(中)</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup  @click="downLoadMusicImgBig(props.row)" >
                  <q-item-section>
                    <q-item-label>音乐封面(大)</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
            </q-btn-dropdown>

          </div>
        </q-td>
      </template>

      <!--    顶部搜索栏-->
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="请输入关键字" @keyup.enter.native="searchDataByName">
          <template v-slot:append>
            <q-icon name="search" @click="searchDataByName"/>
          </template>
        </q-input>
      </template>

      <!--表格中的某个字段设置样式 cell后面的英文就是该字段-->
      <template v-slot:header-cell-playMusic="props" >
        <q-th :props="props" style="width: 350px;">
          {{ props.col.label }}
        </q-th>
      </template>

    </q-table>

    <div class="row justify-center q-mt-md">
      <q-pagination
          v-model="current"
          color="grey-8"
          :max="pagesNumber"
          size="sm"
          @click="updateData"
      />
<!--      <CreateMusicDialog ref="RefChildren" @fetchData="fetchData" :rowData="rowData">></CreateMusicDialog>-->

      <q-dialog v-model="confirmDelete" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="red" text-color="white" />
            <span class="q-ml-sm">您确定要删除吗?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" color="primary" v-close-popup />
            <q-btn flat label="确定" color="primary" v-close-popup @click="deleteMusicById()"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </div>
</template>

<script setup>
import {computed, ref, onMounted, defineComponent} from "vue";
import {getPageByUsername} from "../../api/user.js";
import {nextTick,watch,watchEffect, toRefs} from 'vue'

import CreateMusicDialog from "../../components/music/CreateMusicDialog.vue";
import ArtistSelectionElementUI from "../../components/common/artistSelection/ArtistSelectionElementUI.vue"

import {
  changeMusicStateToClosed,
  changeMusicStateToPublic,
  changeMusicStateToWaited, deleteMusic,
  getPageByMusicName
} from "../../api/music.js";
import {musicStatusColor} from '../../utils/musicSlotColorEnum.js';
import {useQuasar} from "quasar";
import {deletePlayList} from "../../api/play_list.js";
import {freeMusicFromFreeMp3, searchFromGM} from "../../api/freeMusic.js";
import axios from "axios";
import {encode} from "../../utils/encodeObsfuscator.js";

const $q = useQuasar()

const columns = [
  {name:"id",label: 'ID', field: 'id', sortable: true, align: 'left'},

  {name:"name",label: '歌曲名', field: 'name', sortable: true, align: 'left'},
  {name:"singerName",label: '歌手名', field: 'singerName', sortable: true, align: 'left'},
  {name:"albumName",label: '专辑名', field: 'albumName', sortable: true, align: 'left'},

  {name:"playMusic",label: '音乐播放', field: 'playMusic', align: 'left'},
  {name:"musicImage",label: '音乐图片', field: 'musicImage',  align: 'left'},
  {name:"lyric",label: '歌词下载', field: 'lyric',  align: 'left'},

  {name:"operation",label: '操作', field: 'operation', align: 'left'},


]
const rows = ref([])
const total = ref(null)
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  //默认打开页面在第几页
  page: 1,
  //默认每页多少个
  rowsPerPage: 10,
  // rowsNumber: xx if getting data from a server

})
const current =ref(1);
const allNum =ref(1);
const sortNum =ref([ 3, 5, 7, 10, 15, 20, 25, 50 ]);

const rowData =ref(null)
const confirmDelete= ref (null)
const rowId=ref(null)

const wantPlay=ref(false)
const filter =ref(null)
const searchSwitch=ref(null)


//子组件
const RefChildren = ref(null)

const pagesNumber = computed(() => Math.ceil(total.value / pagination.value.rowsPerPage))
//父调子
const toggleDialog = () => {
  RefChildren.value.togglePrompt();
}

//父调子
const toggleDialogEdit = () => {
  RefChildren.value.togglePromptEdit();
}


//暂时废弃
const updateData = () => {



  // //因为quaser组件的更新太快了，pagination.value.rowsPerPage还没有改变就触发了函数，导致组件无法正常工作
  // nextTick(() => {
  //
  //   getPageByUsername(current.value, pagination.value.rowsPerPage, "").then(res => {
  //     console.log(pagination.value.rowsPerPage)
  //
  //     console.log(res);
  //     rows.value = res.data.records;
  //     pagination.value.page=current.value
  //     return pagination
  //   })
  // })
}
// 单值监听
// watch(current,(newValue,oldValue)=>{
//
//   getPageByUsername(newValue, pagination.value.rowsPerPage, "").then(res => {
//     console.log(pagination.value.rowsPerPage)
//     console.log(res);
//     rows.value = res.data.records;
//     total.value = res.data.total;
//   })
// })



// 多值监听
watch([pagination,current],([newPagination,newCurrent],[oldPagination,oldCurrent])=>{
  console.log(newCurrent)


  searchSwitch.value={song:1,album:0,singer:0,tagSong:0,mvSong:0,songlist:0,bestShow:1}
  if (filter.value !== null) {
    searchFromGM('Android_migu', '5.0.1', filter.value, newCurrent, newPagination.rowsPerPage, searchSwitch.value).then(res => {

      console.log(pagination.value.rowsPerPage)
      console.log(res);


      rows.value = res.data.songResultData.result
      total.value = res.data.songResultData.totalCount
      sortNum.value = ([3, 5, 7, 10, 15, 20, 25, 50, total.value]);

      if (res.data.records === null) {
        current.value = 1;
      }

    })
  }

})



const getPaginationLabel =(firstRowIndex, endRowIndex, totalRowsNumber)=>{

  // firstRowIndex=pagination.value.rowsPerPage*(current.value-1)+1
  // endRowIndex= pagination.value.rowsPerPage*(current.value-1) + rows.value.length
  //
  totalRowsNumber=total.value;

  // return `${firstRowIndex}-${endRowIndex} of total:${totalRowsNumber}`

  return `TOTAL:${totalRowsNumber}`
}


const fetchDataFromGM = () => {








  // searchSwitch.value={song:1,album:0,singer:0,tagSong:0,mvSong:0,songlist:0,bestShow:1}
  //
  // searchFromGM('Android_migu','5.0.1','周杰伦',current.value,pagination.value.rowsPerPage,searchSwitch.value).then(res=>{
  //
  //   console.log(res)
  //   rows.value =res.data.songResultData.result
  //   total.value = res.data.songResultData.totalCount
  //
  //   console.log(rows.value)
  // })

}

const searchDataByName =()=>{


  searchSwitch.value={song:1,album:0,singer:0,tagSong:0,mvSong:0,songlist:0,bestShow:1}

  searchFromGM('Android_migu','5.0.1',filter.value,current.value,999999999999,searchSwitch.value).then(res=>{

  console.log(res)
    rows.value =res.data.songResultData.result
    total.value = res.data.songResultData.totalCount


  })
  // getPageByMusicName(current.value, pagination.value.rowsPerPage, filter.value).then(res => {
  //   console.log(pagination.value.rowsPerPage)
  //   console.log(res);
  //   rows.value = res.data.records;
  //   total.value = res.data.total;
  //   // pagination.value.rowsNumber=total.value;
  // })
}

onMounted(()=>{
  fetchDataFromGM()

});

const edit =(row)=>{
  console.log(current.value)
  rowData.value =row;
  console.log(rowData.value)

  nextTick(()=>{
    toggleDialogEdit()
  })

}

const publishMusic=(id)=>{
  changeMusicStateToPublic(id).then(res=>{
    console.log(res)
    fetchData();
    $q.notify({message: '上架成功', position: "top", type: 'positive',});
  })
}

const closedMusic =(id)=>{
  changeMusicStateToClosed(id).then(res=>{
    console.log(res)
    fetchData();
    $q.notify({message: '下架成功', position: "top", type: 'positive',});
  })
}

const freeMusic =(id)=>{
  changeMusicStateToWaited(id).then(res=>{
    console.log(res)
    fetchData();
    $q.notify({message: '闲置成功', position: "top", type: 'positive',});
  })
}

const openConfirmDialog =(id)=>{
  confirmDelete.value=true
  rowId.value =id

}

const deleteMusicById =()=>{
  if (rowId.value !== null) {
    deleteMusic(rowId.value).then(res => {
      console.log(res)
      fetchData();
      $q.notify({message: '删除成功', position: "top", type: 'positive',});
    })
  }
  rowId.value=null;
}

 const downLoadMusicLyc =(row)=>{

    console.log(row.lyricUrl)
   // window.open(row.lyricUrl,'blank')
   //使用下blob下载请求的时候记得要加上responseType: 'blob' 不然可能出现中文乱码
   axios.get(row.lyricUrl,{ responseType: 'blob' }).then(res=>{

    //content就是你下载的内容
     let content=res.data

     //创建一个a标签
     let a = document.createElement('a');
     //创建一个用于下载的url 记得要是blob类型不然没法正常下载 注意这个content就是我们要下载的文件内容
     let url = window.URL.createObjectURL(new Blob([content],
         { type:"charset=" + ( 'utf-8') }));
     //将a标签的href设置为url
     a.href = url;
     //将a标签的download属性设置为我们想要的文件名即可
     a.download =  row.name+'-'+row.singers.map(item=>item.name).join('/')+'.'+'lyc';
     //然后我们设置一个a标签的click事件，这样就会开始下载了
     a.click();
     //销毁我们前面设置的a标签
     window.URL.revokeObjectURL(url);
   })

}

const downLoadMusicFilePQ=(row)=>{

    // window.open(row.rateFormats[0].url.replace('ftp://218.200.160.122:21','https://freetyst.nf.migu.cn'),'blank')
  axios.get(row.rateFormats[0].url.replace('ftp://218.200.160.122:21','https://freetyst.nf.migu.cn').replace('https://freetyst.nf.migu.cn','musicFile'),{ responseType: 'blob' }).then(res=>{

    //content就是你下载的内容
    let content=res.data

    //创建一个a标签
    let a = document.createElement('a');
    //创建一个用于下载的url 记得要是blob类型不然没法正常下载 注意这个content就是我们要下载的文件内容
    let url = window.URL.createObjectURL(new Blob([content],
        { type:"charset=" + ( 'utf-8') }));
    //将a标签的href设置为url
    a.href = url;
    //将a标签的download属性设置为我们想要的文件名即可
    a.download =  row.name+'-'+row.singers.map(item=>item.name).join('/')+'.'+'mp3';
    //然后我们设置一个a标签的click事件，这样就会开始下载了
    a.click();
    //销毁我们前面设置的a标签
    window.URL.revokeObjectURL(url);

  })

}


const downLoadMusicFileGQ=(row)=>{

  axios.get(row.rateFormats[1].url.replace('ftp://218.200.160.122:21','https://freetyst.nf.migu.cn').replace('https://freetyst.nf.migu.cn','musicFile'),{ responseType: 'blob' }).then(res=>{

    //content就是你下载的内容
    let content=res.data

    //创建一个a标签
    let a = document.createElement('a');
    //创建一个用于下载的url 记得要是blob类型不然没法正常下载 注意这个content就是我们要下载的文件内容
    let url = window.URL.createObjectURL(new Blob([content],
        { type:"charset=" + ( 'utf-8') }));
    //将a标签的href设置为url
    a.href = url;
    //将a标签的download属性设置为我们想要的文件名即可
    a.download =  row.name+'-'+row.singers.map(item=>item.name).join('/')+'.'+'mp3';
    //然后我们设置一个a标签的click事件，这样就会开始下载了
    a.click();
    //销毁我们前面设置的a标签
    window.URL.revokeObjectURL(url);

  })



}

const downLoadMusicFileWS=(row)=>{
  axios.get(row.rateFormats[2].url.replace('ftp://218.200.160.122:21','https://freetyst.nf.migu.cn').replace('https://freetyst.nf.migu.cn','musicFile'),{ responseType: 'blob' }).then(res=>{

    //content就是你下载的内容
    let content=res.data

    //创建一个a标签
    let a = document.createElement('a');
    //创建一个用于下载的url 记得要是blob类型不然没法正常下载 注意这个content就是我们要下载的文件内容
    let url = window.URL.createObjectURL(new Blob([content],
        { type:"charset=" + ( 'utf-8') }));
    //将a标签的href设置为url
    a.href = url;
    //将a标签的download属性设置为我们想要的文件名即可
    a.download =  row.name+'-'+row.singers.map(item=>item.name).join('/')+'.'+'mp3';
    //然后我们设置一个a标签的click事件，这样就会开始下载了
    a.click();
    //销毁我们前面设置的a标签
    window.URL.revokeObjectURL(url);

  })


}

const downLoadMusicImgSmall=(row)=>{

  var image = new Image()

  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  let type= 'png'
  let name =row.name+'-'+row.singers.map(item=>item.name).join('/')+'(小)'
  image.src = row.imgItems[2].img;
  image.onload = function () {
    // 创建一个canvas标签
    var canvas = document.createElement('canvas')
    // 设置canvas的宽高

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0);

    // 把canvas的内容转化为base64格式
    var imageType = type === "png" ? "image/png" : "image/jpeg";
    var base64url = canvas.toDataURL(imageType)

    // 生成一个a元素
    var a = document.createElement('a');
    a.download = name || '文件下载'
    a.href = base64url
    // 创建一个单击事件
    var event = new MouseEvent('click');

    // 触发a的单击事件
    a.dispatchEvent(event)
  }
  // window.open(row.imgItems[2].img,'blank')


}
const downLoadMusicImgMiddle=(row)=>{

  var image = new Image()

  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  let type= 'png'
  let name =row.name+'-'+row.singers.map(item=>item.name).join('/')+'(中)'
  image.src = row.imgItems[1].img;
  image.onload = function () {
    // 创建一个canvas标签
    var canvas = document.createElement('canvas')
    // 设置canvas的宽高

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0);

    // 把canvas的内容转化为base64格式
    var imageType = type === "png" ? "image/png" : "image/jpeg";
    var base64url = canvas.toDataURL(imageType)

    // 生成一个a元素
    var a = document.createElement('a');
    a.download = name || '文件下载'
    a.href = base64url
    // 创建一个单击事件
    var event = new MouseEvent('click');

    // 触发a的单击事件
    a.dispatchEvent(event)
  }
  // window.open(row.imgItems[1].img,'blank')


}

const downLoadMusicImgBig=(row)=>{
  var image = new Image()

  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  let type= 'png'
  let name =row.name+'-'+row.singers.map(item=>item.name).join('/')+'(大)'
  image.src = row.imgItems[1].img;
  image.onload = function () {
    // 创建一个canvas标签
    var canvas = document.createElement('canvas')
    // 设置canvas的宽高

    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    var context = canvas.getContext('2d')
    context.drawImage(image, 0, 0);

    // 把canvas的内容转化为base64格式
    var imageType = type === "png" ? "image/png" : "image/jpeg";
    var base64url = canvas.toDataURL(imageType)

    // 生成一个a元素
    var a = document.createElement('a');
    a.download = name || '文件下载'
    a.href = base64url
    // 创建一个单击事件
    var event = new MouseEvent('click');

    // 触发a的单击事件
    a.dispatchEvent(event)
  }

  // window.open(row.imgItems[0].img,'blank')


}
</script>


<style scoped>
.page {
  padding: 30px
}
</style>