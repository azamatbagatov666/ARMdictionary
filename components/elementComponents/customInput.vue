<script setup lang="ts">
const model = defineModel()

const props = defineProps({
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  }
});


</script>

<template>
  <input class="bg-white px-2 rounded-lg text-black border-2 border-[rgb(128,128,128)] h-8" v-model="model" :type="props.type" autocomplete="off" :placeholder="placeholder">
</template>

<style scoped>
/*a*/


</style>
