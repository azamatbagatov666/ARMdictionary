<script setup lang="ts">
const props = defineProps(['text']);

</script>

<template>
  <button class="bg-white px-4 rounded-lg text-black border border-black h-8" v-text="props.text"></button>
</template>

<style scoped>

button:active {
background-color: #ccc;
transform: scale(0.95);
}

</style>