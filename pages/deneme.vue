<script lang="ts" setup>
import { type TDATA } from '~/models/TDATA';


const z = ref();



onMounted(async () => {

});

const qwe = async () => {
  const q = useFetch(`/api/get/getARandomWord`, {
    method: 'GET'
  })
}
</script>

<template>
  <button @click="qwe()">sadasdasd</button>
</template>

<style scoped>

</style>
