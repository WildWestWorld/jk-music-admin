<template>
<div class="page">

  <div class="q-mt-md q-mb-md">
    <q-btn color="primary" label="添加用户" />
  </div>

  <q-table
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      v-model:pagination="pagination"
  />

  <div class="row justify-center q-mt-md">
    <q-pagination
        v-model="pagination.page"
        color="grey-8"
        :max="pagesNumber"
        size="sm"
    />
  </div>
</div>
</template>

<script>
import {computed,ref} from "vue";
import {getPageByUsername} from "../../api/user.js";

export default {
  name: "User",
  setup(){
    const columns = [
      { label: 'Id', field: 'id',sortable: true,align: 'left'},
      { label: '用户名', field: 'username', sortable: true,align: 'left'},
      { label: '昵称', field: 'nickname', sortable: true,align: 'left'},
    ]

    const rows=ref([])

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      //默认打开页面在第几页
      page: 1,
      //默认每页多少个
      rowsPerPage: 5
      // rowsNumber: xx if getting data from a server
    })

    //函数区
    const fetchData=()=>{
      getPageByUsername(pagination.page,pagination.rowsPerPage,"").then(res=>{
        console.log(res);
        rows.value=res.data.records;
      })
    }
    fetchData();
    return {

      columns,
      rows,
      pagination,
      pagesNumber: computed(() => Math.ceil(rows.length / pagination.value.rowsPerPage))
    }
  }
}
</script>


<style scoped>
.page{
  padding: 30px
}
</style>