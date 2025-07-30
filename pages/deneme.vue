<script setup lang="ts">


import { useWindowSize } from '@vueuse/core';
const { width } = useWindowSize();
const deneme = ref();




const getToday =  () => {
 console.log(width.value)
 console.log(width.value >= 1024)
 if (width.value <= 1024)
 deneme.value = true;

};


</script>

<template>
<div>
    <PhosphorIconPhone :size="32" color="#fafafa" weight="fill" @click="getToday" />
    <div v-if="deneme">denemelerce</div>
</div>
</template>

<style scoped>

</style>
