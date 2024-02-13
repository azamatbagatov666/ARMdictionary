<script setup lang="ts">
const canan = ref("sasas");
const search = ref<HTMLInputElement | null>(null);

const select = () => {
    search.value?.focus();
    search.value?.select();
}
</script>

<template>

    <input class="text-black" ref="search">

</template>


<style scoped>

/*dsss*/

</style>