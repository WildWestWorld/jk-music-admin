<template>
  <div class="page">

    <div class="q-mt-md q-mb-md">
      <q-btn color="primary" label="添加歌手" @click="toggleDialog()"/>
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

      <template v-slot:body-cell-artistState="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline :color="musicStatusColor[props.value]" :label="props.value" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-recommended="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline :color="props.value?'deep-orange-10':'teal-10'" :label="props.value?'强烈推荐':'暂不推荐'" />
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-recommendFactor="props">
        <q-td :props="props" key="id">
          <div>
            <q-badge outline :color="'light-blue'" :label="props.value.toString()" />
          </div>
        </q-td>
      </template>



      <template v-slot:body-cell-operation="props">
        <q-td :props="props">
          <div class="q-mt-md q-mb-md">
            <q-btn-dropdown color="primary" label="编辑"  @click="edit(props.row)" split>

              <q-list>
                <q-item clickable v-close-popup v-if="props.row.artistState !== '已上架'" @click="publishArtist(props.row.id)">
                  <q-item-section>
                    <q-item-label>上架</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup  v-if="props.row.artistState !== '已下架'" @click="closedArtist(props.row.id)">
                  <q-item-section>
                    <q-item-label>下架</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup  v-if="props.row.artistState !== '待上架'" @click="freeArtist(props.row.id)">
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

      <!--表格中的某个字段设置样式 cell后面的英文就是该字段-->
      <template v-slot:header-cell-recommended="props" >
        <q-th :props="props" >
          <q-icon name="thumb_up" size="1.3em" color="red"/>
          {{ props.col.label }}
        </q-th>
      </template>


      <!--表格中的某个字段设置样式 cell后面的英文就是该字段-->
      <template v-slot:header-cell-recommendFactor="props" >
        <q-th :props="props"  >
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
      <CreateArtistDialog ref="RefChildren" @fetchData="fetchData" :rowData="rowData"></CreateArtistDialog>

      <q-dialog v-model="confirmDelete" persistent>
        <q-card>
          <q-card-section class="row items-center">
            <q-avatar icon="warning" color="red" text-color="white" />
            <span class="q-ml-sm">您确定要删除吗?</span>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" color="primary" v-close-popup />
            <q-btn flat label="确定" color="primary" v-close-popup @click="deleteArtistById()"/>
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

import CreateArtistDialog from "../../components/artist/CreateArtistDialog.vue";
import {
  changeMusicStateToClosed,
  changeMusicStateToPublic,
  changeMusicStateToWaited,
  getPageByMusicName
} from "../../api/music.js";
import {musicStatusColor} from '../../utils/musicSlotColorEnum.js';

import {useQuasar} from "quasar";
import {
  changeArtistStateToClosed,
  changeArtistStateToPublic,
  changeArtistStateToWaited, deleteArtist,
  getPageByArtistName
} from "../../api/artist.js";

const $q = useQuasar()

const columns = [
  {name:"id",label: 'Id', field: 'id', sortable: true, align: 'left'},
  {name:"name",label: '歌手名', field: 'name', sortable: true, align: 'left'},
  {name:"remake",label: '歌手简介', field: 'remark', sortable: true, align: 'left'},
  {name:"recommended",label: '是否推荐', field: 'recommended', sortable: true, align: 'left'},
  {name:"recommendFactor",label: '推荐指数', field: 'recommendFactor', sortable: true, align: 'left'},

  {name:"artistState",label: '歌手状态', field: 'artistState', sortable: true, align: 'left'},
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

const rowId=ref(null)

const confirmDelete=ref(null)

const rowData =ref(null)

const orderRecommend= ref(true);
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
      getPageByArtistName(newCurrent, newPagination.rowsPerPage, "").then(res => {
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

  getPageByArtistName(current.value, pagination.value.rowsPerPage, "").then(res => {
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

const publishArtist=(id)=>{

  changeArtistStateToPublic(id).then(res=>{
    console.log(res)
    fetchData();
    $q.notify({message: '上架成功', position: "top", type: 'positive',});
  })
}

const closedArtist =(id)=>{
  changeArtistStateToClosed(id).then(res=>{
    console.log(res)
    fetchData();
    $q.notify({message: '下架成功', position: "top", type: 'positive',});
  })
}

const freeArtist =(id)=>{
  changeArtistStateToWaited(id).then(res=>{
    console.log(res)
    fetchData();
    $q.notify({message: '闲置成功', position: "top", type: 'positive',});
  })
}


const openConfirmDialog =(id)=>{
  confirmDelete.value=true
  rowId.value =id

}

const deleteArtistById =()=>{
  if (rowId.value !== null) {
    deleteArtist(rowId.value).then(res => {
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