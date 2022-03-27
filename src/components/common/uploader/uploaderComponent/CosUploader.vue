<template>

</template>

<script setup>
import { createUploaderComponent } from 'quasar'
import { computed } from 'vue'


//废弃
export default createUploaderComponent({


  name: 'MyUploader',

  props: {
    label:{

    }
  },

  emits: [
  ],

  injectPlugin ({ props, emit, helpers }) {
    console.log(helpers)
    const isUploading = computed(() => {
      // return <Boolean>
    })


    const isBusy = computed(() => {
      // return <Boolean>
    })

    // [ REQUIRED! ]

    function abort () {
      // ...
    }

    // [ REQUIRED! ]

    function upload () {
      // ...
    }

    return {
      isUploading,
      isBusy,

      abort,
      upload
    }
  }
})


</script>

<style scoped>

</style>