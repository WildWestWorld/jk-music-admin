<template>
  <div class="login-page">
    <q-card class="formContainer">
      <div class="title">捷凯音乐后台</div>
    <!--        @submit="onSubmit"-->
    <!--        @reset="onReset"-->
    <q-form

        class="q-gutter-md "
    >
      <q-input
          filled

          label="用户名:"
          hint="请输入用户名"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请输入用户名']"
      />

      <q-input
          filled
          type="password"
          hint="请输入密码"
          label="密码:"
          lazy-rules
          :rules="[val => val && val.length > 0 || '请输入密码']"


      />

      <q-toggle v-model="accept" label="记住我" />

      <div>
        <q-btn label="登录" type="submit" color="primary"/>
        <q-btn label="注册" type="submit" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>

    </q-card>



  </div>
</template>

<script>
import {ref} from "vue";

export default {
  name: "Login",
  //设置初始值
  setup(){
    const accept = ref(false);
    return{
      accept
    }
  }
}
</script>

<style scoped lang="less">
.login-page{
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .formContainer{
    width: 22vw;
    padding: 20px;
    .title{
      font-size: 35px;
      text-align: center;
      margin-bottom: 25px;
    }
  }

}

</style>