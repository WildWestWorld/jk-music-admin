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

      <template v-slot:body-cell-musicState="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline :color="musicStatusColor[props.value]" :label="props.value" />
          </div>
        </q-td>
      </template>


      <template v-slot:body-cell-operation="props">
        <q-td :props="props">
          <div class="q-mt-md q-mb-md">
            <q-btn-dropdown color="primary" label="编辑"  @click="edit(props.row)" split>

            <q-list>
              <q-item clickable v-close-popup v-if="props.row.musicState !== '已上架'" @click="publishMusic(props.row.id)">
                <q-item-section>
                  <q-item-label>上架</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup  v-if="props.row.musicState !== '已下架'" @click="closedMusic(props.row.id)">
                <q-item-section>
                  <q-item-label>下架</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup  v-if="props.row.musicState !== '待上架'" @click="freeMusic(props.row.id)">
                <q-item-section>
                  <q-item-label>闲置</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup  @click="openConfirmDialog(props.row.id)">
                <q-item-section>
                  <q-item-label>删除</q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
            </q-btn-dropdown>

          </div>
        </q-td>
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
import {useQuasar} from "quasar";
import {deletePlayList} from "../../api/play_list.js";

const $q = useQuasar()

const columns = [
  {name:"id",label: 'Id', field: 'id', sortable: true, align: 'left'},
  {name:"name",label: '歌曲名', field: 'name', sortable: true, align: 'left'},
  {name:"description",label: '简介', field: 'description', sortable: true, align: 'left'},
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
  getPageByMusicName(newCurrent, newPagination.rowsPerPage, "").then(res => {
    console.log(pagination.value.rowsPerPage)
    console.log(res);
    rows.value = res.data.records;
    total.value = res.data.total;
    sortNum.value=([ 3, 5, 7, 10, 15, 20, 25, 50,total.value]);

    if (res.data.records === null){
      current.value=1;
    }

  })
})



const getPaginationLabel =(firstRowIndex, endRowIndex, totalRowsNumber)=>{

  // firstRowIndex=pagination.value.rowsPerPage*(current.value-1)+1
  // endRowIndex= pagination.value.rowsPerPage*(current.value-1) + rows.value.length
  //
  totalRowsNumber=total.value;

  // return `${firstRowIndex}-${endRowIndex} of total:${totalRowsNumber}`

  return `TOTAL:${totalRowsNumber}`
}


const fetchData = () => {

  getPageByMusicName(current.value, pagination.value.rowsPerPage, "").then(res => {
    console.log(pagination.value.rowsPerPage)
    console.log(res);
    rows.value = res.data.records;
    total.value = res.data.total;
    // pagination.value.rowsNumber=total.value;
  })
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

</script>


<style scoped>
.page {
  padding: 30px
}
</style>