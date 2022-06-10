<template>
  <div class="page">

    <div class="q-mt-md q-mb-md">
      <q-btn color="primary" label="添加音乐" @click="toggleDialog()"/>
    </div>


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

      <template v-slot:body-cell-album="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline :color="props.row.albumVoList.length !== 0?'blue':'grey'" :label="props.row.albumVoList.length !== 0 ? props.row.albumVoList.map(item=>item.name).join('/'):'暂未收录到专辑' " />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-artist="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline :color="props.row.artistVoList.length !== 0?'black':'grey'" :label="props.row.artistVoList.length !== 0 ? props.row.artistVoList.map(item=>item.name).join('/'):'暂未选定歌手' " />
          </div>
        </q-td>
      </template>


      <template v-slot:body-cell-tag="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline :color="props.row.tagList.length !== 0?'pink':'brown'" :label="props.row.tagList.length !== 0 ? props.row.tagList.map(item=>item.name).join('/'):'暂未设置标签' " />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-musicState="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline :color="musicStatusColor[props.value]" :label="props.value" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-playMusic="props">
        <q-td :props="props" key="id">
          <div>
            <q-btn color="secondary" icon-right="play_circle_filled" :label="props.row.tagLabel" @click="playMusicAudio(props.row)" v-show="props.row.wantPlay!== true"/>




            <audio controls :src="props.row.file.url" v-if="props.row.file.url !==null && props.row.wantPlay === true"></audio>
          </div>
        </q-td>
      </template>


      <template v-slot:body-cell-operation="props">
        <q-td :props="props">
          <div class="q-mt-md q-mb-md">
            <q-btn-dropdown color="primary" label="编辑音乐"  @click="edit(props.row)" split>

            <q-list>

<!--              <q-item clickable v-close-popup v-if="props.row.musicLabel !== '√音乐播放'" @click="downLoadMusicFilePQ(props.row)">-->
<!--                <q-item-section>-->
<!--                  <q-item-label>下载歌曲</q-item-label>-->
<!--                </q-item-section>-->
<!--              </q-item>-->

              <q-item clickable v-close-popup v-if="props.row.musicState !== '已上架'" @click="publishMusic(props.row.id)">
                <q-item-section>
                  <q-item-label>上架音乐</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup  v-if="props.row.musicState !== '已下架'" @click="closedMusic(props.row.id)">
                <q-item-section>
                  <q-item-label>下架音乐</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup  v-if="props.row.musicState !== '待上架'" @click="freeMusic(props.row.id)">
                <q-item-section>
                  <q-item-label>闲置音乐</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup  @click="openConfirmDialog(props.row.id)">
                <q-item-section>
                  <q-item-label>删除音乐</q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
            </q-btn-dropdown>
<!--    用于下载音乐的按钮-->
            <q-btn-dropdown color="deep-purple-7" label="下载音乐"  @click="downLoadMusicFilePQ(props.row)(props.row)" split style="margin-left: 30px"   v-if="props.row.musicLabel !== '√音乐播放'">

              <q-list>

                   <q-item clickable v-close-popup v-if="props.row.mgMusic" @click="downLoadMusicFilePQ(props.row)">
                         <q-item-section>
                         <q-item-label>下载音乐文件</q-item-label>
                    </q-item-section>
                  </q-item>

                <q-item clickable v-close-popup v-if="props.row.mgMusic" @click="downLoadMusicImg(props.row)" >
                  <q-item-section>
                    <q-item-label>下载音乐封面</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup v-if="props.row.mgMusic" @click="downLoadMusicLyc(props.row)">
                  <q-item-section>
                    <q-item-label>下载音乐歌词</q-item-label>
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
      <CreateMusicDialog ref="RefChildren" @fetchData="fetchData" :rowData="rowData">></CreateMusicDialog>

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
import {useQuasar,LoadingBar} from "quasar";
import {deletePlayList} from "../../api/play_list.js";
import {freeMusicFromFreeMp3, searchFromGM} from "../../api/freeMusic.js";
import axios from "axios";
import {encode} from "../../utils/encodeObsfuscator.js";

const $q = useQuasar()

// $q.loadingBar.setDefaults({
//
// })

const columns = [
  {name:"id",label: 'Id', field: 'id', sortable: true, align: 'left'},
  {name:"name",label: '歌曲名', field: 'name', sortable: true, align: 'left'},
  {name:"description",label: '简介', field: 'description', sortable: true, align: 'left'},
  {name:"artist",label: '歌手名', field: 'artist', align: 'left'},

  {name:"album",label: '专辑名', field: 'album', sortable: true, align: 'left'},
  {name:"tag",label: '标签', field: 'tag',  align: 'left'},
  {name:"playMusic",label: '音乐播放', field: 'playMusic', align: 'left'},
  {name:"musicState",label: '上架状态', field: 'musicState', sortable: true, align: 'left'},
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

const bar = ref(null)


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
  // LoadingBar.increment(0.2)


  // LoadingBar.increment(0.2)

  getPageByName(newCurrent,newPagination.rowsPerPage,"")


})



const getPaginationLabel =(firstRowIndex, endRowIndex, totalRowsNumber)=>{

  // firstRowIndex=pagination.value.rowsPerPage*(current.value-1)+1
  // endRowIndex= pagination.value.rowsPerPage*(current.value-1) + rows.value.length
  //
  totalRowsNumber=total.value;

  // return `${firstRowIndex}-${endRowIndex} of total:${totalRowsNumber}`

  return `TOTAL:${totalRowsNumber}`
}

const getPageByName =(pageNum,pageSize,SearchWord)=>{
  // axios.post('test/search',{data:SearchWord,v:2}).then(res=>{
  //   console.log(res)
  // })


  // filter.value='仙剑奇侠传'
  // if (filter.value !== null){
  //
  //
  //   let data =encode('text='+filter.value+'&page='+current.value+'&type=migu').slice(5,-1)
  //   let v =2
  //   console.log(data)
  //
  //   let params = new URLSearchParams();
  //   params.append("data",data)
  //   params.append("v",v)
  //
  //   freeMusicFromFreeMp3(params).then(res=>{
  //     console.log(res)
  //   })
  //
  // }
  //

  // const barRef=bar.value
  // barRef.start()
  // LoadingBar.increment(0.8)

  // $q.loadingBar.stop()

  getPageByMusicName(pageNum, pageSize, SearchWord).then(res => {
    // $q.loadingBar.stop()

    // LoadingBar.stop()

    console.log(pagination.value.rowsPerPage)
    console.log(res);
    res.data.records.map(item=>{item.tagLabel='音乐播放'})
    rows.value = res.data.records;


    // barRef.stop()

    rows.value.map((item,index)=>{
      // let searchSwitch={song:1,album:0,singer:0,tagSong:0,mvSong:0,songlist:0,bestShow:1}
      let searchWord = item.name+'-'+item.artistVoList[0].name
      // let searchWord = item.name+'-'+item.artistVoList[0].name

        let data =encode('text='+searchWord+'&page=1'+'&type=migu')
      // console.log(data)
         data =data.split("&")[0].split("=")[1]
        let v =2
        // console.log(data)

        let params = new URLSearchParams();
        params.append("data",data)
        params.append("v",v)

        freeMusicFromFreeMp3(params).then(res=> {
        // console.log( res.data)
        // console.log(res.data.data.list)
        // console.log(item.name)
        // res.data.data.list=res.data.data.list.filter(music=>music.name.indexOf(item.name) !== -1)
          let dataList =res.data.data.list
          res.data.data.list=res.data.data.list.filter(music=>music.name===(item.name))

          if (res.data.data.list.length === 0) {
            console.log(item.name,item.name,item.name)
            res.data.data.list = dataList.filter(music => music.name.indexOf(item.name) !== -1)

            if (res.data.data.list.length !== 0) {
              console.log(res.data.data.list[0].name)
            }
          }
          console.log( res.data.data)
        if ( res.data.data.list[0]) {

          // console.log(res.data.data.list[0])
          let ourArtist = item.artistVoList[0].name
          // console.log(ourArtist)
          let MGArtist =res.data.data.list.filter(list=>list.artist.includes(ourArtist))
          console.log(MGArtist)



          if (res.data.data.list != null && (MGArtist.length!== 0)  ) {
            item.file.url = res.data.data.list[0].url
            item.tagLabel='√音乐播放'
            item.mgMusic=res.data.data.list[0]
          }


        }

      })

    })

    total.value = res.data.total;
    // pagination.value.rowsNumber=total.value;

    sortNum.value=([ 3, 5, 7, 10, 15, 20, 25, 50,total.value]);

    if (res.data.records === null){
      current.value=1;
    }

  })
}

const fetchData = () => {


  getPageByName(current.value,pagination.value.rowsPerPage,"")
}

const searchDataByName =()=>{

  getPageByName(current.value,pagination.value.rowsPerPage,filter.value)
}

onMounted(fetchData);

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

const playMusicAudio =(row)=>{
  row.wantPlay = true
  //  let searchSwitch={song:1,album:0,singer:0,tagSong:0,mvSong:0,songlist:0,bestShow:1}
  //   let searchWord = row.name+''+row.artistVoList[0].name
  //     console.log(searchWord)
  // searchFromGM('Android_migu','5.0.1',searchWord,current.value,pagination.value.rowsPerPage,searchSwitch).then(res=> {
  //
  //   if ( res.data.songResultData.result[0]) {
  //
  //   console.log(res)
  //   let ourArtist = row.artistVoList[0].name
  //   console.log(ourArtist)
  //   let MGArtist = res.data.songResultData.result[0].singers.map(item => item.name).includes(ourArtist)
  //
  //   console.log(MGArtist)
  //   if (res.data.songResultData.result != null && (MGArtist === true)) {
  //     row.file.url = res.data.songResultData.result[0].rateFormats[0].url.replace('ftp://218.200.160.122:21', 'https://freetyst.nf.migu.cn')
  //     row.wantPlay = true
  //     row.MGRes=res.data;
  //   }else {
  //     //有歌但不是一个作者的歌
  //     row.wantPlay = true
  //   }
  //
  //
  // }else {
  //     //GM没有的歌
  //     row.wantPlay = true
  //   }
  //
  // })


}


const downLoadMusicFilePQ=(row)=>{
  console.log(row)
  window.open(row.file.url.replace("http://218.205.239.34","/encodeMusicFile"),'blank')

  //
  // const config = {
  //   baseURL: row.file.url,
  //
  //
  // };

  // console.log(axios.getUri(config))

  // console.log(row.file.url)
  // window.open(row.rateFormats[0].url.replace('ftp://218.200.160.122:21','https://freetyst.nf.migu.cn'),'blank')
  // axios.get(row.file.url.replace("http://218.205.239.34","/encodeMusicFile"),{ responseType: 'blob',redirect:'follow',headers: { 'Content-Type': 'application/x-www-form-urlencoded'} }).then(res=>{
  //
  //   console.log(res)
  //   //content就是你下载的内容
  //   let content=res.data
  //
  //   //创建一个a标签
  //   let a = document.createElement('a');
  //   //创建一个用于下载的url 记得要是blob类型不然没法正常下载 注意这个content就是我们要下载的文件内容

  //   let url = window.URL.createObjectURL(new Blob([content],
  //       { type:"charset=" + ( 'utf-8') }));
  //   //将a标签的href设置为url
  //   a.href = url;
  //   //将a标签的download属性设置为我们想要的文件名即可
  //   a.download =  row.name+'-'+row.artistVoList.map(item=>item.name).join('/')+'.'+'mp3';
  //   //然后我们设置一个a标签的click事件，这样就会开始下载了
  //   a.click();
  //   //销毁我们前面设置的a标签
  //   window.URL.revokeObjectURL(url);
  //
  // })

}
const downLoadMusicLyc=(row)=>{
  console.log(row.mgMusic.lrc)
  // window.open(row.mgMusic.lyricUrl,'blank')
  //使用下blob下载请求的时候记得要加上responseType: 'blob' 不然可能出现中文乱码
  axios.get(row.mgMusic.lrc,{ responseType: 'blob' }).then(res=>{

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
    a.download =  row.name+'-'+row.artistVoList.map(item=>item.name).join('/')+'.'+'txt';
    //然后我们设置一个a标签的click事件，这样就会开始下载了
    a.click();
    //销毁我们前面设置的a标签
    window.URL.revokeObjectURL(url);
  })
}

const downLoadMusicImg=(row)=>{

  var image = new Image()

  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous');
  let type= 'png'
  let name =row.name+'-'+row.artistVoList.map(item=>item.name).join('/')
  image.src = row.mgMusic.cover;
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

</script>


<style scoped>
.page {
  padding: 30px
}
</style>