<template>
  <div class="page">

    <div class="q-mt-md q-mb-md">
      <q-btn color="primary" label="添加用户" @click="toggleDialog()"/>
    </div>

    <q-table
        title="Treats"
        :rows="rows"
        :columns="columns"
        row-key="name"

        v-model:pagination="pagination"

        v-model:rows-per-page-options="sortNum"
        :pagination-label="getPaginationLabel"


    >

      <template v-slot:body-cell-operation="props">
        <q-td :props="props">
          <div class="q-mt-md q-mb-md">
            <q-btn flat color="primary" label="编辑" @click="edit(props.row)"/>
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
      <CreateUserDialog ref="RefChildren" @fetchData="fetchData" :editRow="editRow"></CreateUserDialog>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, onMounted, defineComponent} from "vue";
import {getPageByUsername} from "../../api/user.js";
import {nextTick,watch,watchEffect, toRefs} from 'vue'

import CreateUserDialog from "../../components/user/CreateUserDialog.vue";

const columns = [
  {name:"id",label: 'Id', field: 'id', sortable: true, align: 'left'},
  {name:"username",label: '用户名', field: 'username', sortable: true, align: 'left'},
  {name:"nickname",label: '昵称', field: 'nickname', sortable: true, align: 'left'},
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
const editRow =ref(null)

//子组件
const RefChildren = ref(null)

const pagesNumber = computed(() => Math.ceil(total.value / pagination.value.rowsPerPage))
//父调子
const toggleDialog = () => {
  RefChildren.value.togglePrompt();
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
  getPageByUsername(newCurrent, newPagination.rowsPerPage, "").then(res => {
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

  getPageByUsername(pagination.value.page, pagination.value.rowsPerPage, "").then(res => {
    console.log(pagination.value.rowsPerPage)
    console.log(res);
    rows.value = res.data.records;
    total.value = res.data.total;
    // pagination.value.rowsNumber=total.value;
  })
}


onMounted(fetchData);

const edit =(row)=>{
  editRow.value =row;
  console.log(editRow.value)
}



</script>


<style scoped>
.page {
  padding: 30px
}
</style>