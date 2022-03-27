<script setup>

import {useStore} from "vuex";
import {onMounted} from "vue";

const store =useStore();
onMounted(store.dispatch("fetchSiteSetting"))

</script>

<template>
  <router-view />
</template>

<style></style>
