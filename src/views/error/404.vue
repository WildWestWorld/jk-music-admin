<template>
  <div class="page">
    <div class="error-text">404</div>
    <div class="tips">抱歉，您访问的页面不存在！</div>

    <div class="button-area">
      <q-btn color="primary" label="返回" @click="backUrl"/>
      <q-btn  outline  color="white" text-color="black" label="首页"  @click="toIndex" />

    </div>

  </div>
</template>

<script>
export default {
  name: "404",
  methods:{

    backUrl(){
    this.$router.back();
    },

    toIndex(){
    this.$router.push("/index")
    },

  }
}
</script>

<style scoped lang="less">
.page{
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .error-text{
    font-size: 40vh;
    line-height: 400px;
  }
  .tips{
    margin-bottom: 40px;
    color: #999999;
  }
  .button-area{
    width: 200px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
}
</style>