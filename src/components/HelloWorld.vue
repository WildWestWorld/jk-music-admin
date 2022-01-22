<script setup>
import { ref } from 'vue'


const message =ref("欢迎回来")
const count = ref(0)
</script>

<template>
  <h1>{{ message }}</h1>

  <q-btn color="primary" @click="count++">点击次数: {{ count }}</q-btn>




</template>

<style scoped>
a {
  color: #42b983;
}
</style>
