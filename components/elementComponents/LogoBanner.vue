<script lang="ts" setup>

const languageState = useLanguageState();

</script>

<template>

<div class="flex justify-left 2xl:absolute">
      <img src="/goryun.png" class="size-24 sm:size-28 pointer-events-none" draggable="false"/>
      <img v-if="languageState == 'am'" src="/avedikyan_am.png" class="h-24 sm:h-28 pointer-events-none" draggable="false"/>
      <img v-else src="/avedikyan_tr.png" class="h-24 sm:h-28 pointer-events-none" draggable="false"/>
    </div>
</template>

<style scoped></style>