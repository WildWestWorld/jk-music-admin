<template>
  <div class="login-page">
    <q-card class="formContainer">
      <div class="title">捷凯音乐后台</div>

    <!--        @reset="onReset"-->
    <q-form
        @submit="onSubmit(username,password)"
        class="q-gutter-md "
    >
      <q-input
          filled
          v-model="username"
          label="用户名:"
          hint="请输入用户名"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请输入用户名']"
      />

      <q-input
          filled
          v-model="password"
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
import {useStore} from 'vuex'
import {useRoute, useRouter} from "vue-router";
export default {
  name: "Login",
  //设置初始值
  setup(){
    const accept = ref(false);
    const username =ref('');
    const password =ref('');
    const store=useStore()
    const route =useRoute()
    const router =useRouter()
    // 方法区
    const onSubmit=(username,password)=>{
      //dispatch：含有异步操作，数据提交至 actions ，可用于向后台提交数据
      store.dispatch('login',{username,password}).then(res=>{
        //router.push路由跳转，如果
        //$route.query (如果 URL 中有查询参数) 我们查询的就是redirect的值
        router.push({path:   (route.query.redirect||'/') });
      })
    }

    return{
      accept,
      username,
      password,
      onSubmit
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