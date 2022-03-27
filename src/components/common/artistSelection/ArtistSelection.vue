<template>
  <div>
<!--    废弃，该quasar组件有BUG，搜索后文字不删除-->
    <q-select
        filled
        v-model="selectedArtistArray"
        use-input
        use-chips
        clearable
        multiple
        input-debounce="0"
        label="歌手"
        hint="请输入歌手名称进行检索"
        :options="artistList"
        @filter="onSearch"
        style="width: 250px; padding-bottom: 32px"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            无查询结果
          </q-item-section>
        </q-item>
      </template>

    </q-select>
  </div>
</template>

<script setup>
  import {computed,ref,onMounted,watch}from 'vue';
  import {getMusicList} from "../../../api/music.js";
  import {getArtistList} from "../../../api/artist.js";
  const selectedArtistArray =ref(null)
  const artistList =ref([])
  // const options= ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']
  const initArtistList =ref([])
  const watchVal=ref('')


  onMounted(()=> {
   getArtistList().then(res => {
     initArtistList.value = res.data.map(item => {
        return item.name
      })
     artistList.value=initArtistList.value
     console.log( artistList.value)
    })
  })

  // 单值监听
  watch(watchVal,(newValue,oldValue)=>{

    artistList.value=artistList.value.filter(item=>{
      return item.toString().includes(newValue)
    })
  })

  //来源：http://www.quasarchs.com/vue-components/select/#%E5%AE%89%E5%85%A8%E5%A4%84%E7%90%86
  //该方法是quasar的方法，我们只是自定义了一下，用于选项的过滤
  //val是输入框输入的内容
  // abort()就是停止检索的动画
  //使用前必须使用update不然没法用
  const onSearch =(val,update,abort)=>{
    //如果没有输入的内容就让他不要触发下面update里面的内容
    if (val===''){
      update(()=>{
        artistList.value=initArtistList.value;
      });
      abort();
      return
    }

  update(()=>{
   watchVal.value=val
    // artistList.value=artistList.value.filter(item=>{
    //   return item.toString().includes(val)
    // })
    console.log(val)

    getArtistList(val).then(res=>{
      artistList.value=res.data.map(item=>{
        return item.name
      })

      console.log(res)
    })
    console.log(artistList.value)
    console.log(selectedArtistArray.value)




  })
    //search止
  }

</script>

<style scoped>

</style>